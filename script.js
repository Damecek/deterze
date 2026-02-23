const members = [
  {
    name: "Zita",
    role: "Zpěv",
    note: "Výrazný ženský vokál a emoce, které drží koncertní energii kapely.",
    image: "public/zita.jpeg",
    style: "object-position: 0 13%;",
  },
  {
    name: "Jenda",
    role: "Kytara",
    note: "Autorské riffy a melodie, které formují rockový zvuk Deterze.",
    image: "public/jenda.jpeg",
    style: "object-position: 0 40%;",
  },
  {
    name: "Peťa",
    role: "Basa",
    note: "Pevný groove a rytmická opora kapely.",
    image: "public/peta.jpeg",
    style: "object-position: 0 10%;",
  },
  {
    name: "Onďa",
    role: "Bicí",
    note: "Dynamika, tempo a tah dopředu od prvního do posledního taktu.",
    image: "public/onda.webp",
  },
];

const songs = [
  {
    title: "Deterze - Často si myslím (Official Video)",
    url: "https://www.youtube.com/watch?v=fR25w1PvgRs",
    thumb: "https://i.ytimg.com/vi/fR25w1PvgRs/hqdefault.jpg",
  },
  {
    title: "Deterze - Samota (live in Havlíčkův Brod)",
    url: "https://www.youtube.com/watch?v=p827aJ7uGWI",
    thumb: "https://i.ytimg.com/vi/p827aJ7uGWI/hqdefault.jpg",
  },
  {
    title: "Deterze - Běž (live in Havlíčkův Brod)",
    url: "https://www.youtube.com/watch?v=Inut9Eg--2s",
    thumb: "https://i.ytimg.com/vi/Inut9Eg--2s/hqdefault.jpg",
  },
  {
    title: "Deterze - Stále marný (live in Havlíčkův Brod)",
    url: "https://www.youtube.com/watch?v=1uBWzLrD_lw",
    thumb: "https://i.ytimg.com/vi/1uBWzLrD_lw/hqdefault.jpg",
  },
];

const galleryDirectory = "public/galery/";
const galleryManifestPath = `${galleryDirectory}gallery.json`;
const allowedGalleryExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".avif",
];
let galleryLightbox;
let galleryLightboxImage;

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderMembers() {
  const target = document.getElementById("members-grid");
  target.innerHTML = members
    .map(
      (member) => `
        <article class="card">
          <img class="member-photo" style="${member.style}" src="${member.image}" alt="${member.name} – ${member.role}" loading="lazy" />
          <div class="card-content">
            <h3>${member.name}</h3>
            <div class="role">${member.role}</div>
            <p>${member.note}</p>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderSongs() {
  const target = document.getElementById("songs-grid");
  target.innerHTML = songs
    .map(
      (song) => `
        <a class="song-card" href="${song.url}" target="_blank" rel="noopener noreferrer">
          <img src="${song.thumb}" alt="Náhled videa: ${song.title}" loading="lazy" />
          <span>${song.title}</span>
        </a>
      `,
    )
    .join("");
}

function isGalleryImage(fileName) {
  const lowerName = fileName.toLowerCase();
  return allowedGalleryExtensions.some((extension) =>
    lowerName.endsWith(extension),
  );
}

function normalizeGallerySrc(fileName) {
  if (fileName.startsWith("http://") || fileName.startsWith("https://")) {
    return fileName;
  }

  const trimmedFileName = fileName.replace(/^\.?\//, "");
  return `${galleryDirectory}${encodeURIComponent(trimmedFileName).replaceAll("%2F", "/")}`;
}

function dedupeAndSortGallery(items) {
  const uniqueBySrc = Array.from(
    new Map(items.map((item) => [item.src, item])).values(),
  );
  return uniqueBySrc.sort((a, b) => a.src.localeCompare(b.src, "cs"));
}

async function loadGalleryFromManifest() {
  if (window.location.protocol === "file:") {
    return { items: [], reason: "file-protocol" };
  }

  const response = await fetch(galleryManifestPath, { cache: "no-store" });
  if (!response.ok) {
    return { items: [], reason: "manifest-not-found" };
  }

  const manifest = await response.json();
  const namesFromManifest = Array.isArray(manifest)
    ? manifest
    : Array.isArray(manifest.images)
      ? manifest.images
      : [];

  const galleryItems = namesFromManifest
    .filter((fileName) => typeof fileName === "string" && isGalleryImage(fileName))
    .map((fileName) => ({
      src: normalizeGallerySrc(fileName),
    }));

  return {
    items: dedupeAndSortGallery(galleryItems),
    reason: "ok",
  };
}

async function loadGalleryFromDirectory() {
  if (window.location.protocol === "file:") {
    return { items: [], reason: "file-protocol" };
  }

  const response = await fetch(galleryDirectory, { cache: "no-store" });
  if (!response.ok) {
    return { items: [], reason: "not-found" };
  }

  const html = await response.text();
  const parser = new DOMParser();
  const documentContent = parser.parseFromString(html, "text/html");

  const galleryItems = Array.from(documentContent.querySelectorAll("a"))
    .map((link) => link.getAttribute("href") || "")
    .filter((href) => href && !href.endsWith("/") && isGalleryImage(href))
    .map((href) => ({
      src: normalizeGallerySrc(href),
    }));

  return {
    items: dedupeAndSortGallery(galleryItems),
    reason: "ok",
  };
}

async function loadGallery() {
  const manifestResult = await loadGalleryFromManifest();
  if (manifestResult.items.length > 0 || manifestResult.reason === "file-protocol") {
    return manifestResult;
  }

  const directoryResult = await loadGalleryFromDirectory();
  if (directoryResult.items.length > 0 || directoryResult.reason === "file-protocol") {
    return directoryResult;
  }

  return {
    items: [],
    reason: manifestResult.reason === "manifest-not-found" ? "manifest-not-found" : "not-found",
  };
}

async function renderGallery() {
  const target = document.getElementById("gallery-grid");

  try {
    const { items: gallery, reason } = await loadGallery();

    if (gallery.length === 0) {
      if (reason === "file-protocol") {
        target.innerHTML = `
          <figure class="gallery-item">
            <div class="gallery-empty">Galerie se přes <code>file://</code> nenačte. Spusť lokální server (např. <code>python3 -m http.server</code>) a otevři stránku přes <code>http://localhost:8000</code>.</div>
          </figure>
        `;
        return;
      }

      target.innerHTML = `
        <figure class="gallery-item">
          <div class="gallery-empty">Do složky <code>public/galery/</code> přidej fotky a aktualizuj soubor <code>public/galery/gallery.json</code>.</div>
        </figure>
      `;
      return;
    }

    target.innerHTML = gallery
      .map(
        (item) => `
          <figure class="gallery-item">
            <button
              class="gallery-trigger"
              type="button"
              data-src="${escapeHtml(item.src)}"
              aria-label="Otevřít fotku v plné velikosti"
            >
              <img src="${escapeHtml(item.src)}" alt="Fotka kapely Deterze" loading="lazy" />
            </button>
          </figure>
        `,
      )
      .join("");
  } catch {
    target.innerHTML = `
      <figure class="gallery-item">
        <div class="gallery-empty">Galerii se nepodařilo načíst automaticky. Zkontroluj složku <code>public/galery/</code>.</div>
      </figure>
    `;
  }
}

function openGalleryLightbox(src) {
  galleryLightboxImage.src = src;
  galleryLightboxImage.alt = "Fotka kapely Deterze";
  galleryLightbox.classList.add("open");
  galleryLightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
}

function closeGalleryLightbox() {
  if (!galleryLightbox.classList.contains("open")) {
    return;
  }

  galleryLightbox.classList.remove("open");
  galleryLightbox.setAttribute("aria-hidden", "true");
  galleryLightboxImage.src = "";
  galleryLightboxImage.alt = "";
  document.body.classList.remove("no-scroll");
}

function setupGalleryLightbox() {
  const galleryGrid = document.getElementById("gallery-grid");

  galleryLightbox = document.createElement("div");
  galleryLightbox.className = "gallery-lightbox";
  galleryLightbox.setAttribute("aria-hidden", "true");
  galleryLightbox.innerHTML = `
    <div class="gallery-lightbox-backdrop" data-lightbox-close></div>
    <figure class="gallery-lightbox-content" role="dialog" aria-modal="true" aria-label="Zvětšená fotka z galerie">
      <button class="gallery-lightbox-close" type="button" aria-label="Zavřít fotku">×</button>
      <img src="" alt="" />
    </figure>
  `;
  document.body.append(galleryLightbox);

  galleryLightboxImage = galleryLightbox.querySelector("img");

  galleryGrid.addEventListener("click", (event) => {
    const trigger = event.target.closest(".gallery-trigger");
    if (!trigger) {
      return;
    }
    openGalleryLightbox(trigger.dataset.src);
  });

  galleryLightbox.addEventListener("click", (event) => {
    if (
      event.target.matches("[data-lightbox-close]") ||
      event.target.closest(".gallery-lightbox-close")
    ) {
      closeGalleryLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeGalleryLightbox();
    }
  });
}

function setupMenu() {
  const button = document.querySelector(".menu-toggle");
  const menu = document.getElementById("menu");

  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!expanded));
    menu.classList.toggle("open");
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      button.setAttribute("aria-expanded", "false");
    });
  });
}

async function init() {
  renderMembers();
  renderSongs();
  setupGalleryLightbox();
  await renderGallery();
  setupMenu();
  document.getElementById("year").textContent = new Date().getFullYear();
}

init();
