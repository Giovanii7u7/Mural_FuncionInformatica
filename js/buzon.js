async function submitForm() {
  const typeField = document.getElementById("feedback-type");
  const areaField = document.getElementById("feedback-area");
  const messageField = document.getElementById("feedback-message");
  const emailField = document.getElementById("feedback-email");
  const submitButton = document.getElementById("feedback-submit");
  const errorBox = document.getElementById("feedback-error");
  const success = document.getElementById("form-success");
  const formCard = document.getElementById("opinion-form-card");

  if (!typeField || !areaField || !messageField || !emailField || !submitButton || !errorBox) return;

  const type = typeField.value;
  const area = areaField.value;
  const message = messageField.value.trim();
  const contactEmail = emailField.value.trim();

  errorBox.style.display = "none";
  errorBox.textContent = "";

  if (!message) {
    errorBox.textContent = "Escribe tu mensaje antes de enviarlo.";
    errorBox.style.display = "block";
    messageField.focus();
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Enviando...";

  const { error } = await supabaseClient.from("feedback").insert([
    {
      type,
      area,
      message,
      contact_email: contactEmail || null,
    },
  ]);

  submitButton.disabled = false;
  submitButton.textContent = "Enviar mensaje →";

  if (error) {
    console.error("Supabase feedback insert error:", error);
    errorBox.textContent = "No se pudo enviar el mensaje. Intenta de nuevo en unos momentos.";
    errorBox.style.display = "block";
    return;
  }

  typeField.value = "sugerencia";
  areaField.value = "Servicios escolares";
  messageField.value = "";
  emailField.value = "";

  if (success) success.style.display = "block";
  if (formCard) formCard.style.display = "none";
}
