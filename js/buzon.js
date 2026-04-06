// ── Formulario buzón ───────────────────────────
function submitForm() {
  const success = document.getElementById('form-success');
  const formCard = document.getElementById('opinion-form-card');
  if (success) success.style.display = 'block';
  if (formCard) formCard.style.display = 'none';
}
