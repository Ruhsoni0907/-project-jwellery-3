// ===== Products Page Logic =====
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 12;

document.addEventListener('DOMContentLoaded', () => {
  // Check URL params for initial filter
  const category = getUrlParam('category');
  if (category) {
    const checkbox = document.getElementById(`cat-${category}`);
    if (checkbox) {
      checkbox.checked = true;
    }
    document.getElementById('page-title').textContent = 
      category.charAt(0).toUpperCase() + category.slice(1);
  }

  applyFilters();
});

function applyFilters() {
  const products = getProducts();
  
  // Get filter values
  const categories = getCheckedValues('cat-');
  const metals = getCheckedValues('metal-');
  const gemstones = getCheckedValues('gem-');
  const maxPrice = parseInt(document.getElementById('price-min').value);
  const searchTerm = document.getElementById('search-input').value.toLowerCase();
  const sortBy = document.getElementById('sort-select').value;

  // Update price label
  document.getElementById('price-max-label').textContent = `$${maxPrice}`;

  // Filter products
  filteredProducts = products.filter(product => {
    // Category filter
    if (categories.length > 0 && !categories.includes(product.category)) return false;
    
    // Metal filter
    if (metals.length > 0 && !metals.includes(product.metal)) return false;
    
    // Gemstone filter
    if (gemstones.length > 0 && !gemstones.includes(product.gemstone)) return false;
    
    // Price filter
    if (maxPrice < 3000 && product.price > maxPrice) return false;
    
    // Search filter
    if (searchTerm) {
      const searchIn = `${product.name} ${product.description} ${product.category}`.toLowerCase();
      if (!searchIn.includes(searchTerm)) return false;
    }

    return true;
  });

  // Sort products
  sortProducts(sortBy);

  // Reset to first page
  currentPage = 1;

  // Render
  renderProducts();
  renderPagination();
  updateProductCount();
}

function getCheckedValues(prefix) {
  const values = [];
  document.querySelectorAll(`input[id^="${prefix}"]`).forEach(input => {
    if (input.checked) values.push(input.value);
  });
  return values;
}

function sortProducts(sortBy) {
  switch (sortBy) {
    case 'price-low':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      filteredProducts.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case 'featured':
    default:
      filteredProducts.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      break;
  }
}

function renderProducts() {
  const grid = document.getElementById('products-grid');
  const emptyState = document.getElementById('empty-state');
  
  // Calculate pagination
  const start = (currentPage - 1) * productsPerPage;
  const end = start + productsPerPage;
  const paginatedProducts = filteredProducts.slice(start, end);

  if (filteredProducts.length === 0) {
    grid.classList.add('hidden');
    emptyState.classList.remove('hidden');
    return;
  }

  grid.classList.remove('hidden');
  emptyState.classList.add('hidden');

  grid.innerHTML = paginatedProducts.map(product => {
    const discount = getDiscountPercent(product.originalPrice, product.price);
    const inWishlist = isInWishlist(product.id);
    
    return `
      <div class="product-card">
        <div class="product-card-image">
          <a href="product.html?id=${product.id}">
            <img src="${getProductImage(product)}" alt="${product.name}">
          </a>
          ${discount > 0 ? `<span class="product-badge sale">-${discount}%</span>` : ''}
          ${product.featured ? '<span class="product-badge" style="left: auto; right: 10px; top: auto; bottom: 10px;">Featured</span>' : ''}
          <div class="product-actions">
            <button class="product-action-btn ${inWishlist ? 'wishlist-active' : ''}" 
                    onclick="handleWishlist(${product.id}, this)" title="Add to Wishlist">
              ${inWishlist ? '&#9829;' : '&#9825;'}
            </button>
            <button class="product-action-btn" onclick="quickAddToCart(${product.id})" title="Add to Cart">
              &#43;
            </button>
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

function renderPagination() {
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const pagination = document.getElementById('pagination');

  if (totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }

  let html = '';
  
  // Previous button
  html += `<button class="page-btn" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>&laquo;</button>`;

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
      html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    } else if (i === currentPage - 3 || i === currentPage + 3) {
      html += `<span style="color: var(--text-muted);">...</span>`;
    }
  }

  // Next button
  html += `<button class="page-btn" onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>&raquo;</button>`;

  pagination.innerHTML = html;
}

function goToPage(page) {
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderProducts();
  renderPagination();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProductCount() {
  document.getElementById('product-count').textContent = 
    `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}`;
}

function clearFilters() {
  // Uncheck all checkboxes
  document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
  
  // Reset price range
  document.getElementById('price-min').value = 3000;
  document.getElementById('price-max-label').textContent = '$3000';
  
  // Reset search
  document.getElementById('search-input').value = '';
  
  // Reset sort
  document.getElementById('sort-select').value = 'featured';
  
  // Reset title
  document.getElementById('page-title').textContent = 'All Products';
  
  // Apply filters
  applyFilters();
}

function quickAddToCart(productId) {
  const product = getProductById(productId);
  if (product.sizes && product.sizes.length > 1) {
    // Redirect to product page if size selection needed
    window.location.href = `product.html?id=${productId}`;
    return;
  }
  addToCart(productId, 1, {});
}

function handleWishlist(productId, btn) {
  const added = toggleWishlist(productId);
  btn.classList.toggle('wishlist-active', added);
  btn.innerHTML = added ? '&#9829;' : '&#9825;';
}
