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
    title: "Deterze – skladba 1",
    url: "https://www.youtube.com/watch?v=fR25w1PvgRs",
    thumb: "https://i.ytimg.com/vi/fR25w1PvgRs/hqdefault.jpg",
  },
  {
    title: "Deterze – skladba 2",
    url: "https://www.youtube.com/watch?v=p827aJ7uGWI",
    thumb: "https://i.ytimg.com/vi/p827aJ7uGWI/hqdefault.jpg",
  },
  {
    title: "Deterze – skladba 3",
    url: "https://www.youtube.com/watch?v=Inut9Eg--2s",
    thumb: "https://i.ytimg.com/vi/Inut9Eg--2s/hqdefault.jpg",
  },
  {
    title: "Deterze – skladba 4",
    url: "https://www.youtube.com/watch?v=1uBWzLrD_lw",
    thumb: "https://i.ytimg.com/vi/1uBWzLrD_lw/hqdefault.jpg",
  },
];

const galleryDirectory = "public/galery/";
const allowedGalleryExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".avif",
];

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

function fileNameToCaption(fileName) {
  return fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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
    .map((href) => {
      const normalizedHref = href.startsWith("http")
        ? href
        : `${galleryDirectory}${href.replace(/^\.\//, "")}`;
      const fileName = decodeURIComponent(href.split("/").pop());
      return {
        src: normalizedHref,
        caption: fileNameToCaption(fileName),
      };
    });

  const uniqueBySrc = Array.from(
    new Map(galleryItems.map((item) => [item.src, item])).values(),
  );
  return {
    items: uniqueBySrc.sort((a, b) => a.caption.localeCompare(b.caption, "cs")),
    reason: "ok",
  };
}

async function renderGallery() {
  const target = document.getElementById("gallery-grid");

  try {
    const { items: gallery, reason } = await loadGalleryFromDirectory();

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
          <div class="gallery-empty">Do složky <code>public/galery/</code> přidej fotky (.jpg/.png/.webp) a galerie se načte automaticky.</div>
        </figure>
      `;
      return;
    }

    target.innerHTML = gallery
      .map(
        (item) => `
          <figure class="gallery-item">
            <img src="${item.src}" alt="${item.caption}" loading="lazy" />
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
  await renderGallery();
  setupMenu();
  document.getElementById("year").textContent = new Date().getFullYear();
}

init();
