// ===== Product Detail Page Logic =====
let currentProduct = null;
let selectedMetal = '';
let selectedSize = '';

document.addEventListener('DOMContentLoaded', () => {
  const productId = getUrlParam('id');
  if (!productId) {
    window.location.href = 'products.html';
    return;
  }

  currentProduct = getProductById(productId);
  if (!currentProduct) {
    window.location.href = 'products.html';
    return;
  }

  renderProduct();
  renderRelatedProducts();
});

function renderProduct() {
  const product = currentProduct;

  // Set page title
  document.title = `${product.name} - LuxeJewels`;
  document.getElementById('breadcrumb-product').textContent = product.name;

  // Main image
  const mainImage = document.getElementById('main-image');
  mainImage.src = getProductImage(product);
  mainImage.alt = product.name;

  // Thumbnails
  const thumbnailContainer = document.getElementById('thumbnail-container');
  thumbnailContainer.innerHTML = product.images.map((img, index) => `
    <div style="width: 80px; height: 80px; border-radius: var(--radius-sm); overflow: hidden; cursor: pointer; border: 2px solid ${index === 0 ? 'var(--primary)' : 'var(--border)'};"
         onclick="changeImage('${img}', this)">
      <img src="${img}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
    </div>
  `).join('');

  // Product info
  document.getElementById('product-category').textContent = product.category;
  document.getElementById('product-name').textContent = product.name;
  document.getElementById('product-stars').innerHTML = generateStars(product.rating);
  document.getElementById('product-reviews').textContent = `(${product.reviews} reviews)`;
  document.getElementById('product-price').textContent = formatPrice(product.price);
  
  const originalPriceEl = document.getElementById('product-original-price');
  if (product.originalPrice) {
    originalPriceEl.textContent = formatPrice(product.originalPrice);
    originalPriceEl.style.display = 'inline';
  } else {
    originalPriceEl.style.display = 'none';
  }

  document.getElementById('product-description').textContent = product.description;

  // Metal options
  const metalOptions = document.getElementById('metal-options');
  const metals = ['gold', 'silver', 'rosegold'];
  metalOptions.innerHTML = metals.map(metal => `
    <button class="metal-option ${metal === product.metal ? 'selected' : ''}" 
            onclick="selectMetal('${metal}', this)">
      ${metal.charAt(0).toUpperCase() + metal.slice(1)}
    </button>
  `).join('');
  selectedMetal = product.metal;

  // Size options
  const sizeSection = document.getElementById('size-section');
  const sizeOptions = document.getElementById('size-options');
  
  if (product.sizes && product.sizes.length > 0) {
    sizeSection.style.display = 'block';
    sizeOptions.innerHTML = product.sizes.map((size, index) => `
      <button class="size-option ${index === 0 ? 'selected' : ''}" 
              onclick="selectSize('${size}', this)">
        ${size}
      </button>
    `).join('');
    selectedSize = product.sizes[0];
  } else {
    sizeSection.style.display = 'none';
  }

  // Stock status
  const stockStatus = document.getElementById('stock-status');
  if (product.stock > 10) {
    stockStatus.innerHTML = '<span style="color: var(--success);">In Stock</span>';
  } else if (product.stock > 0) {
    stockStatus.innerHTML = `<span style="color: var(--warning);">Only ${product.stock} left!</span>`;
  } else {
    stockStatus.innerHTML = '<span style="color: var(--danger);">Out of Stock</span>';
  }

  // Wishlist button
  updateWishlistButton();
}

function changeImage(src, thumbEl) {
  document.getElementById('main-image').src = src;
  
  // Update thumbnail borders
  document.querySelectorAll('#thumbnail-container > div').forEach(el => {
    el.style.borderColor = 'var(--border)';
  });
  thumbEl.style.borderColor = 'var(--primary)';
}

function selectMetal(metal, btn) {
  selectedMetal = metal;
  document.querySelectorAll('.metal-option').forEach(el => el.classList.remove('selected'));
  btn.classList.add('selected');
}

function selectSize(size, btn) {
  selectedSize = size;
  document.querySelectorAll('.size-option').forEach(el => el.classList.remove('selected'));
  btn.classList.add('selected');
}

function updateQuantity(change) {
  const input = document.getElementById('quantity');
  let value = parseInt(input.value) + change;
  if (value < 1) value = 1;
  if (value > 10) value = 10;
  input.value = value;
}

function addProductToCart() {
  const quantity = parseInt(document.getElementById('quantity').value);
  const options = {};
  
  if (selectedMetal) options.metal = selectedMetal;
  if (selectedSize) options.size = selectedSize;

  addToCart(currentProduct.id, quantity, options);
}

function toggleProductWishlist() {
  const added = toggleWishlist(currentProduct.id);
  updateWishlistButton();
}

function updateWishlistButton() {
  const btn = document.getElementById('wishlist-btn');
  const inWishlist = isInWishlist(currentProduct.id);
  btn.innerHTML = inWishlist ? '&#9829;' : '&#9825;';
  btn.style.background = inWishlist ? 'var(--danger)' : 'transparent';
  btn.style.color = inWishlist ? '#FFF' : 'var(--primary)';
  btn.style.borderColor = inWishlist ? 'var(--danger)' : 'var(--primary)';
}

function renderRelatedProducts() {
  const related = getProductsByCategory(currentProduct.category)
    .filter(p => p.id !== currentProduct.id)
    .slice(0, 4);

  const container = document.getElementById('related-products');
  container.innerHTML = related.map(product => {
    const discount = getDiscountPercent(product.originalPrice, product.price);
    const inWishlist = isInWishlist(product.id);
    
    return `
      <div class="product-card">
        <div class="product-card-image">
          <a href="product.html?id=${product.id}">
            <img src="${getProductImage(product)}" alt="${product.name}">
          </a>
          ${discount > 0 ? `<span class="product-badge sale">-${discount}%</span>` : ''}
          <div class="product-actions">
            <button class="product-action-btn ${inWishlist ? 'wishlist-active' : ''}" 
                    onclick="handleRelatedWishlist(${product.id}, this)">
              ${inWishlist ? '&#9829;' : '&#9825;'}
            </button>
            <button class="product-action-btn" onclick="addToCart(${product.id})">&#43;</button>
          </div>
        </div>
        <div class="product-card-body">
          <p class="product-category">${product.category}</p>
          <h4><a href="product.html?id=${product.id}">${product.name}</a></h4>
          <div class="product-rating">
            <span class="stars">${generateStars(product.rating)}</span>
            <span class="rating-count">(${product.reviews})</span>
          </div>
          <div class="product-price">
            <span class="current-price">${formatPrice(product.price)}</span>
            ${product.originalPrice ? `<span class="original-price">${formatPrice(product.originalPrice)}</span>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function handleRelatedWishlist(productId, btn) {
  const added = toggleWishlist(productId);
  btn.classList.toggle('wishlist-active', added);
  btn.innerHTML = added ? '&#9829;' : '&#9825;';
}
