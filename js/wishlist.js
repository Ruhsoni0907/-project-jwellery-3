// ===== Wishlist Page Specific Functions =====
// Additional wishlist functionality (main functions are in app.js)

document.addEventListener('DOMContentLoaded', () => {
  // If on wishlist page, render it
  if (document.getElementById('wishlist-container')) {
    renderWishlistPage();
  }
});

function renderWishlistPage() {
  const container = document.getElementById('wishlist-container');
  const wishlist = getWishlist();

  if (wishlist.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">&#9829;</div>
        <h3>Your wishlist is empty</h3>
        <p>Save items you love for later</p>
        <a href="products.html" class="btn btn-primary">Browse Products</a>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="grid grid-4">
      ${wishlist.map(productId => {
        const product = getProductById(productId);
        if (!product) return '';
        
        return `
          <div class="product-card" id="wishlist-item-${product.id}">
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
              <button class="btn btn-primary btn-sm btn-block" style="width: 100%; margin-top: 10px;" 
                      onclick="moveToCart(${product.id})">
                Move to Cart
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function removeFromWishlistPage(productId) {
  toggleWishlist(productId);
  
  // Animate removal
  const item = document.getElementById('wishlist-item-' + productId);
  if (item) {
    item.style.opacity = '0';
    item.style.transform = 'scale(0.9)';
    item.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      renderWishlistPage();
    }, 300);
  } else {
    renderWishlistPage();
  }
}

function moveToCart(productId) {
  addToCart(productId, 1, {});
  toggleWishlist(productId);
  renderWishlistPage();
  showToast('Item moved to cart!', 'success');
}

function clearWishlist() {
  if (confirm('Are you sure you want to clear your wishlist?')) {
    setToStorage('wishlist', []);
    renderWishlistPage();
    showToast('Wishlist cleared', 'success');
  }
}

function shareWishlist() {
  const wishlist = getWishlist();
  const url = window.location.origin + '/products.html';
  
  if (navigator.share) {
    navigator.share({
      title: 'My LuxeJewels Wishlist',
      text: 'Check out my wishlist on LuxeJewels!',
      url: url
    });
  } else {
    // Fallback - copy to clipboard
    navigator.clipboard.writeText(url).then(() => {
      showToast('Link copied to clipboard!', 'success');
    });
  }
}
