// ── Routing por hash (para QRs directos) ──────
const sections = ['noticias','cultura','deportes','opinion','academica','logros','humor','redes','cumple'];

function showHome() {
  hideAll();
  document.getElementById('page-home').classList.add('active');
  setNavActive('nav-home');
  closeSidebar();
  history.pushState(null, '', window.location.pathname);
  updateQRUrls();
}

function showSection(id, sub = null) {
  hideAll();
  document.getElementById('page-' + id).classList.add('active');
  setNavActive('nav-' + id);
  closeSidebar();
  const hash = sub ? id + '/' + sub : id;
  history.pushState(null, '', '#' + hash);
  updateQRUrls();
  if (sub) {
    setTimeout(() => {
      const el = document.getElementById('sub-' + sub);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function hideAll() {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item, .nav-sub-item').forEach(i => i.classList.remove('active'));
}

function setNavActive(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}

function updateQRUrls() {
  const base = window.location.href.split('#')[0];
  sections.forEach(s => {
    const el = document.getElementById('url-' + s);
    if (el) el.textContent = base + '#' + s;
  });
}

// ── Hash routing al cargar ─────────────────────
function routeFromHash() {
  const hash = window.location.hash.replace('#', '');
  if (!hash) { showHome(); return; }
  const [sectionId, subId] = hash.split('/');
  if (sections.includes(sectionId)) {
    showSection(sectionId, subId || null);
  } else {
    showHome();
  }
}

window.addEventListener('hashchange', routeFromHash);
window.addEventListener('DOMContentLoaded', () => {
  routeFromHash();
  updateQRUrls();
});
