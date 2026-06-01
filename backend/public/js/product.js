let currentProduct = null;

document.addEventListener('DOMContentLoaded', async () => {
  const id = getUrlParam('id');
  if (!id) { window.location.href = 'products.html'; return; }
  try {
    currentProduct = await getProductByIdAPI(id);
    renderProduct();
    renderRelated();
  } catch { window.location.href = 'products.html'; }
});

function renderProduct() {
  const p = currentProduct;
  document.title = p.name + ' - LuxeJewels';
  document.getElementById('breadcrumb-product').textContent = p.name;
  document.getElementById('main-image').src = getProductImage(p);
  document.getElementById('main-image').alt = p.name;
  document.getElementById('product-category').textContent = p.category;
  document.getElementById('product-name').textContent = p.name;
  document.getElementById('product-stars').innerHTML = generateStars(p.rating);
  document.getElementById('product-reviews').textContent = `(${p.reviews} reviews)`;
  document.getElementById('product-price').textContent = formatPrice(p.price);
  const op = document.getElementById('product-original-price');
  if (p.originalPrice) { op.textContent = formatPrice(p.originalPrice); op.style.display = 'inline'; } else op.style.display = 'none';
  document.getElementById('product-description').textContent = p.description;
  document.getElementById('metal-options').innerHTML = ['gold', 'silver', 'rosegold'].map(m => `<button class="metal-option ${m === p.metal ? 'selected' : ''}" onclick="selectOption('metal', '${m}', this)">${m.charAt(0).toUpperCase() + m.slice(1)}</button>`).join('');
  const sizeSection = document.getElementById('size-section');
  if (p.sizes?.length) { sizeSection.style.display = 'block'; document.getElementById('size-options').innerHTML = p.sizes.map((s, i) => `<button class="size-option ${i === 0 ? 'selected' : ''}" onclick="selectOption('size', '${s}', this)">${s}</button>`).join(''); }
  else sizeSection.style.display = 'none';
  const ss = document.getElementById('stock-status');
  ss.innerHTML = p.stock > 10 ? '<span style="color:var(--success)">In Stock</span>' : p.stock > 0 ? `<span style="color:var(--warning)">Only ${p.stock} left!</span>` : '<span style="color:var(--danger)">Out of Stock</span>';
  document.getElementById('thumbnail-container').innerHTML = p.images?.map((img, i) => `<div style="width:80px;height:80px;border-radius:var(--radius-sm);overflow:hidden;cursor:pointer;border:2px solid ${i === 0 ? 'var(--primary)' : 'var(--border)'}" onclick="changeImage('${img}', this)"><img src="${img}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover"></div>`).join('') || '';
}

function changeImage(src, el) { document.getElementById('main-image').src = src; document.querySelectorAll('#thumbnail-container > div').forEach(e => e.style.borderColor = 'var(--border)'); el.style.borderColor = 'var(--primary)'; }

let selectedMetal = '', selectedSize = '';
function selectOption(type, val, el) {
  if (type === 'metal') selectedMetal = val;
  else selectedSize = val;
  el.parentElement.querySelectorAll('.metal-option, .size-option').forEach(e => e.classList.remove('selected'));
  el.classList.add('selected');
}

function updateQuantity(c) { const inp = document.getElementById('quantity'); inp.value = Math.max(1, Math.min(10, parseInt(inp.value) + c)); }

async function addProductToCart() {
  const qty = parseInt(document.getElementById('quantity').value);
  const opts = {};
  if (selectedMetal) opts.metal = selectedMetal;
  if (selectedSize) opts.size = selectedSize;
  await addToCart(currentProduct._id, qty, opts);
}

async function toggleProductWishlist() {
  if (currentUser) {
    const res = await toggleWishlistAPI(currentProduct._id);
    updateWishlistBtn(res.added);
    showToast(res.message);
  } else {
    updateWishlistBtn(toggleWishlistLocal(currentProduct._id));
  }
}

function updateWishlistBtn(inW) {
  const btn = document.getElementById('wishlist-btn');
  btn.innerHTML = inW ? '&#9829;' : '&#9825;';
  btn.style.background = inW ? 'var(--danger)' : 'transparent';
  btn.style.color = inW ? '#FFF' : 'var(--primary)';
}

async function renderRelated() {
  try {
    const data = await getProductsAPI({ category: currentProduct.category, limit: 4 });
    const related = data.products.filter(p => p._id !== currentProduct._id).slice(0, 4);
    document.getElementById('related-products').innerHTML = related.map(p => `<div class="product-card"><div class="product-card-image"><a href="product.html?id=${p._id}"><img src="${getProductImage(p)}" alt="${p.name}"></a></div><div class="product-card-body"><p class="product-category">${p.category}</p><h4><a href="product.html?id=${p._id}">${p.name}</a></h4><div class="product-price"><span class="current-price">${formatPrice(p.price)}</span></div></div></div>`).join('');
  } catch {}
}
