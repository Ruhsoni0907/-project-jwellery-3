// ===== Checkout Page Logic =====
document.addEventListener('DOMContentLoaded', () => {
  const cart = getCart();
  
  if (cart.length === 0) {
    window.location.href = 'cart.html';
    return;
  }

  renderOrderSummary();
  initCheckoutForm();
});

function renderOrderSummary() {
  const cart = getCart();
  const container = document.getElementById('order-items');
  
  let subtotal = 0;

  container.innerHTML = cart.map(item => {
    const product = getProductById(item.productId);
    if (!product) return '';

    const itemTotal = product.price * item.quantity;
    subtotal += itemTotal;

    return `
      <div style="display: flex; gap: 12px; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid var(--border);">
        <div style="width: 60px; height: 60px; border-radius: var(--radius-sm); overflow: hidden; flex-shrink: 0;">
          <img src="${getProductImage(product)}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div style="flex: 1;">
          <p style="font-size: 0.9rem; font-weight: 500;">${product.name}</p>
          <p style="font-size: 0.8rem; color: var(--text-muted);">Qty: ${item.quantity}</p>
        </div>
        <span style="font-weight: 500;">${formatPrice(itemTotal)}</span>
      </div>
    `;
  }).join('');

  const shipping = subtotal >= 500 ? 0 : 29.99;
  const total = subtotal + shipping;

  document.getElementById('subtotal').textContent = formatPrice(subtotal);
  document.getElementById('shipping').textContent = shipping === 0 ? 'Free' : formatPrice(shipping);
  document.getElementById('total').textContent = formatPrice(total);
}

function initCheckoutForm() {
  const form = document.getElementById('checkout-form');
  
  // Pre-fill if user is logged in
  const user = getCurrentUser();
  if (user) {
    document.getElementById('email').value = user.email || '';
    const nameParts = (user.name || '').split(' ');
    document.getElementById('firstName').value = nameParts[0] || '';
    document.getElementById('lastName').value = nameParts.slice(1).join(' ') || '';
  }

  // Format card number
  document.getElementById('cardNumber').addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    e.target.value = value;
  });

  // Format expiry
  document.getElementById('expiry').addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    e.target.value = value;
  });

  // CVV - numbers only
  document.getElementById('cvv').addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '');
  });

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    placeOrder();
  });
}

function placeOrder() {
  const cart = getCart();
  const user = getCurrentUser();

  // Calculate totals
  let subtotal = 0;
  cart.forEach(item => {
    const product = getProductById(item.productId);
    if (product) subtotal += product.price * item.quantity;
  });
  const shipping = subtotal >= 500 ? 0 : 29.99;
  const total = subtotal + shipping;

  // Create order
  const order = {
    id: Date.now(),
    userId: user ? user.id : null,
    items: cart,
    shipping: {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      address: document.getElementById('address').value,
      city: document.getElementById('city').value,
      zip: document.getElementById('zip').value,
      country: document.getElementById('country').value
    },
    subtotal,
    shippingCost: shipping,
    total,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  // Save order
  const orders = getFromStorage('orders', []);
  orders.push(order);
  setToStorage('orders', orders);

  // Clear cart
  clearCart();

  // Show success message
  showToast('Order placed successfully!', 'success');

  // Redirect to confirmation (using account page for now)
  setTimeout(() => {
    window.location.href = 'account.html?order=' + order.id;
  }, 1500);
}
