let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 12;

document.addEventListener('DOMContentLoaded', async () => {
  const category = getUrlParam('category');
  if (category) {
    const cb = document.getElementById('cat-' + category);
    if (cb) cb.checked = true;
    document.getElementById('page-title').textContent = category.charAt(0).toUpperCase() + category.slice(1);
  }
  await applyFilters();
});

async function applyFilters() {
  const params = {};
  const cats = getCheckedValues('cat-');
  const metals = getCheckedValues('metal-');
  const gems = getCheckedValues('gem-');
  const maxPrice = document.getElementById('price-min').value;
  const search = document.getElementById('search-input').value;
  const sort = document.getElementById('sort-select').value;

  document.getElementById('price-max-label').textContent = '$' + maxPrice;
  if (cats.length) params.category = cats.join(',');
  if (metals.length) params.metal = metals.join(',');
  if (gems.length) params.gemstone = gems.join(',');
  if (maxPrice < 3000) params.priceMax = maxPrice;
  if (search) params.search = search;
  params.sort = sort;

  try {
    const data = await getProductsAPI(params);
    filteredProducts = data.products;
  } catch { filteredProducts = []; }
  currentPage = 1;
  renderProducts();
  renderPagination();
  document.getElementById('product-count').textContent = filteredProducts.length + ' products';
}

function getCheckedValues(prefix) {
  return [...document.querySelectorAll(`input[id^="${prefix}"]:checked`)].map(i => i.value);
}

function renderProducts() {
  const grid = document.getElementById('products-grid');
  const empty = document.getElementById('empty-state');
  const start = (currentPage - 1) * productsPerPage;
  const items = filteredProducts.slice(start, start + productsPerPage);

  if (!filteredProducts.length) { grid.classList.add('hidden'); empty.classList.remove('hidden'); return; }
  grid.classList.remove('hidden'); empty.classList.add('hidden');

  grid.innerHTML = items.map(p => {
    const d = getDiscountPercent(p.originalPrice, p.price);
    const iw = isInWishlist(p._id);
    return `<div class="product-card"><div class="product-card-image"><a href="product.html?id=${p._id}"><img src="${getProductImage(p)}" alt="${p.name}"></a>${d > 0 ? `<span class="product-badge sale">-${d}%</span>` : ''}<div class="product-actions"><button class="product-action-btn ${iw ? 'wishlist-active' : ''}" onclick="handleWishlist('${p._id}', this)">${iw ? '&#9829;' : '&#9825;'}</button><button class="product-action-btn" onclick="quickAdd('${p._id}')">&#43;</button></div></div><div class="product-card-body"><p class="product-category">${p.category}</p><h4><a href="product.html?id=${p._id}">${p.name}</a></h4><div class="product-rating"><span class="stars">${generateStars(p.rating)}</span><span class="rating-count">(${p.reviews})</span></div><div class="product-price"><span class="current-price">${formatPrice(p.price)}</span>${p.originalPrice ? `<span class="original-price">${formatPrice(p.originalPrice)}</span>` : ''}</div></div></div>`;
  }).join('');
}

function renderPagination() {
  const pages = Math.ceil(filteredProducts.length / productsPerPage);
  const el = document.getElementById('pagination');
  if (pages <= 1) { el.innerHTML = ''; return; }
  let h = `<button class="page-btn" onclick="goPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>&laquo;</button>`;
  for (let i = 1; i <= pages; i++) h += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goPage(${i})">${i}</button>`;
  h += `<button class="page-btn" onclick="goPage(${currentPage + 1})" ${currentPage === pages ? 'disabled' : ''}>&raquo;</button>`;
  el.innerHTML = h;
}

function goPage(p) { currentPage = p; renderProducts(); renderPagination(); window.scrollTo({ top: 0, behavior: 'smooth' }); }

function clearFilters() {
  document.querySelectorAll('input[type="checkbox"]').forEach(c => c.checked = false);
  document.getElementById('price-min').value = 3000;
  document.getElementById('price-max-label').textContent = '$3000';
  document.getElementById('search-input').value = '';
  document.getElementById('sort-select').value = 'featured';
  document.getElementById('page-title').textContent = 'All Products';
  applyFilters();
}

async function quickAdd(id) { await addToCart(id); }

async function handleWishlist(id, btn) {
  if (currentUser) {
    const res = await toggleWishlistAPI(id);
    btn.classList.toggle('wishlist-active', res.added);
    btn.innerHTML = res.added ? '&#9829;' : '&#9825;';
    showToast(res.message);
  } else {
    const added = toggleWishlistLocal(id);
    btn.classList.toggle('wishlist-active', added);
    btn.innerHTML = added ? '&#9829;' : '&#9825;';
  }
}
