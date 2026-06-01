document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('wishlist-container')) {
    renderWishlistPage();
  }
});

async function renderWishlistPage() {
  const container = document.getElementById('wishlist-container');
  if (!currentUser) { container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">&#9829;</div><h3>Sign in to see your wishlist</h3><p>Save items you love for later</p><a href="login.html" class="btn btn-primary">Sign In</a></div>'; return; }
  try {
    const items = await getWishlistAPI();
    if (!items.length) { container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">&#9829;</div><h3>Your wishlist is empty</h3><p>Save items you love for later</p><a href="products.html" class="btn btn-primary">Browse Products</a></div>'; return; }
    container.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:30px">
        <div><h2 style="font-size:1.5rem;font-weight:600">Your Wishlist</h2><p style="color:var(--text-light)">${items.length} item${items.length>1?'s':''}</p></div>
        <div style="display:flex;gap:10px"><button class="btn btn-outline btn-sm" onclick="shareWishlist()">Share</button></div>
      </div>
      <div class="grid grid-4">
        ${items.map(p => `
          <div class="product-card" id="wishlist-item-${p._id}">
            <div class="product-card-image">
              <a href="product.html?id=${p._id}"><img src="${getProductImage(p)}" alt="${p.name}"></a>
              <button class="wishlist-btn active" onclick="removeFromWishlistPage('${p._id}')">&#9829;</button>
            </div>
            <div class="product-card-body">
              <p class="product-category">${p.category}</p>
              <h4><a href="product.html?id=${p._id}">${p.name}</a></h4>
              <div class="product-price"><span class="current-price">${formatPrice(p.price)}</span>${p.originalPrice?`<span class="original-price">${formatPrice(p.originalPrice)}</span>`:''}</div>
              <button class="btn btn-primary btn-sm" style="width:100%;margin-top:10px" onclick="moveToCart('${p._id}')">Move to Cart</button>
            </div>
          </div>
        `).join('')}
      </div>`;
  } catch {}
}

async function removeFromWishlistPage(productId) {
  try {
    await toggleWishlistAPI(productId);
    const item = document.getElementById('wishlist-item-' + productId);
    if (item) { item.style.opacity='0'; item.style.transform='scale(0.9)'; item.style.transition='all 0.3s ease'; setTimeout(()=>renderWishlistPage(),300); }
    else renderWishlistPage();
  } catch {}
}

async function moveToCart(productId) {
  try {
    await addToCartAPI(productId, 1, {});
    await toggleWishlistAPI(productId);
    renderWishlistPage();
    showToast('Item moved to cart!', 'success');
  } catch { showToast('Error moving item', 'error'); }
}

function shareWishlist() {
  const url = window.location.origin + '/products.html';
  if (navigator.share) navigator.share({ title: 'My LuxeJewels Wishlist', text: 'Check out my wishlist on LuxeJewels!', url });
  else navigator.clipboard.writeText(url).then(() => showToast('Link copied!', 'success'));
}
