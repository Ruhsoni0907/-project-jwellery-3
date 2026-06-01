// ===== App Initialization =====
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initFooter();
  updateCartCount();
  initToast();
});

// ===== Navbar =====
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Active link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Mobile menu
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      mobileBtn.classList.toggle('active');
    });
  }

  // Update auth links
  updateAuthLinks();
}

function updateAuthLinks() {
  const user = getCurrentUser();
  const authLink = document.getElementById('auth-link');
  const accountLink = document.getElementById('account-link');
  
  if (user) {
    if (authLink) {
      authLink.textContent = 'Logout';
      authLink.href = '#';
      authLink.onclick = (e) => {
        e.preventDefault();
        logout();
      };
    }
    if (accountLink) accountLink.style.display = 'inline';
  } else {
    if (authLink) {
      authLink.textContent = 'Login';
      authLink.href = 'login.html';
      authLink.onclick = null;
    }
    if (accountLink) accountLink.style.display = 'none';
  }
}

// ===== Footer =====
function initFooter() {
  const footer = document.getElementById('footer');
  if (!footer) return;

  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <h3>Luxe<span>Jewels</span></h3>
          <p>Discover timeless elegance with our curated collection of fine jewelry. Each piece is crafted with precision and care to bring you lasting beauty.</p>
          <div class="footer-social">
            <a href="#"><span>&#9733;</span></a>
            <a href="#"><span>&#9734;</span></a>
            <a href="#"><span>&#9829;</span></a>
            <a href="#"><span>&#9830;</span></a>
          </div>
        </div>
        <div class="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="products.html">Shop</a></li>
            <li><a href="products.html?category=rings">Rings</a></li>
            <li><a href="products.html?category=necklaces">Necklaces</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Categories</h4>
          <ul>
            <li><a href="products.html?category=earrings">Earrings</a></li>
            <li><a href="products.html?category=bracelets">Bracelets</a></li>
            <li><a href="products.html?filter=sale">Sale</a></li>
            <li><a href="products.html?filter=new">New Arrivals</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Account</h4>
          <ul>
            <li><a href="login.html">Login</a></li>
            <li><a href="register.html">Register</a></li>
            <li><a href="account.html">My Account</a></li>
            <li><a href="cart.html">Cart</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 LuxeJewels. All rights reserved. Crafted with &#9829;</p>
      </div>
    </div>
  `;
}

// ===== LocalStorage Helpers =====
function getFromStorage(key, defaultValue = null) {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
}

function setToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function removeFromStorage(key) {
  localStorage.removeItem(key);
}

// ===== User/Auth Functions =====
function getCurrentUser() {
  return getFromStorage('currentUser', null);
}

function getUsers() {
  return getFromStorage('users', []);
}

function registerUser(name, email, password) {
  const users = getUsers();
  if (users.find(u => u.email === email)) {
    return { success: false, message: 'Email already registered' };
  }
  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  setToStorage('users', users);
  return { success: true, user: newUser };
}

function loginUser(email, password) {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    setToStorage('currentUser', user);
    return { success: true, user };
  }
  return { success: false, message: 'Invalid email or password' };
}

function logout() {
  removeFromStorage('currentUser');
  window.location.href = 'index.html';
}

// ===== Cart Functions =====
function getCart() {
  return getFromStorage('cart', []);
}

function addToCart(productId, quantity = 1, options = {}) {
  const cart = getCart();
  const existingIndex = cart.findIndex(item => 
    item.productId === productId && 
    JSON.stringify(item.options) === JSON.stringify(options)
  );

  if (existingIndex >= 0) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({ productId, quantity, options });
  }

  setToStorage('cart', cart);
  updateCartCount();
  showToast('Added to cart!', 'success');
}

function removeFromCart(productId, options = {}) {
  let cart = getCart();
  cart = cart.filter(item => 
    !(item.productId === productId && JSON.stringify(item.options) === JSON.stringify(options))
  );
  setToStorage('cart', cart);
  updateCartCount();
}

function updateCartQuantity(productId, quantity, options = {}) {
  const cart = getCart();
  const item = cart.find(item => 
    item.productId === productId && 
    JSON.stringify(item.options) === JSON.stringify(options)
  );
  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId, options);
    } else {
      item.quantity = quantity;
      setToStorage('cart', cart);
    }
  }
  updateCartCount();
}

function getCartTotal() {
  const cart = getCart();
  let total = 0;
  cart.forEach(item => {
    const product = getProductById(item.productId);
    if (product) {
      total += product.price * item.quantity;
    }
  });
  return total;
}

function getCartItemCount() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function updateCartCount() {
  const countElements = document.querySelectorAll('.cart-count');
  const count = getCartItemCount();
  countElements.forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

function clearCart() {
  setToStorage('cart', []);
  updateCartCount();
}

// ===== Wishlist Functions =====
function getWishlist() {
  return getFromStorage('wishlist', []);
}

function toggleWishlist(productId) {
  const wishlist = getWishlist();
  const index = wishlist.indexOf(productId);
  
  if (index >= 0) {
    wishlist.splice(index, 1);
    showToast('Removed from wishlist', 'success');
  } else {
    wishlist.push(productId);
    showToast('Added to wishlist!', 'success');
  }
  
  setToStorage('wishlist', wishlist);
  return wishlist.includes(productId);
}

function isInWishlist(productId) {
  return getWishlist().includes(productId);
}

// ===== Toast Notifications =====
let toastContainer;

function initToast() {
  toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
}

function showToast(message, type = 'success') {
  if (!toastContainer) initToast();
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === 'success' ? '&#10003;' : '&#10007;'}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
  `;
  
  toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ===== URL Helpers =====
function getUrlParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// ===== Format Date =====
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}
