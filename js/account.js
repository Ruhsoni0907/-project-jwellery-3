// ===== Account Page Logic =====
document.addEventListener('DOMContentLoaded', () => {
  const user = getCurrentUser();
  
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  // Check for order confirmation
  const orderId = getUrlParam('order');
  if (orderId) {
    document.getElementById('order-confirmation').classList.remove('hidden');
    document.getElementById('order-id-display').textContent = '#' + orderId;
  }

  // Load user data
  loadUserProfile();
  loadOrders();
  loadWishlist();

  // Check if admin
  if (user.email === 'admin@luxejewels.com') {
    document.getElementById('admin-link').style.display = 'flex';
  }

  // Profile form
  document.getElementById('profile-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('profile-name').value.trim();
    const email = document.getElementById('profile-email').value.trim();
    
    if (name && email) {
      user.name = name;
      user.email = email;
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      // Update in users array
      const users = getUsers();
      const index = users.findIndex(u => u.id === user.id);
      if (index >= 0) {
        users[index] = user;
        setToStorage('users', users);
      }
      
      showToast('Profile updated successfully!', 'success');
      loadUserProfile();
    }
  });

  // Set active nav
  document.querySelector('.nav-item[data-tab="profile"]').style.background = 'var(--bg-alt)';
  document.querySelector('.nav-item[data-tab="profile"]').style.color = 'var(--primary)';
});

function loadUserProfile() {
  const user = getCurrentUser();
  document.getElementById('user-name-display').textContent = user.name;
  document.getElementById('user-email-display').textContent = user.email;
  document.getElementById('user-avatar').textContent = user.name.charAt(0).toUpperCase();
  document.getElementById('profile-name').value = user.name;
  document.getElementById('profile-email').value = user.email;
}

function loadOrders() {
  const user = getCurrentUser();
  const orders = getFromStorage('orders', []).filter(o => o.userId === user.id);
  const container = document.getElementById('orders-list');

  if (orders.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">&#128230;</div>
        <h3>No orders yet</h3>
        <p>Start shopping to see your orders here</p>
        <a href="products.html" class="btn btn-primary">Shop Now</a>
      </div>
    `;
    return;
  }

  container.innerHTML = orders.map(order => `
    <div style="border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; margin-bottom: 15px;">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
        <div>
          <h4 style="font-size: 1rem;">Order #${order.id}</h4>
          <p style="font-size: 0.85rem; color: var(--text-muted);">${formatDate(order.createdAt)}</p>
        </div>
        <span class="badge badge-${order.status === 'pending' ? 'primary' : 'success'}">
          ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>
      <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 15px;">
        ${order.items.map(item => {
          const product = getProductById(item.productId);
          if (!product) return '';
          return `
            <div style="width: 50px; height: 50px; border-radius: var(--radius-sm); overflow: hidden;">
              <img src="${getProductImage(product)}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
          `;
        }).join('')}
      </div>
      <div style="display: flex; justify-content: space-between; padding-top: 15px; border-top: 1px solid var(--border);">
        <span style="color: var(--text-light);">${order.items.length} item${order.items.length !== 1 ? 's' : ''}</span>
        <span style="font-weight: 600;">${formatPrice(order.total)}</span>
      </div>
    </div>
  `).join('');
}

function loadWishlist() {
  const wishlist = getWishlist();
  const container = document.getElementById('wishlist-grid');

  if (wishlist.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: span 3;">
        <div class="empty-state-icon">&#9829;</div>
        <h3>Your wishlist is empty</h3>
        <p>Save items you love for later</p>
        <a href="products.html" class="btn btn-primary">Browse Products</a>
      </div>
    `;
    return;
  }

  container.innerHTML = wishlist.map(productId => {
    const product = getProductById(productId);
    if (!product) return '';
    
    return `
      <div class="product-card">
        <div class="product-card-image">
          <a href="product.html?id=${product.id}">
            <img src="${getProductImage(product)}" alt="${product.name}">
          </a>
          <button class="wishlist-btn active" onclick="removeFromWishlistPage(${product.id})">&#9829;</button>
        </div>
        <div class="product-card-body">
          <p class="product-category">${product.category}</p>
          <h4><a href="product.html?id=${product.id}">${product.name}</a></h4>
          <div class="product-price">
            <span class="current-price">${formatPrice(product.price)}</span>
            ${product.originalPrice ? `<span class="original-price">${formatPrice(product.originalPrice)}</span>` : ''}
          </div>
          <button class="btn btn-primary btn-sm btn-block mt-10" style="width: 100%; margin-top: 10px;" onclick="addToCart(${product.id})">
            Add to Cart
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function removeFromWishlistPage(productId) {
  toggleWishlist(productId);
  loadWishlist();
}

function switchTab(tabName, navEl) {
  // Update nav
  document.querySelectorAll('.nav-item').forEach(el => {
    el.style.background = 'transparent';
    el.style.color = 'var(--text)';
  });
  navEl.style.background = 'var(--bg-alt)';
  navEl.style.color = 'var(--primary)';

  // Update content
  document.querySelectorAll('.tab-content').forEach(el => {
    el.classList.remove('active');
  });
  document.getElementById('tab-' + tabName).classList.add('active');
}
