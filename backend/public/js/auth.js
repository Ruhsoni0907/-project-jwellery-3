document.addEventListener('DOMContentLoaded', () => {
  if (currentUser) window.location.href = 'account.html';
});

function loginWithGoogle() {
  const API_URL = window.location.protocol === 'file:' ? 'http://localhost:5000' : '';
  window.location.href = API_URL + '/auth/google';
}
