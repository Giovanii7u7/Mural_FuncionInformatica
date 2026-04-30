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
    });
  });
}
