const HUMOR_PRODUCTIVE_OPTIONS = [
  "Estudiar",
  "Hacer tarea",
  "Avanzar con mis proyectos",
  "Repasar apuntes",
];

const HUMOR_DISTRACTOR_OPTIONS = [
  "Procrastinar",
  "Comer",
  "Dormir",
  "Ver reels de Instagram",
  "Ver TikTok",
  "Jugar volley",
  "Jugar Roblox",
  "Spotify",
  "Ir a la cafe",
  "Netflix",
  "Ordenar el clóset",
];

const HUMOR_WHEEL_COLORS = ["#4b6bdb", "#ff857c", "#92f28a", "#f6df9f"];

let humorCurrentOptions = [];
let humorCurrentRotation = 0;
let humorIsSpinning = false;

function shuffleArray(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getRandomOption(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getUniqueDistractors() {
  return shuffleArray(HUMOR_DISTRACTOR_OPTIONS).slice(0, 3);
}

function buildHumorOptions() {
  const productive = getRandomOption(HUMOR_PRODUCTIVE_OPTIONS);
  const distractors = getUniqueDistractors();
  return shuffleArray([
    { text: productive, productive: true },
    ...distractors.map((text) => ({ text, productive: false })),
  ]);
}

function createWheelLabels(options) {
  const segmentAngle = 360 / options.length;
  return options.map((option, index) => {
    const angle = (segmentAngle * index) + (segmentAngle / 2);
    return `
      <div class="humor-wheel-label" style="transform: translate(-50%, -50%) rotate(${angle}deg) translateY(-104px);">
        <span>${option.text}</span>
      </div>
    `;
  }).join("");
}

function renderHumorOptionsList(options) {
  const list = document.getElementById("humor-options-list");
  if (!list) return;

  list.innerHTML = options.map((option) => `
    <li>${option.productive ? "✔" : "•"} ${option.text}</li>
  `).join("");
}

function renderHumorWheel(options) {
  const wheel = document.getElementById("humor-wheel");
  if (!wheel) return;

  const segmentAngle = 360 / options.length;
  const gradientStops = options.map((_, index) => {
    const start = index * segmentAngle;
    const end = start + segmentAngle;
    return `${HUMOR_WHEEL_COLORS[index % HUMOR_WHEEL_COLORS.length]} ${start}deg ${end}deg`;
  }).join(", ");

  wheel.style.background = `conic-gradient(${gradientStops})`;
  wheel.innerHTML = createWheelLabels(options);
  renderHumorOptionsList(options);
}

function setHumorResult(option, initial = false) {
  const resultBox = document.querySelector(".humor-result-box");
  const result = document.getElementById("humor-result");
  if (!result || !resultBox) return;

  resultBox.classList.toggle("is-productive", Boolean(option?.productive) && !initial);
  result.textContent = initial
    ? "Pulsa girar para ver qué te depara el destino."
    : option.productive
      ? `${option.text}. Hoy sí salió la opción responsable.`
      : `${option.text}. Bueno... al menos la ruleta fue sincera.`;
}

function prepareHumorRound(resetRotation = false) {
  humorCurrentOptions = buildHumorOptions();
  renderHumorWheel(humorCurrentOptions);
  setHumorResult(null, true);

  if (resetRotation) {
    humorCurrentRotation = 0;
    const wheel = document.getElementById("humor-wheel");
    if (wheel) {
      wheel.style.transition = "none";
      wheel.style.transform = "rotate(0deg)";
      requestAnimationFrame(() => {
        wheel.style.transition = "transform 4.8s cubic-bezier(.12, .92, .12, 1)";
      });
    }
  }
}

function spinHumorWheel() {
  const wheel = document.getElementById("humor-wheel");
  const button = document.getElementById("humor-spin-button");
  if (!wheel || !button || humorIsSpinning) return;

  humorIsSpinning = true;
  button.disabled = true;
  button.textContent = "Girando...";

  humorCurrentOptions = buildHumorOptions();
  renderHumorWheel(humorCurrentOptions);
  setHumorResult(null, true);

  const winningIndex = Math.floor(Math.random() * humorCurrentOptions.length);
  const segmentAngle = 360 / humorCurrentOptions.length;
  const centerAngle = winningIndex * segmentAngle + segmentAngle / 2;
  const extraTurns = 5 * 360;
  humorCurrentRotation += extraTurns + (360 - centerAngle);

  wheel.style.transform = `rotate(${humorCurrentRotation}deg)`;

  window.setTimeout(() => {
    const winner = humorCurrentOptions[winningIndex];
    setHumorResult(winner, false);
    button.disabled = false;
    button.textContent = "Girar";
    humorIsSpinning = false;
  }, 5000);
}

function initHumorWheel() {
  const wheel = document.getElementById("humor-wheel");
  const button = document.getElementById("humor-spin-button");
  if (!wheel || !button) return;
  if (button.dataset.bound === "true") return;

  button.dataset.bound = "true";
  prepareHumorRound(true);
  button.addEventListener("click", spinHumorWheel);
}
