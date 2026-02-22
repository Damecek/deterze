const members = [
  {
    name: "Zita",
    role: "Zpěv",
    note: "Výrazný ženský vokál a emoce, které drží koncertní energii kapely.",
    image: "public/hero-800h.jpeg"
  },
  {
    name: "Jenda",
    role: "Kytara",
    note: "Autorské riffy a melodie, které formují rockový zvuk Deterze.",
    image: "public/header-800h.png"
  },
  {
    name: "Peťa",
    role: "Basa",
    note: "Pevný groove a rytmická opora kapely.",
    image: "public/hero-700h.jpeg"
  },
  {
    name: "Onďa",
    role: "Bicí",
    note: "Dynamika, tempo a tah dopředu od prvního do posledního taktu.",
    image: "public/deterze_logo-800h.jpeg"
  }
];

const songs = [
  {
    title: "Deterze – skladba 1",
    url: "https://www.youtube.com/watch?v=fR25w1PvgRs",
    thumb: "https://i.ytimg.com/vi/fR25w1PvgRs/hqdefault.jpg"
  },
  {
    title: "Deterze – skladba 2",
    url: "https://www.youtube.com/watch?v=p827aJ7uGWI",
    thumb: "https://i.ytimg.com/vi/p827aJ7uGWI/hqdefault.jpg"
  },
  {
    title: "Deterze – skladba 3",
    url: "https://www.youtube.com/watch?v=Inut9Eg--2s",
    thumb: "https://i.ytimg.com/vi/Inut9Eg--2s/hqdefault.jpg"
  },
  {
    title: "Deterze – skladba 4",
    url: "https://www.youtube.com/watch?v=1uBWzLrD_lw",
    thumb: "https://i.ytimg.com/vi/1uBWzLrD_lw/hqdefault.jpg"
  }
];

const gallery = [
  {
    src: "public/hero-800h.jpeg",
    caption: "[PLACEHOLDER_FOTO_01]"
  },
  {
    src: "public/hero-700h.jpeg",
    caption: "[PLACEHOLDER_FOTO_02]"
  },
  {
    src: "public/header-800h.png",
    caption: "[PLACEHOLDER_FOTO_03]"
  },
  {
    src: "public/deterze_logo-800h.jpeg",
    caption: "[PLACEHOLDER_FOTO_04]"
  }
];

function renderMembers() {
  const target = document.getElementById("members-grid");
  target.innerHTML = members
    .map(
      (member) => `
        <article class="card">
          <img class="member-photo" src="${member.image}" alt="${member.name} – ${member.role}" loading="lazy" />
          <div class="card-content">
            <h3>${member.name}</h3>
            <div class="role">${member.role}</div>
            <p>${member.note}</p>
          </div>
        </article>
      `
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
      `
    )
    .join("");
}

function renderGallery() {
  const target = document.getElementById("gallery-grid");
  target.innerHTML = gallery
    .map(
      (item) => `
        <figure class="gallery-item">
          <img src="${item.src}" alt="${item.caption}" loading="lazy" />
          <figcaption class="gallery-caption">${item.caption}</figcaption>
        </figure>
      `
    )
    .join("");
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

function init() {
  renderMembers();
  renderSongs();
  renderGallery();
  setupMenu();
  document.getElementById("year").textContent = new Date().getFullYear();
}

init();
