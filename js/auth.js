document.addEventListener('DOMContentLoaded', () => {
  if (currentUser) window.location.href = 'account.html';
});

function loginWithGoogle() {
  const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://YOUR-backend-url.onrender.com';
  window.location.href = API_URL + '/auth/google';
}
