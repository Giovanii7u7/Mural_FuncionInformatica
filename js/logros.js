function initLogrosTabs() {
  const buttons = Array.from(document.querySelectorAll("[data-logros-tab-target]"));
  const panels = Array.from(document.querySelectorAll("[data-logros-tab-panel]"));

  if (!buttons.length || !panels.length) return;
  if (buttons[0].dataset.bound === "true") return;

  buttons.forEach((button) => {
    button.dataset.bound = "true";
    button.addEventListener("click", () => {
      const target = button.getAttribute("data-logros-tab-target");
      buttons.forEach((item) => item.classList.toggle("active", item === button));
      panels.forEach((panel) => {
        panel.classList.toggle("active", panel.getAttribute("data-logros-tab-panel") === target);
      });
      const activePanel = panels.find((panel) => panel.classList.contains("active"));
      if (typeof refreshScrollReveal === "function" && activePanel) {
        refreshScrollReveal(activePanel);
      }
    });
  });

  // Paginación interna para parciales
  initLogrosPagination();
}

function initLogrosPagination() {
  const controls = document.getElementById("logros-pagination-controls");
  if (!controls) return;
  if (controls.dataset.bound === "true") return;
  controls.dataset.bound = "true";

  const buttons = Array.from(controls.querySelectorAll("[data-logros-page-target]"));
  const pages = Array.from(document.querySelectorAll(".logros-page[data-logros-page]"));

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetPage = btn.getAttribute("data-logros-page-target");

      buttons.forEach((b) => b.classList.toggle("is-active", b === btn));
      pages.forEach((p) => {
        const isActive = p.getAttribute("data-logros-page") === targetPage;
        p.style.display = isActive ? "block" : "none";
        if (isActive && typeof refreshScrollReveal === "function") {
          refreshScrollReveal(p);
        }
      });
    });
  });
}
