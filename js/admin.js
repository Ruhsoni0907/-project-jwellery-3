// ===== Admin Panel Logic =====
document.addEventListener('DOMContentLoaded', () => {
  // Check if user is admin (for demo, any logged-in user can access)
  const user = getCurrentUser();
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  loadDashboard();
  loadProductsTable();
  loadOrdersTable();
});

function switchSection(sectionName, navEl) {
  // Update nav
  document.querySelectorAll('.admin-sidebar .nav-item').forEach(el => {
    el.classList.remove('active');
  });
  navEl.classList.add('active');

  // Update content
  document.querySelectorAll('.admin-section').forEach(el => {
    el.classList.remove('active');
  });
  document.getElementById('section-' + sectionName).classList.add('active');
}

// ===== Dashboard =====
function loadDashboard() {
  const products = getProducts();
  const orders = getFromStorage('orders', []);
  const users = getUsers();

  document.getElementById('stat-products').textContent = products.length;
  document.getElementById('stat-orders').textContent = orders.length;
  
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  document.getElementById('stat-revenue').textContent = formatPrice(revenue);
  document.getElementById('stat-users').textContent = users.length;

  // Recent orders
  const recentOrders = orders.slice(-5).reverse();
  const container = document.getElementById('recent-orders');

  if (recentOrders.length === 0) {
    container.innerHTML = '<p style="color: var(--text-muted);">No orders yet</p>';
    return;
  }

  container.innerHTML = recentOrders.map(order => `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--border);">
      <div>
        <span style="font-weight: 500;">#${order.id}</span>
        <span style="color: var(--text-muted); margin-left: 10px;">${formatDate(order.createdAt)}</span>
      </div>
      <div style="display: flex; align-items: center; gap: 15px;">
        <span class="badge badge-${order.status === 'pending' ? 'primary' : 'success'}">
          ${order.status}
        </span>
        <span style="font-weight: 600;">${formatPrice(order.total)}</span>
      </div>
    </div>
  `).join('');
}

// ===== Products =====
function loadProductsTable() {
  const products = getProducts();
  const tbody = document.getElementById('products-table');

  tbody.innerHTML = products.map(product => `
    <tr>
      <td>${product.id}</td>
      <td>
        <div style="width: 50px; height: 50px; border-radius: var(--radius-sm); overflow: hidden;">
          <img src="${getProductImage(product)}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
      </td>
      <td style="font-weight: 500;">${product.name}</td>
      <td><span class="badge badge-primary">${product.category}</span></td>
      <td>${formatPrice(product.price)}</td>
      <td>
        <span style="color: ${product.stock > 10 ? 'var(--success)' : product.stock > 0 ? 'var(--warning)' : 'var(--danger)'};">
          ${product.stock}
        </span>
      </td>
      <td>
        <button class="btn btn-sm btn-outline" onclick="editProduct(${product.id})" style="margin-right: 5px;">Edit</button>
        <button class="btn btn-sm" style="color: var(--danger);" onclick="deleteProduct(${product.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

function showAddProductModal() {
  document.getElementById('modal-title').textContent = 'Add Product';
  document.getElementById('edit-product-id').value = '';
  document.getElementById('product-form').reset();
  document.getElementById('product-modal').classList.add('active');
}

function editProduct(productId) {
  const product = getProductById(productId);
  if (!product) return;

  document.getElementById('modal-title').textContent = 'Edit Product';
  document.getElementById('edit-product-id').value = productId;
  document.getElementById('product-name').value = product.name;
  document.getElementById('product-category').value = product.category;
  document.getElementById('product-metal').value = product.metal;
  document.getElementById('product-price').value = product.price;
  document.getElementById('product-original-price').value = product.originalPrice || '';
  document.getElementById('product-gemstone').value = product.gemstone;
  document.getElementById('product-stock').value = product.stock;
  document.getElementById('product-image').value = product.images[0] || '';
  document.getElementById('product-description').value = product.description;
  document.getElementById('product-featured').checked = product.featured;
  
  document.getElementById('product-modal').classList.add('active');
}

function closeModal() {
  document.getElementById('product-modal').classList.remove('active');
}

function saveProduct() {
  const editId = document.getElementById('edit-product-id').value;
  const name = document.getElementById('product-name').value.trim();
  const category = document.getElementById('product-category').value;
  const metal = document.getElementById('product-metal').value;
  const price = parseFloat(document.getElementById('product-price').value);
  const originalPrice = parseFloat(document.getElementById('product-original-price').value) || null;
  const gemstone = document.getElementById('product-gemstone').value;
  const stock = parseInt(document.getElementById('product-stock').value);
  const image = document.getElementById('product-image').value.trim();
  const description = document.getElementById('product-description').value.trim();
  const featured = document.getElementById('product-featured').checked;

  if (!name || !price || !stock || !description) {
    showToast('Please fill in all required fields', 'error');
    return;
  }

  const products = getProducts();

  if (editId) {
    // Edit existing product
    const index = products.findIndex(p => p.id === parseInt(editId));
    if (index >= 0) {
      products[index] = {
        ...products[index],
        name, category, metal, price, originalPrice, gemstone, stock, description, featured,
        images: image ? [image, image + '?v=2'] : products[index].images
      };
    }
    showToast('Product updated successfully!', 'success');
  } else {
    // Add new product
    const newProduct = {
      id: Date.now(),
      name, category, metal, price, originalPrice, gemstone, stock, description, featured,
      images: image ? [image, image + '?v=2'] : ['https://picsum.photos/seed/new' + Date.now() + '/600/600'],
      sizes: category === 'rings' ? ['5', '6', '7', '8', '9'] : 
             category === 'necklaces' ? ['16 inch', '18 inch', '20 inch'] :
             category === 'earrings' ? ['One Size'] : ['7 inch', '8 inch'],
      rating: 0,
      reviews: 0,
      createdAt: new Date().toISOString()
    };
    products.push(newProduct);
    showToast('Product added successfully!', 'success');
  }

  saveProducts(products);
  loadProductsTable();
  loadDashboard();
  closeModal();
}

function deleteProduct(productId) {
  if (!confirm('Are you sure you want to delete this product?')) return;

  let products = getProducts();
  products = products.filter(p => p.id !== productId);
  saveProducts(products);
  
  loadProductsTable();
  loadDashboard();
  showToast('Product deleted successfully!', 'success');
}

// ===== Orders =====
function loadOrdersTable() {
  const orders = getFromStorage('orders', []);
  const tbody = document.getElementById('orders-table');

  if (orders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 30px; color: var(--text-muted);">No orders yet</td></tr>';
    return;
  }

  tbody.innerHTML = orders.map(order => {
    const user = getUsers().find(u => u.id === order.userId);
    const customerName = order.shipping ? `${order.shipping.firstName} ${order.shipping.lastName}` : (user ? user.name : 'Guest');
    
    return `
      <tr>
        <td>#${order.id}</td>
        <td>
          <div>
            <div style="font-weight: 500;">${customerName}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${order.shipping?.email || ''}</div>
          </div>
        </td>
        <td>${order.items.length}</td>
        <td style="font-weight: 600;">${formatPrice(order.total)}</td>
        <td>
          <select class="form-control" style="width: 120px; padding: 5px 10px; font-size: 0.85rem;" 
                  onchange="updateOrderStatus(${order.id}, this.value)">
            <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
            <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
            <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
          </select>
        </td>
        <td>${formatDate(order.createdAt)}</td>
        <td>
          <button class="btn btn-sm btn-outline" onclick="viewOrder(${order.id})">View</button>
        </td>
      </tr>
    `;
  }).join('');
}

function updateOrderStatus(orderId, status) {
  const orders = getFromStorage('orders', []);
  const index = orders.findIndex(o => o.id === orderId);
  
  if (index >= 0) {
    orders[index].status = status;
    setToStorage('orders', orders);
    showToast('Order status updated!', 'success');
  }
}

function viewOrder(orderId) {
  const orders = getFromStorage('orders', []);
  const order = orders.find(o => o.id === orderId);
  
  if (!order) return;

  let itemsList = order.items.map(item => {
    const product = getProductById(item.productId);
    if (!product) return '';
    return `${product.name} x ${item.quantity} - ${formatPrice(product.price * item.quantity)}`;
  }).join('\n');

  alert(`Order #${order.id}\n\nCustomer: ${order.shipping?.firstName} ${order.shipping?.lastName}\nEmail: ${order.shipping?.email}\nPhone: ${order.shipping?.phone}\n\nAddress:\n${order.shipping?.address}\n${order.shipping?.city}, ${order.shipping?.zip}\n${order.shipping?.country}\n\nItems:\n${itemsList}\n\nSubtotal: ${formatPrice(order.subtotal)}\nShipping: ${order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost)}\nTotal: ${formatPrice(order.total)}\n\nStatus: ${order.status}`);
}
