const revealTargetSelectors = [
  ".page-section.active .breadcrumb",
  ".page-section.active .page-header",
  ".page-section.active .section-hero",
  ".page-section.active .hero",
  ".page-section.active .home-updates",
  ".page-section.active .home-sections-intro",
  ".page-section.active .section-grid",
  ".page-section.active .section-card",
  ".page-section.active .content-card",
  ".page-section.active .timeline-item",
  ".page-section.active .news-page.is-active > .content-card",
  ".page-section.active .news-gallery img",
  ".page-section.active .evento-item",
  ".page-section.active .doc-card",
  ".page-section.active .teacher-card",
  ".page-section.active .logros-panel-tabs",
  ".page-section.active .podium-card",
  ".page-section.active .logros-secondary-item",
  ".page-section.active .grupo-promedio-card",
  ".page-section.active .logro-card",
  ".page-section.active .red-card",
  ".page-section.active .birthday-submit-toggle",
  ".page-section.active .bday-today-banner:not(.hidden)",
  ".page-section.active .bday-toolbar",
  ".page-section.active .bday-card",
  ".page-section.active .humor-wheel-card",
  ".page-section.active .humor-construction-card",
  ".page-section.active .dato-card",
  ".page-section.active .tutorias-browser",
  ".page-section.active .qr-bar"
];

let revealObserver = null;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function ensureRevealObserver() {
  if (revealObserver || prefersReducedMotion.matches || !("IntersectionObserver" in window)) return;

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -10% 0px",
    }
  );
}

function collectRevealTargets(root = document) {
  const scope = root instanceof Element ? root : document;
  const seen = new Set();
  const targets = [];

  revealTargetSelectors.forEach((selector) => {
    scope.querySelectorAll(selector).forEach((element) => {
      if (seen.has(element)) return;
      seen.add(element);
      targets.push(element);
    });
  });

  return targets;
}

function prepareRevealTargets(root = document) {
  const targets = collectRevealTargets(root);

  targets.forEach((element, index) => {
    if (element.classList.contains("is-visible")) return;

    element.classList.add("reveal-on-scroll");
    element.style.setProperty("--reveal-delay", `${Math.min(index * 90, 720)}ms`);

    if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
      element.classList.add("is-visible");
      return;
    }

    revealObserver.observe(element);
  });

  return targets;
}

function refreshScrollReveal(root = document) {
  ensureRevealObserver();
  prepareRevealTargets(root);
}

function initScrollReveal() {
  refreshScrollReveal(document);
}

window.refreshScrollReveal = refreshScrollReveal;
window.initScrollReveal = initScrollReveal;
