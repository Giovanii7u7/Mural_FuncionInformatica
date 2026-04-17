// Birthday wall
const AVATAR_COLORS = ["#1A5C9E", "#1D9E75", "#7F77DD", "#C49A3C", "#D4537E", "#0E2340", "#E8943A", "#3B8BD4"];
const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const BDAY_DATA_VERSION = "2026-04-real-bdays-v1";
const DEFAULT_AVATARS = {
  hombre: "img/avatar-hombre.svg",
  mujer: "img/avatar-mujer.svg",
};

function loadBdays() {
  try {
    const version = localStorage.getItem("unistmo_bdays_version");
    const raw = localStorage.getItem("unistmo_bdays");
    if (version !== BDAY_DATA_VERSION || !raw) {
      const defaults = defaultBdays();
      saveBdays(defaults);
      return defaults;
    }
    return JSON.parse(raw);
  } catch {
    const defaults = defaultBdays();
    saveBdays(defaults);
    return defaults;
  }
}

function saveBdays(arr) {
  try {
    localStorage.setItem("unistmo_bdays", JSON.stringify(arr));
    localStorage.setItem("unistmo_bdays_version", BDAY_DATA_VERSION);
  } catch {}
}

function defaultBdays() {
  const y = new Date().getFullYear();
  return [
    { id: 1, nombre: "Mara Giuliana Reyes Zarate", grupo: "2°", fecha: `${y}-03-02`, color: "#D4537E", genero: "mujer" },
    { id: 2, nombre: "Leila Marel Villalobos Hernandez", grupo: "2do semestre", fecha: `${y}-04-19`, color: "#7F77DD", genero: "mujer" },
    { id: 3, nombre: "Angel Yael Avendano Guzman", grupo: "4", fecha: `${y}-07-20`, color: "#1A5C9E", genero: "hombre", avatar: "cumple_imagenes_alumnos/Avendaño Guzmán Ángel Yael.jpg" },
    { id: 4, nombre: "David Hernandez Vasquez", grupo: "417", fecha: `${y}-07-28`, color: "#1D9E75", genero: "hombre" },
    { id: 5, nombre: "Giovanni Arango Cabrera", grupo: "1008", fecha: `${y}-08-20`, color: "#0E2340", genero: "hombre" },
    { id: 6, nombre: "Hellen Annette Dominguez Jimenez", grupo: "2°", fecha: `${y}-10-02`, color: "#E8943A", genero: "mujer" },
    { id: 7, nombre: "Marcela Platas Revuelta", grupo: "608", fecha: `${y}-11-20`, color: "#C49A3C", genero: "mujer" },
    { id: 8, nombre: "Litzi Maria Martinez Jimenez", grupo: "217", fecha: `${y}-12-25`, color: "#3B8BD4", genero: "mujer" },
  ];
}

let bdayData = loadBdays();
const today = new Date();
let viewMonth = today.getMonth();
let viewYear = today.getFullYear();

function initials(name) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function getAvatarSrc(person) {
  if (person.avatar) return person.avatar;
  return person.genero === "mujer" ? DEFAULT_AVATARS.mujer : DEFAULT_AVATARS.hombre;
}

function getAvatarMarkup(person, altText) {
  const src = getAvatarSrc(person);
  return `<img src="${src}" alt="${escHtml(altText)}" loading="lazy"/>`;
}

function renderBdays() {
  const title = document.getElementById("bday-month-title");
  title.textContent = `${MESES[viewMonth]} ${viewYear}`;

  const grid = document.getElementById("bday-grid");
  grid.innerHTML = "";

  const inMonth = bdayData
    .filter((b) => {
      const d = new Date(b.fecha + "T12:00:00");
      return d.getMonth() === viewMonth && d.getFullYear() === viewYear;
    })
    .sort((a, b) => new Date(a.fecha + "T12:00:00") - new Date(b.fecha + "T12:00:00"));

  const banner = document.getElementById("bday-today-banner");
  const todayBdays = inMonth.filter((b) => {
    const d = new Date(b.fecha + "T12:00:00");
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  });

  if (todayBdays.length && viewMonth === today.getMonth() && viewYear === today.getFullYear()) {
    banner.classList.remove("hidden");
    const names = todayBdays.map((b) => b.nombre.split(" ")[0]).join(", ");
    document.getElementById("bday-today-names").textContent = `¡Hoy cumple${todayBdays.length > 1 ? "n" : ""} años: ${names}! 🎉`;
  } else {
    banner.classList.add("hidden");
  }

  if (inMonth.length === 0) {
    grid.innerHTML = `<div class="bday-empty" style="grid-column:1/-1">
      <div class="empty-icon">🗓</div>
      <p>No hay cumpleaños registrados en ${MESES[viewMonth]}.</p>
    </div>`;
    return;
  }

  inMonth.forEach((b) => {
    const d = new Date(b.fecha + "T12:00:00");
    const isToday = d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    const dayNum = d.getDate();
    const card = document.createElement("div");
    card.className = "bday-card" + (isToday ? " is-today" : "");
    card.innerHTML = `
      <div class="bday-avatar bday-avatar-photo" style="background:${b.color}">${getAvatarMarkup(b, b.nombre)}</div>
      <h5>${b.nombre}</h5>
      <div class="bday-group">${b.grupo}</div>
      <span class="bday-date-pill">${dayNum} de ${MESES[viewMonth]}</span>
    `;
    card.onclick = () => openBdayModal(b, isToday);
    grid.appendChild(card);
  });
}

function changeMonth(dir) {
  viewMonth += dir;
  if (viewMonth > 11) {
    viewMonth = 0;
    viewYear++;
  }
  if (viewMonth < 0) {
    viewMonth = 11;
    viewYear--;
  }
  renderBdays();
}

let currentBdayId = null;

function loadComments(bdayId) {
  try {
    const raw = localStorage.getItem("bday_comments_" + bdayId);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveComments(bdayId, arr) {
  try {
    localStorage.setItem("bday_comments_" + bdayId, JSON.stringify(arr));
  } catch {}
}

function renderComments(bdayId) {
  const list = document.getElementById("modal-comments-list");
  const comments = loadComments(bdayId);
  if (comments.length === 0) {
    list.innerHTML = `<p style="font-size:13px;color:var(--muted);text-align:center;padding:.5rem 0">
      Sé el primero en dejar una felicitación 💌</p>`;
    return;
  }
  list.innerHTML = comments.map((c) => `
    <div style="background:white;border:1px solid var(--border);border-radius:10px;padding:.7rem .9rem">
      <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.3rem">
        <div style="width:26px;height:26px;border-radius:50%;background:var(--navy);color:white;
          font-size:10px;font-weight:700;display:grid;place-items:center;flex-shrink:0">
          ${c.author.trim()[0].toUpperCase()}
        </div>
        <span style="font-size:13px;font-weight:600;color:var(--ink)">${escHtml(c.author)}</span>
        <span style="font-size:11px;color:var(--muted);margin-left:auto">${c.time}</span>
      </div>
      <p style="font-size:13px;color:#444;line-height:1.5;padding-left:34px">${escHtml(c.text)}</p>
    </div>
  `).join("");
  list.scrollTop = list.scrollHeight;
}

function escHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function submitComment() {
  const author = document.getElementById("comment-author").value.trim();
  const text = document.getElementById("comment-text").value.trim();
  if (!author) {
    document.getElementById("comment-author").focus();
    return;
  }
  if (!text) {
    document.getElementById("comment-text").focus();
    return;
  }
  const comments = loadComments(currentBdayId);
  const now = new Date();
  const time = now.toLocaleDateString("es-MX", { day: "2-digit", month: "short" }) + " " +
               now.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
  comments.push({ author, text, time });
  saveComments(currentBdayId, comments);
  document.getElementById("comment-author").value = "";
  document.getElementById("comment-text").value = "";
  renderComments(currentBdayId);
  launchConfetti();
}

function openBdayModal(b, isToday) {
  currentBdayId = b.id;
  const d = new Date(b.fecha + "T12:00:00");
  const firstName = b.nombre.split(" ")[0];

  const modalAvatar = document.getElementById("modal-avatar");
  modalAvatar.style.background = b.color;
  modalAvatar.classList.add("bday-avatar-photo");
  modalAvatar.innerHTML = getAvatarMarkup(b, b.nombre);
  document.getElementById("modal-name").textContent = b.nombre;
  document.getElementById("modal-group").textContent = `${b.grupo}`;
  document.getElementById("modal-date").innerHTML = isToday
    ? `🎂 <strong style="color:#ff6b9d">¡Hoy es el cumpleaños de ${firstName}!</strong>`
    : `📅 Cumpleaños el ${d.getDate()} de ${MESES[d.getMonth()]}`;

  renderComments(b.id);
  document.getElementById("bday-modal").classList.add("open");

  if (isToday) launchConfetti();
}

function closeBdayModal(e) {
  if (!e || e.target === document.getElementById("bday-modal") || e.currentTarget.tagName === "BUTTON") {
    document.getElementById("bday-modal").classList.remove("open");
    stopConfetti();
    currentBdayId = null;
  }
}

let confettiAnim = null;
const cvs = document.getElementById("confetti-canvas");
const ctx2 = cvs.getContext("2d");
let pieces = [];

function launchConfetti() {
  cvs.width = window.innerWidth;
  cvs.height = window.innerHeight;
  pieces = Array.from({ length: 120 }, () => ({
    x: Math.random() * cvs.width,
    y: -Math.random() * cvs.height * 0.5,
    w: 8 + Math.random() * 8,
    h: 5 + Math.random() * 5,
    r: Math.random() * Math.PI * 2,
    vx: (Math.random() - 0.5) * 3,
    vy: 2 + Math.random() * 4,
    vr: (Math.random() - 0.5) * 0.15,
    color: ["#ff6b9d", "#ff9f43", "#ffd32a", "#3B8BD4", "#1D9E75", "#7F77DD", "#C49A3C", "#E8943A"][Math.floor(Math.random() * 8)],
    shape: Math.random() > 0.5 ? "rect" : "circle",
  }));
  if (confettiAnim) cancelAnimationFrame(confettiAnim);
  animConfetti();
  setTimeout(stopConfetti, 4500);
}

function animConfetti() {
  ctx2.clearRect(0, 0, cvs.width, cvs.height);
  let alive = false;
  pieces.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.r += p.vr;
    p.vy += 0.08;
    if (p.y < cvs.height + 20) alive = true;
    ctx2.save();
    ctx2.translate(p.x, p.y);
    ctx2.rotate(p.r);
    ctx2.globalAlpha = Math.max(0, 1 - p.y / cvs.height);
    ctx2.fillStyle = p.color;
    if (p.shape === "circle") {
      ctx2.beginPath();
      ctx2.arc(0, 0, p.w / 2, 0, Math.PI * 2);
      ctx2.fill();
    } else {
      ctx2.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    }
    ctx2.restore();
  });
  if (alive) confettiAnim = requestAnimationFrame(animConfetti);
  else ctx2.clearRect(0, 0, cvs.width, cvs.height);
}

function stopConfetti() {
  if (confettiAnim) {
    cancelAnimationFrame(confettiAnim);
    confettiAnim = null;
  }
  ctx2.clearRect(0, 0, cvs.width, cvs.height);
}

function toggleAdmin() {
  const p = document.getElementById("admin-panel");
  p.classList.toggle("open");
  if (p.classList.contains("open")) renderAdminList();
}

function renderAdminList() {
  const list = document.getElementById("admin-list");
  list.innerHTML = "";
  if (bdayData.length === 0) {
    list.innerHTML = '<p style="color:var(--muted);font-size:13px">Sin registros.</p>';
    return;
  }
  bdayData.forEach((b) => {
    const d = new Date(b.fecha + "T12:00:00");
    const row = document.createElement("div");
    row.className = "admin-list-item";
    row.innerHTML = `
      <div class="bday-avatar" style="background:${b.color};width:28px;height:28px;font-size:11px">${initials(b.nombre)}</div>
      <span>${b.nombre}</span>
      <span class="item-group">${b.grupo}</span>
      <span class="item-group">${d.getDate()} ${MESES[d.getMonth()].slice(0, 3)} ${d.getFullYear()}</span>
      <button class="btn-del" onclick="adminDel(${b.id})">✕</button>
    `;
    list.appendChild(row);
  });
}

function adminAdd() {
  const nombre = document.getElementById("adm-nombre").value.trim();
  const grupo = document.getElementById("adm-grupo").value;
  const fecha = document.getElementById("adm-fecha").value;
  if (!nombre || !grupo || !fecha) {
    alert("Completa todos los campos.");
    return;
  }
  const color = AVATAR_COLORS[bdayData.length % AVATAR_COLORS.length];
  const id = Date.now();
  bdayData.push({ id, nombre, grupo, fecha, color, genero: "hombre" });
  saveBdays(bdayData);
  document.getElementById("adm-nombre").value = "";
  document.getElementById("adm-grupo").value = "";
  document.getElementById("adm-fecha").value = "";
  renderAdminList();
  renderBdays();
}

function adminDel(id) {
  bdayData = bdayData.filter((b) => b.id !== id);
  saveBdays(bdayData);
  renderAdminList();
  renderBdays();
}

document.getElementById("nav-cumple") && (() => {
  const orig = window.showSection;
  window.showSection = function(id, sub) {
    orig(id, sub);
    if (id === "cumple") renderBdays();
  };
})();

window.addEventListener("DOMContentLoaded", () => {
  renderBdays();
});
