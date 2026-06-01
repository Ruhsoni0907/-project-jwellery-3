document.addEventListener('DOMContentLoaded', () => { renderCart(); });

async function renderCart() {
  const container = document.getElementById('cart-content');
  let items = [], serverCart = null;

  if (currentUser) {
    try { serverCart = await getCartAPI(); items = serverCart.items || []; } catch { items = []; }
  } else {
    items = getCart();
  }

  if (!items.length) { container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">&#128722;</div><h3>Your cart is empty</h3><p>Looks like you haven't added any items yet.</p><a href="products.html" class="btn btn-primary">Start Shopping</a></div>`; return; }

  let subtotal = 0, totalItems = 0;
  let html = '';

  for (const item of items) {
    let product, quantity, itemOptions;
    if (currentUser && serverCart) {
      product = item.productId;
      quantity = item.quantity;
      itemOptions = item.options || {};
    } else {
      try { product = await getProductByIdAPI(item.productId); } catch { continue; }
      quantity = item.quantity;
      itemOptions = item.options || {};
    }
    const itemTotal = product.price * quantity;
    subtotal += itemTotal;
    totalItems += quantity;
    const opts = Object.entries(itemOptions).map(([k, v]) => `${k}: ${v}`).join(', ');
    const itemId = currentUser ? item._id : product._id;
    html += `<div class="cart-item" style="display:flex;gap:20px;padding:20px;background:var(--bg);border-radius:var(--radius);margin-bottom:15px;align-items:center"><div style="width:120px;height:120px;border-radius:var(--radius-sm);overflow:hidden;flex-shrink:0"><img src="${getProductImage(product)}" alt="${product.name}" style="width:100%;height:100%;object-fit:cover"></div><div style="flex:1"><h4><a href="product.html?id=${product._id}">${product.name}</a></h4>${opts ? `<p style="font-size:0.85rem;color:var(--text-muted)">${opts}</p>` : ''}<p style="font-size:0.9rem;color:var(--text-light)">${formatPrice(product.price)}</p></div><div class="quantity-selector"><button class="qty-btn" onclick="updateQty('${item._id}', ${quantity - 1})">-</button><input type="number" class="qty-input" value="${quantity}" min="1" max="10" onchange="updateQty('${item._id}', this.value)"><button class="qty-btn" onclick="updateQty('${item._id}', ${quantity + 1})">+</button></div><div style="text-align:right;min-width:100px"><p style="font-size:1.15rem;font-weight:700;color:var(--secondary)">${formatPrice(itemTotal)}</p><button style="color:var(--danger);font-size:0.85rem;margin-top:5px" onclick="removeItem('${item._id}')">Remove</button></div></div>`;
  }

  const shipping = subtotal >= 500 ? 0 : 29.99;
  const total = subtotal + shipping;

  container.innerHTML = `<div style="display:grid;grid-template-columns:1fr 380px;gap:30px"><div><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px"><p style="color:var(--text-light)">${totalItems} item${totalItems !== 1 ? 's' : ''} in cart</p><button onclick="clearAll()" class="btn btn-sm btn-outline" style="color:var(--danger);border-color:var(--danger)">Clear Cart</button></div>${html}</div><div style="background:var(--bg-alt);padding:25px;border-radius:var(--radius-lg);height:fit-content;position:sticky;top:90px"><h3 style="font-size:1.2rem;margin-bottom:20px;padding-bottom:15px;border-bottom:1px solid var(--border)">Order Summary</h3><div style="display:flex;justify-content:space-between;margin-bottom:12px"><span style="color:var(--text-light)">Subtotal</span><span>${formatPrice(subtotal)}</span></div><div style="display:flex;justify-content:space-between;margin-bottom:12px"><span style="color:var(--text-light)">Shipping</span><span>${shipping === 0 ? '<span style="color:var(--success)">Free</span>' : formatPrice(shipping)}</span></div>${shipping > 0 ? `<p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:15px">Add ${formatPrice(500 - subtotal)} more for free shipping!</p>` : ''}<div style="border-top:1px solid var(--border);padding-top:15px;margin-top:15px;display:flex;justify-content:space-between"><span style="font-weight:600;font-size:1.1rem">Total</span><span style="font-weight:700;font-size:1.3rem;color:var(--secondary)">${formatPrice(total)}</span></div><a href="checkout.html" class="btn btn-primary btn-block" style="margin-top:20px;width:100%">Proceed to Checkout</a><a href="products.html" class="btn btn-outline btn-block" style="margin-top:10px;width:100%">Continue Shopping</a></div></div>`;
}

async function updateQty(id, qty) {
  if (currentUser) await updateCartItemAPI(id, Math.max(1, Math.min(10, parseInt(qty))));
  else {
    let cart = getCart();
    const item = cart.find(i => i.productId === id);
    if (item) { if (parseInt(qty) <= 0) cart = cart.filter(i => i !== item); else item.quantity = Math.min(10, parseInt(qty)); }
    setCart(cart);
  }
  renderCart();
}

async function removeItem(id) {
  if (currentUser) await removeFromCartAPI(id);
  else { let cart = getCart().filter(i => i.productId !== id); setCart(cart); }
  renderCart();
}

function clearAll() { if (confirm('Clear your cart?')) { if (currentUser) getCartAPI().then(c => c.items?.forEach(i => removeFromCartAPI(i._id))); else clearCart(); renderCart(); } }
