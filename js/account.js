document.addEventListener('DOMContentLoaded', async () => {
  if (!currentUser) { window.location.href = 'login.html'; return; }
  const orderId = getUrlParam('order');
  if (orderId) { document.getElementById('order-confirmation').classList.remove('hidden'); document.getElementById('order-id-display').textContent = '#' + orderId; }
  await loadProfile();
  await loadOrders();
  await loadWishlist();
  document.querySelector('.nav-item[data-tab="profile"]').style.background = 'var(--bg-alt)';
  document.querySelector('.nav-item[data-tab="profile"]').style.color = 'var(--primary)';
});

function loadProfile() {
  document.getElementById('user-name-display').textContent = currentUser.name;
  document.getElementById('user-email-display').textContent = currentUser.email;
  document.getElementById('user-avatar').textContent = currentUser.name.charAt(0).toUpperCase();
  document.getElementById('profile-name').value = currentUser.name;
  document.getElementById('profile-email').value = currentUser.email;
  if (currentUser.role === 'admin') document.getElementById('admin-link').style.display = 'flex';
}

async function loadOrders() {
  const container = document.getElementById('orders-list');
  try {
    const orders = await getOrdersAPI();
    if (!orders.length) { container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">&#128230;</div><h3>No orders yet</h3><a href="products.html" class="btn btn-primary">Shop Now</a></div>`; return; }
    container.innerHTML = orders.map(o => `<div style="border:1px solid var(--border);border-radius:var(--radius);padding:20px;margin-bottom:15px"><div style="display:flex;justify-content:space-between;margin-bottom:15px"><div><h4>#${o._id.slice(-6).toUpperCase()}</h4><p style="font-size:0.85rem;color:var(--text-muted)">${formatDate(o.createdAt)}</p></div><span class="badge badge-${o.status === 'pending' ? 'primary' : 'success'}">${o.status}</span></div><p>${o.items.length} item${o.items.length !== 1 ? 's' : ''} - <strong>${formatPrice(o.total)}</strong></p></div>`).join('');
  } catch { container.innerHTML = '<p>Error loading orders</p>'; }
}

async function loadWishlist() {
  const container = document.getElementById('wishlist-grid');
  try {
    const items = await getWishlistAPI();
    if (!items.length) { container.innerHTML = `<div class="empty-state" style="grid-column:span 3"><div class="empty-state-icon">&#9829;</div><h3>Your wishlist is empty</h3><a href="products.html" class="btn btn-primary">Browse Products</a></div>`; return; }
    container.innerHTML = items.map(p => `<div class="product-card"><div class="product-card-image"><a href="product.html?id=${p._id}"><img src="${getProductImage(p)}" alt="${p.name}"></a><button class="wishlist-btn active" onclick="removeWish('${p._id}')">&#9829;</button></div><div class="product-card-body"><p class="product-category">${p.category}</p><h4><a href="product.html?id=${p._id}">${p.name}</a></h4><div class="product-price"><span class="current-price">${formatPrice(p.price)}</span></div><button class="btn btn-primary btn-sm" style="width:100%;margin-top:10px" onclick="addToCart('${p._id}')">Add to Cart</button></div></div>`).join('');
  } catch { container.innerHTML = '<p>Error loading wishlist</p>'; }
}

async function removeWish(pid) { await toggleWishlistAPI(pid); loadWishlist(); }

function switchTab(name, el) {
  document.querySelectorAll('.nav-item').forEach(e => { e.style.background = 'transparent'; e.style.color = 'var(--text)'; });
  el.style.background = 'var(--bg-alt)'; el.style.color = 'var(--primary)';
  document.querySelectorAll('.tab-content').forEach(e => e.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
}
