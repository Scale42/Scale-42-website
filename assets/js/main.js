document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const form = document.getElementById('contact-form');
  if (!form) {
    return;
  }

  const emailField = form.querySelector('input[name="email"]');
  const errorEl = form.querySelector('.contact__error');
  const successEl = document.querySelector('.contact__success');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!emailField) {
      return;
    }

    const email = emailField.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailPattern.test(email)) {
      if (errorEl) {
        errorEl.textContent = 'Please enter a valid email address.';
      }
      if (successEl) {
        successEl.hidden = true;
      }
      emailField.focus();
      return;
    }

    if (errorEl) {
      errorEl.textContent = '';
    }

    if (successEl) {
      successEl.hidden = false;
    }

    emailField.value = '';
  });
});
