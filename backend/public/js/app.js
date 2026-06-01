let currentUser = null;
let toastContainer;

document.addEventListener('DOMContentLoaded', async () => {
  currentUser = await getMe();
  initNavbar();
  initFooter();
  updateCartCount();
  initToast();
});

function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === currentPage) link.classList.add('active');
  });
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      mobileBtn.classList.toggle('active');
    });
  }
  updateAuthLinks();
}

function updateAuthLinks() {
  const authLink = document.getElementById('auth-link');
  const accountLink = document.getElementById('account-link');
  if (currentUser) {
    if (authLink) { authLink.textContent = 'Logout'; authLink.href = '#'; authLink.onclick = (e) => { e.preventDefault(); logout(); }; }
    if (accountLink) accountLink.style.display = 'inline';
  } else {
    if (authLink) { authLink.textContent = 'Login'; authLink.href = 'login.html'; authLink.onclick = null; }
    if (accountLink) accountLink.style.display = 'none';
  }
}

function initFooter() {
  const footer = document.getElementById('footer');
  if (!footer) return;
  footer.innerHTML = `<div class="container"><div class="footer-grid"><div class="footer-brand"><h3>Luxe<span>Jewels</span></h3><p>Discover timeless elegance with our curated collection of fine jewelry.</p></div><div class="footer-col"><h4>Quick Links</h4><ul><li><a href="index.html">Home</a></li><li><a href="products.html">Shop</a></li></ul></div><div class="footer-col"><h4>Categories</h4><ul><li><a href="products.html?category=rings">Rings</a></li><li><a href="products.html?category=necklaces">Necklaces</a></li><li><a href="products.html?category=earrings">Earrings</a></li><li><a href="products.html?category=bracelets">Bracelets</a></li></ul></div><div class="footer-col"><h4>Account</h4><ul><li><a href="login.html">Login</a></li><li><a href="account.html">My Account</a></li><li><a href="cart.html">Cart</a></li></ul></div></div><div class="footer-bottom"><p>&copy; 2026 LuxeJewels. All rights reserved.</p></div></div>`;
}

function getCurrentUser() { return currentUser; }

async function logout() {
  try { await apiFetch('/auth/logout'); } catch {}
  currentUser = null;
  window.location.href = 'index.html';
}

// Cart helpers - localStorage for guests, API for logged-in
function getCart() { return JSON.parse(localStorage.getItem('cart') || '[]'); }
function setCart(cart) { localStorage.setItem('cart', JSON.stringify(cart)); }

async function addToCart(productId, quantity = 1, options = {}) {
  if (currentUser) {
    await addToCartAPI(productId, quantity, options);
  } else {
    const cart = getCart();
    const idx = cart.findIndex(i => i.productId === productId && JSON.stringify(i.options) === JSON.stringify(options));
    if (idx >= 0) cart[idx].quantity += quantity;
    else cart.push({ productId, quantity, options });
    setCart(cart);
  }
  updateCartCount();
  showToast('Added to cart!', 'success');
}

async function removeFromCart(productId, options = {}) {
  if (currentUser) {
    const cart = await getCartAPI();
    const item = cart.items.find(i => i.productId._id === productId && JSON.stringify(i.options) === JSON.stringify(options));
    if (item) await removeFromCartAPI(item._id);
  } else {
    let cart = getCart();
    cart = cart.filter(i => !(i.productId === productId && JSON.stringify(i.options) === JSON.stringify(options)));
    setCart(cart);
  }
  updateCartCount();
}

async function updateCartQuantity(productId, quantity, options = {}) {
  if (currentUser) {
    const cart = await getCartAPI();
    const item = cart.items.find(i => i.productId._id === productId && JSON.stringify(i.options) === JSON.stringify(options));
    if (item) await updateCartItemAPI(item._id, quantity);
  } else {
    let cart = getCart();
    const item = cart.find(i => i.productId === productId && JSON.stringify(i.options) === JSON.stringify(options));
    if (item) { if (quantity <= 0) cart = cart.filter(i => i !== item); else item.quantity = quantity; }
    setCart(cart);
  }
  updateCartCount();
}

function getCartItemCount() {
  if (currentUser) return 0; // Will be updated from server
  return getCart().reduce((sum, i) => sum + i.quantity, 0);
}

function updateCartCount() {
  const count = getCartItemCount();
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

function clearCart() { setCart([]); updateCartCount(); }

// Wishlist
function getWishlist() { return JSON.parse(localStorage.getItem('wishlist') || '[]'); }
function isInWishlist(productId) { return getWishlist().includes(productId); }
function toggleWishlistLocal(productId) {
  let w = getWishlist();
  const idx = w.indexOf(productId);
  if (idx >= 0) { w.splice(idx, 1); showToast('Removed from wishlist', 'success'); }
  else { w.push(productId); showToast('Added to wishlist!', 'success'); }
  localStorage.setItem('wishlist', JSON.stringify(w));
  return w.includes(productId);
}

// Helpers
function formatPrice(price) { return '$' + price.toFixed(2); }
function getDiscountPercent(original, current) { return original ? Math.round(((original - current) / original) * 100) : 0; }
function generateStars(rating) {
  let s = '';
  for (let i = 0; i < 5; i++) s += `<span class="star ${i < Math.round(rating) ? 'filled' : ''}">&#9733;</span>`;
  return s;
}
function getProductImage(product) { return product.images?.[0] || 'https://picsum.photos/seed/placeholder/600/600'; }
function getUrlParam(p) { return new URLSearchParams(window.location.search).get(p); }
function formatDate(d) { return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }); }

function initToast() {
  toastContainer = document.getElementById('toast-container');
  if (!toastContainer) { toastContainer = document.createElement('div'); toastContainer.id = 'toast-container'; toastContainer.className = 'toast-container'; document.body.appendChild(toastContainer); }
}
function showToast(message, type = 'success') {
  if (!toastContainer) initToast();
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span class="toast-icon">${type === 'success' ? '&#10003;' : '&#10007;'}</span><span class="toast-message">${message}</span><button class="toast-close" onclick="this.parentElement.remove()">&times;</button>`;
  toastContainer.appendChild(t);
  setTimeout(() => { t.style.animation = 'slideIn 0.3s ease reverse'; setTimeout(() => t.remove(), 300); }, 3000);
}
