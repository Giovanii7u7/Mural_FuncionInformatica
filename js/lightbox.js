function openImageLightbox(image) {
  const overlay = document.getElementById("image-lightbox");
  const media = document.getElementById("image-lightbox-media");
  const caption = document.getElementById("image-lightbox-caption");

  if (!overlay || !media || !image) return;

  media.src = image.currentSrc || image.src;
  media.alt = image.alt || "Imagen ampliada";
  if (caption) {
    caption.textContent = image.alt || "";
    caption.style.display = image.alt ? "block" : "none";
  }

  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeImageLightbox(event) {
  const overlay = document.getElementById("image-lightbox");
  const media = document.getElementById("image-lightbox-media");
  if (!overlay) return;

  if (!event || event.target === overlay || event.currentTarget?.tagName === "BUTTON") {
    overlay.classList.remove("open");
    if (media) media.removeAttribute("src");
    document.body.style.overflow = "";
  }
}

function initImageLightbox() {
  const main = document.querySelector(".main");
  if (!main || main.dataset.lightboxBound === "true") return;

  main.dataset.lightboxBound = "true";
  main.addEventListener("click", (event) => {
    const image = event.target.closest("img");
    if (!image) return;
    if (!main.contains(image)) return;
    if (image.closest(".bday-modal") || image.closest(".bday-card") || image.closest(".bday-modal-avatar")) return;
    openImageLightbox(image);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeImageLightbox();
    }
  });
}
