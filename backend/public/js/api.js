const API_URL = window.location.protocol === 'file:' ? 'http://localhost:5000' : '';

async function apiFetch(endpoint, options = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'API error');
  return data;
}

async function getMe() {
  try {
    return await apiFetch('/auth/me');
  } catch { return null; }
}

async function getProductsAPI(params = {}) {
  const query = new URLSearchParams(params).toString();
  return await apiFetch(`/api/products?${query}`);
}

async function getFeaturedProductsAPI() {
  return await apiFetch('/api/products/featured');
}

async function getProductByIdAPI(id) {
  return await apiFetch(`/api/products/${id}`);
}

async function getCartAPI() {
  return await apiFetch('/api/cart');
}

async function addToCartAPI(productId, quantity, options) {
  return await apiFetch('/api/cart', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity, options })
  });
}

async function updateCartItemAPI(itemId, quantity) {
  return await apiFetch(`/api/cart/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity })
  });
}

async function removeFromCartAPI(itemId) {
  return await apiFetch(`/api/cart/${itemId}`, { method: 'DELETE' });
}

async function getWishlistAPI() {
  return await apiFetch('/api/wishlist');
}

async function toggleWishlistAPI(productId) {
  return await apiFetch(`/api/wishlist/${productId}`, { method: 'POST' });
}

async function placeOrderAPI(shipping) {
  return await apiFetch('/api/orders', {
    method: 'POST',
    body: JSON.stringify({ shipping })
  });
}

async function getOrdersAPI() {
  return await apiFetch('/api/orders');
}

async function adminGetStats() {
  return await apiFetch('/api/admin/stats');
}

async function adminCreateProduct(data) {
  return await apiFetch('/api/admin/products', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function adminUpdateProduct(id, data) {
  return await apiFetch(`/api/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

async function adminDeleteProduct(id) {
  return await apiFetch(`/api/admin/products/${id}`, { method: 'DELETE' });
}

async function adminGetOrders() {
  return await apiFetch('/api/admin/orders');
}

async function adminUpdateOrder(id, status) {
  return await apiFetch(`/api/admin/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  });
}
