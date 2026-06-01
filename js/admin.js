document.addEventListener('DOMContentLoaded', async () => {
  if (!currentUser || currentUser.role !== 'admin') { window.location.href = 'login.html'; return; }
  await loadDashboard();
  await loadProductsTable();
  await loadOrdersTable();
});

function switchSection(name, el) {
  document.querySelectorAll('.admin-sidebar .nav-item').forEach(e => e.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.admin-section').forEach(e => e.classList.remove('active'));
  document.getElementById('section-' + name).classList.add('active');
}

async function loadDashboard() {
  try {
    const s = await adminGetStats();
    document.getElementById('stat-products').textContent = s.totalProducts;
    document.getElementById('stat-orders').textContent = s.totalOrders;
    document.getElementById('stat-revenue').textContent = formatPrice(s.totalRevenue);
    document.getElementById('stat-users').textContent = s.totalUsers;
    document.getElementById('recent-orders').innerHTML = s.recentOrders.length ? s.recentOrders.map(o => `<div style="display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--border)"><span>#${o._id.slice(-6)} - ${formatDate(o.createdAt)}</span><span class="badge badge-${o.status === 'pending' ? 'primary' : 'success'}">${o.status}</span><strong>${formatPrice(o.total)}</strong></div>`).join('') : '<p style="color:var(--text-muted)">No orders yet</p>';
  } catch {}
}

async function loadProductsTable() {
  try {
    const data = await getProductsAPI({});
    document.getElementById('products-table').innerHTML = data.products.map(p => `<tr><td style="width:50px"><img src="${getProductImage(p)}" style="width:50px;height:50px;border-radius:var(--radius-sm);object-fit:cover"></td><td style="font-weight:500">${p.name}</td><td><span class="badge badge-primary">${p.category}</span></td><td>${formatPrice(p.price)}</td><td style="color:${p.stock > 10 ? 'var(--success)' : p.stock > 0 ? 'var(--warning)' : 'var(--danger)'}">${p.stock}</td><td><button class="btn btn-sm btn-outline" onclick="editProd('${p._id}')">Edit</button> <button class="btn btn-sm" style="color:var(--danger)" onclick="deleteProd('${p._id}')">Delete</button></td></tr>`).join('');
  } catch {}
}

function showAddProductModal() { document.getElementById('modal-title').textContent = 'Add Product'; document.getElementById('edit-product-id').value = ''; document.getElementById('product-form').reset(); document.getElementById('product-modal').classList.add('active'); }
function closeModal() { document.getElementById('product-modal').classList.remove('active'); }

async function editProd(id) {
  try {
    const p = await getProductByIdAPI(id);
    document.getElementById('modal-title').textContent = 'Edit Product';
    document.getElementById('edit-product-id').value = id;
    document.getElementById('product-name').value = p.name;
    document.getElementById('product-category').value = p.category;
    document.getElementById('product-metal').value = p.metal;
    document.getElementById('product-price').value = p.price;
    document.getElementById('product-original-price').value = p.originalPrice || '';
    document.getElementById('product-gemstone').value = p.gemstone;
    document.getElementById('product-stock').value = p.stock;
    document.getElementById('product-image').value = p.images?.[0] || '';
    document.getElementById('product-description').value = p.description;
    document.getElementById('product-featured').checked = p.featured;
    document.getElementById('product-modal').classList.add('active');
  } catch {}
}

async function saveProduct() {
  const id = document.getElementById('edit-product-id').value;
  const data = {
    name: document.getElementById('product-name').value.trim(),
    category: document.getElementById('product-category').value,
    metal: document.getElementById('product-metal').value,
    price: parseFloat(document.getElementById('product-price').value),
    originalPrice: parseFloat(document.getElementById('product-original-price').value) || null,
    gemstone: document.getElementById('product-gemstone').value,
    stock: parseInt(document.getElementById('product-stock').value),
    images: [document.getElementById('product-image').value.trim() || 'https://picsum.photos/seed/new/600/600'],
    description: document.getElementById('product-description').value.trim(),
    featured: document.getElementById('product-featured').checked,
    sizes: document.getElementById('product-category').value === 'rings' ? ['5','6','7','8','9'] : ['One Size'],
    rating: 0, reviews: 0
  };
  try {
    if (id) await adminUpdateProduct(id, data);
    else await adminCreateProduct(data);
    showToast(id ? 'Product updated!' : 'Product added!');
    closeModal();
    loadProductsTable();
    loadDashboard();
  } catch (e) { showToast(e.message, 'error'); }
}

async function deleteProd(id) {
  if (!confirm('Delete this product?')) return;
  try { await adminDeleteProduct(id); showToast('Deleted!'); loadProductsTable(); loadDashboard(); } catch {}
}

async function loadOrdersTable() {
  try {
    const orders = await adminGetOrders();
    document.getElementById('orders-table').innerHTML = orders.length ? orders.map(o => `<tr><td>#${o._id.slice(-6)}</td><td>${o.shipping.firstName} ${o.shipping.lastName}</td><td>${o.items.length}</td><td>${formatPrice(o.total)}</td><td><select class="form-control" style="width:120px;padding:5px" onchange="updateStatus('${o._id}', this.value)"><option ${o.status==='pending'?'selected':''}>pending</option><option ${o.status==='processing'?'selected':''}>processing</option><option ${o.status==='shipped'?'selected':''}>shipped</option><option ${o.status==='delivered'?'selected':''}>delivered</option></select></td><td>${formatDate(o.createdAt)}</td></tr>`).join('') : '<tr><td colspan="6" style="text-align:center;padding:30px;color:var(--text-muted)">No orders</td></tr>';
  } catch {}
}

async function updateStatus(id, status) { try { await adminUpdateOrder(id, status); showToast('Updated!'); } catch {} }
