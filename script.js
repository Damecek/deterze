const members = [
  {
    name: "[Jméno člena 1]",
    role: "Vokál",
    note: "Krátký medailonek člena, zkušenosti, vlivy nebo zajímavost."
  },
  {
    name: "[Jméno člena 2]",
    role: "Kytara",
    note: "Placeholder text – doplňte vlastní informace."
  },
  {
    name: "[Jméno člena 3]",
    role: "Basa",
    note: "Placeholder text – doplňte vlastní informace."
  },
  {
    name: "[Jméno člena 4]",
    role: "Bicí",
    note: "Placeholder text – doplňte vlastní informace."
  }
];

const gallery = [
  "[Koncert 01 • město • rok]",
  "[Backstage • festival • rok]",
  "[Promo foto • fotograf • rok]",
  "[Live set • klub • rok]",
  "[Fanoušci • show • rok]",
  "[Studio session • rok]"
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
