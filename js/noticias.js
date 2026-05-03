let currentNewsPage = 1;

function showNewsPage(pageNumber) {
  const pageButtons = document.querySelectorAll(".news-page-button");
  const pages = document.querySelectorAll(".news-page");

  if (!pageButtons.length || !pages.length) return;

  const availablePages = Array.from(pages)
    .map((page) => Number(page.dataset.newsPage))
    .filter((page) => !Number.isNaN(page));

  const safePage = availablePages.includes(pageNumber)
    ? pageNumber
    : Math.min(...availablePages);

  currentNewsPage = safePage;

  pages.forEach((page) => {
    const isActive = Number(page.dataset.newsPage) === safePage;
    page.classList.toggle("is-active", isActive);
  });

  pageButtons.forEach((button) => {
    const isActive = Number(button.dataset.newsTarget) === safePage;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-current", isActive ? "page" : "false");
  });

  const shell = document.querySelector(".news-pagination-shell");
  if (shell) shell.scrollIntoView({ behavior: "smooth", block: "start" });
}

function initNoticiasPagination() {
  const pageButtons = document.querySelectorAll(".news-page-button");
  if (!pageButtons.length) return;

  pageButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = Number(button.dataset.newsTarget);
      if (!Number.isNaN(target)) showNewsPage(target);
    });
  });

  showNewsPage(currentNewsPage);
}
