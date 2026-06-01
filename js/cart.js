// ===== Cart Page Logic =====
document.addEventListener('DOMContentLoaded', () => {
  renderCart();
});

function renderCart() {
  const cart = getCart();
  const container = document.getElementById('cart-content');

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">&#128722;</div>
        <h3>Your cart is empty</h3>
        <p>Looks like you haven't added any items to your cart yet.</p>
        <a href="products.html" class="btn btn-primary">Start Shopping</a>
      </div>
    `;
    return;
  }

  let subtotal = 0;
  let totalItems = 0;

  const cartItemsHTML = cart.map(item => {
    const product = getProductById(item.productId);
    if (!product) return '';

    const itemTotal = product.price * item.quantity;
    subtotal += itemTotal;
    totalItems += item.quantity;

    const optionsText = Object.entries(item.options)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');

    return `
      <div class="cart-item" style="display: flex; gap: 20px; padding: 20px; background: var(--bg); border-radius: var(--radius); margin-bottom: 15px; align-items: center;" data-product-id="${item.productId}">
        <div style="width: 120px; height: 120px; border-radius: var(--radius-sm); overflow: hidden; flex-shrink: 0;">
          <img src="${getProductImage(product)}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div style="flex: 1;">
          <h4 style="font-size: 1.1rem; margin-bottom: 5px;">
            <a href="product.html?id=${product.id}" style="color: var(--secondary);">${product.name}</a>
          </h4>
          ${optionsText ? `<p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 5px;">${optionsText}</p>` : ''}
          <p style="font-size: 0.9rem; color: var(--text-light);">Unit Price: ${formatPrice(product.price)}</p>
        </div>
        <div class="quantity-selector">
          <button class="qty-btn" onclick="updateCartItemQuantity(${product.id}, ${item.quantity - 1}, '${JSON.stringify(item.options).replace(/'/g, "\\'")}')">-</button>
          <input type="number" class="qty-input" value="${item.quantity}" min="1" max="10" 
                 onchange="updateCartItemQuantity(${product.id}, this.value, '${JSON.stringify(item.options).replace(/'/g, "\\'")}')">
          <button class="qty-btn" onclick="updateCartItemQuantity(${product.id}, ${item.quantity + 1}, '${JSON.stringify(item.options).replace(/'/g, "\\'")}')">+</button>
        </div>
        <div style="text-align: right; min-width: 100px;">
          <p style="font-size: 1.15rem; font-weight: 700; color: var(--secondary);">${formatPrice(itemTotal)}</p>
          <button style="color: var(--danger); font-size: 0.85rem; margin-top: 5px;" 
                  onclick="removeCartItem(${product.id}, '${JSON.stringify(item.options).replace(/'/g, "\\'")}')">
            Remove
          </button>
        </div>
      </div>
    `;
  }).join('');

  const shipping = subtotal >= 500 ? 0 : 29.99;
  const total = subtotal + shipping;

  container.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 380px; gap: 30px;">
      <!-- Cart Items -->
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <p style="color: var(--text-light);">${totalItems} item${totalItems !== 1 ? 's' : ''} in your cart</p>
          <button onclick="clearCartItems()" class="btn btn-sm btn-outline" style="color: var(--danger); border-color: var(--danger);">Clear Cart</button>
        </div>
        ${cartItemsHTML}
      </div>

      <!-- Order Summary -->
      <div style="background: var(--bg-alt); padding: 25px; border-radius: var(--radius-lg); height: fit-content; position: sticky; top: 90px;">
        <h3 style="font-size: 1.2rem; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid var(--border);">Order Summary</h3>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
          <span style="color: var(--text-light);">Subtotal</span>
          <span>${formatPrice(subtotal)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
          <span style="color: var(--text-light);">Shipping</span>
          <span>${shipping === 0 ? '<span style="color: var(--success);">Free</span>' : formatPrice(shipping)}</span>
        </div>
        ${shipping > 0 ? `
          <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 15px;">
            Add ${formatPrice(500 - subtotal)} more for free shipping!
          </p>
        ` : ''}
        
        <div style="border-top: 1px solid var(--border); padding-top: 15px; margin-top: 15px; display: flex; justify-content: space-between;">
          <span style="font-weight: 600; font-size: 1.1rem;">Total</span>
          <span style="font-weight: 700; font-size: 1.3rem; color: var(--secondary);">${formatPrice(total)}</span>
        </div>

        <a href="checkout.html" class="btn btn-primary btn-block mt-20" style="margin-top: 20px;">
          Proceed to Checkout
        </a>
        <a href="products.html" class="btn btn-outline btn-block" style="margin-top: 10px;">
          Continue Shopping
        </a>

        <!-- Promo Code -->
        <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid var(--border);">
          <label style="font-size: 0.9rem; font-weight: 500; display: block; margin-bottom: 8px;">Promo Code</label>
          <div style="display: flex; gap: 8px;">
            <input type="text" placeholder="Enter code" class="form-control" style="flex: 1;">
            <button class="btn btn-sm btn-outline">Apply</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function updateCartItemQuantity(productId, newQuantity, optionsStr) {
  const options = JSON.parse(optionsStr);
  const quantity = parseInt(newQuantity);
  
  if (quantity <= 0) {
    removeFromCart(productId, options);
  } else {
    updateCartQuantity(productId, Math.min(quantity, 10), options);
  }
  renderCart();
}

function removeCartItem(productId, optionsStr) {
  const options = JSON.parse(optionsStr);
  removeFromCart(productId, options);
  renderCart();
}

function clearCartItems() {
  if (confirm('Are you sure you want to clear your cart?')) {
    clearCart();
    renderCart();
  }
}
