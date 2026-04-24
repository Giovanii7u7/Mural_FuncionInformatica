const TUTORIAS_PAGE_SIZE = 5;

let tutoriasData = [];
let tutoriasFiltered = [];
let tutoriasPage = 1;

function normalizeTutoriasText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function toTitleCase(value) {
  return String(value || "")
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function sanitizeTutoriaRecord(item) {
  return {
    alumno: toTitleCase(item.alumno),
    tutor: toTitleCase(item.tutor),
  };
}

async function loadTutoriasData() {
  const response = await fetch("tutorias.json");
  if (!response.ok) {
    throw new Error("No se pudo cargar tutorias.json");
  }

  const rawData = await response.json();
  tutoriasData = rawData.map(sanitizeTutoriaRecord);
  tutoriasFiltered = [...tutoriasData];
}

function renderTutoriasTable() {
  const body = document.getElementById("tutorias-table-body");
  const empty = document.getElementById("tutorias-empty");
  const summary = document.getElementById("tutorias-summary");
  const indicator = document.getElementById("tutorias-page-indicator");
  const prev = document.getElementById("tutorias-prev");
  const next = document.getElementById("tutorias-next");

  if (!body || !empty || !summary || !indicator || !prev || !next) return;

  const total = tutoriasFiltered.length;
  const totalPages = Math.max(1, Math.ceil(total / TUTORIAS_PAGE_SIZE));
  tutoriasPage = Math.min(tutoriasPage, totalPages);

  const start = (tutoriasPage - 1) * TUTORIAS_PAGE_SIZE;
  const end = start + TUTORIAS_PAGE_SIZE;
  const pageItems = tutoriasFiltered.slice(start, end);

  body.innerHTML = "";

  if (!pageItems.length) {
    empty.hidden = false;
  } else {
    empty.hidden = true;
    body.innerHTML = pageItems.map((item) => `
      <tr>
        <td class="tutorias-alumno">${item.alumno}</td>
        <td class="tutorias-tutor">${item.tutor}</td>
      </tr>
    `).join("");
  }

  const startDisplay = total ? start + 1 : 0;
  const endDisplay = total ? Math.min(end, total) : 0;
  summary.textContent = `Mostrando ${startDisplay}-${endDisplay} de ${total} registros`;
  indicator.textContent = `Página ${tutoriasPage} de ${totalPages}`;
  prev.disabled = tutoriasPage === 1;
  next.disabled = tutoriasPage === totalPages || total === 0;
}

function filterTutorias() {
  const search = document.getElementById("tutorias-search");
  const query = normalizeTutoriasText(search ? search.value : "");

  tutoriasFiltered = tutoriasData.filter((item) => {
    const alumno = normalizeTutoriasText(item.alumno);
    const tutor = normalizeTutoriasText(item.tutor);
    return !query || alumno.includes(query) || tutor.includes(query);
  });

  tutoriasPage = 1;
  renderTutoriasTable();
}

function initTutorias() {
  const search = document.getElementById("tutorias-search");
  const prev = document.getElementById("tutorias-prev");
  const next = document.getElementById("tutorias-next");

  if (!search || !prev || !next) return;
  if (search.dataset.bound === "true") return;

  search.dataset.bound = "true";
  search.addEventListener("input", filterTutorias);
  prev.addEventListener("click", () => {
    if (tutoriasPage > 1) {
      tutoriasPage -= 1;
      renderTutoriasTable();
    }
  });
  next.addEventListener("click", () => {
    const totalPages = Math.max(1, Math.ceil(tutoriasFiltered.length / TUTORIAS_PAGE_SIZE));
    if (tutoriasPage < totalPages) {
      tutoriasPage += 1;
      renderTutoriasTable();
    }
  });

  loadTutoriasData()
    .then(renderTutoriasTable)
    .catch((error) => {
      console.error("Tutorias load error:", error);
      const empty = document.getElementById("tutorias-empty");
      const summary = document.getElementById("tutorias-summary");
      if (empty) {
        empty.hidden = false;
        empty.textContent = "No se pudo cargar la información de tutorías.";
      }
      if (summary) {
        summary.textContent = "Sin datos disponibles";
      }
    });
}
