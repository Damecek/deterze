const members = [
  {
    name: "Zita",
    role: "Zpěvačka",
    note: "[PLACEHOLDER_MEDAILONEK_ZITA]"
  },
  {
    name: "Jenda",
    role: "Kytarista",
    note: "[PLACEHOLDER_MEDAILONEK_JENDA]"
  },
  {
    name: "Onďa",
    role: "Basa",
    note: "[PLACEHOLDER_MEDAILONEK_ONDA]"
  },
  {
    name: "Peťa",
    role: "Bicí",
    note: "[PLACEHOLDER_MEDAILONEK_PETA]"
  }
];

const gallery = [
  "[PLACEHOLDER_TOP_FOTO_01 • název akce • místo • rok]",
  "[PLACEHOLDER_TOP_FOTO_02 • název akce • místo • rok]",
  "[PLACEHOLDER_TOP_FOTO_03 • promo foto • fotograf • rok]",
  "[PLACEHOLDER_TOP_FOTO_04 • live • klub/festival • rok]",
  "[PLACEHOLDER_TOP_FOTO_05 • kapela + fanoušci • místo • rok]",
  "[PLACEHOLDER_TOP_FOTO_06 • backstage/studio • rok]"
];

function renderMembers() {
  const target = document.getElementById("members-grid");
  target.innerHTML = members
    .map(
      (member) => `
        <article class="card">
          <div class="placeholder-image">Foto člena</div>
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

function renderGallery() {
  const target = document.getElementById("gallery-grid");
  target.innerHTML = gallery
    .map(
      (item, index) => `
        <figure class="gallery-item">
          <div class="placeholder-image">Foto ${index + 1}</div>
          <figcaption class="gallery-caption">${item}</figcaption>
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
  renderGallery();
  setupMenu();
  document.getElementById("year").textContent = new Date().getFullYear();
}

init();
