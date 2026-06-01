// ===== Auth Page Logic =====
document.addEventListener('DOMContentLoaded', () => {
  // Check which form is present
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  if (loginForm) {
    initLoginForm();
  }

  if (registerForm) {
    initRegisterForm();
  }

  // Redirect if already logged in
  if (getCurrentUser()) {
    const isLoginPage = window.location.pathname.includes('login');
    const isRegisterPage = window.location.pathname.includes('register');
    if (isLoginPage || isRegisterPage) {
      window.location.href = 'account.html';
    }
  }
});

function initLoginForm() {
  const form = document.getElementById('login-form');
  const errorEl = document.getElementById('login-error');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Validate
    if (!email || !password) {
      showError(errorEl, 'Please fill in all fields');
      return;
    }

    // Attempt login
    const result = loginUser(email, password);
    
    if (result.success) {
      showToast('Login successful!', 'success');
      setTimeout(() => {
        window.location.href = 'account.html';
      }, 1000);
    } else {
      showError(errorEl, result.message);
    }
  });
}

function initRegisterForm() {
  const form = document.getElementById('register-form');
  const errorEl = document.getElementById('register-error');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const terms = document.getElementById('terms').checked;

    // Validate
    if (!name || !email || !password || !confirmPassword) {
      showError(errorEl, 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      showError(errorEl, 'Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      showError(errorEl, 'Passwords do not match');
      return;
    }

    if (!terms) {
      showError(errorEl, 'Please agree to the Terms of Service');
      return;
    }

    // Attempt registration
    const result = registerUser(name, email, password);
    
    if (result.success) {
      // Auto login after registration
      loginUser(email, password);
      showToast('Account created successfully!', 'success');
      setTimeout(() => {
        window.location.href = 'account.html';
      }, 1000);
    } else {
      showError(errorEl, result.message);
    }
  });
}

function showError(element, message) {
  element.textContent = message;
  element.classList.remove('hidden');
  setTimeout(() => {
    element.classList.add('hidden');
  }, 5000);
}
