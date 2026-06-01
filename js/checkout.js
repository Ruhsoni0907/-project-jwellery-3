document.addEventListener('DOMContentLoaded', async () => {
  if (!currentUser) { window.location.href = 'login.html'; return; }
  try {
    const cart = await getCartAPI();
    if (!cart.items?.length) { window.location.href = 'cart.html'; return; }
  } catch { window.location.href = 'cart.html'; return; }
  renderSummary();
  initForm();
});

async function renderSummary() {
  try {
    const cart = await getCartAPI();
    let subtotal = 0;
    document.getElementById('order-items').innerHTML = cart.items.map(i => {
      const p = i.productId;
      const t = p.price * i.quantity;
      subtotal += t;
      return `<div style="display:flex;gap:12px;margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid var(--border)"><div style="width:60px;height:60px;border-radius:var(--radius-sm);overflow:hidden;flex-shrink:0"><img src="${getProductImage(p)}" style="width:100%;height:100%;object-fit:cover"></div><div style="flex:1"><p style="font-size:0.9rem;font-weight:500">${p.name}</p><p style="font-size:0.8rem;color:var(--text-muted)">Qty: ${i.quantity}</p></div><span style="font-weight:500">${formatPrice(t)}</span></div>`;
    }).join('');
    const shipping = subtotal >= 500 ? 0 : 29.99;
    document.getElementById('subtotal').textContent = formatPrice(subtotal);
    document.getElementById('shipping').textContent = shipping === 0 ? 'Free' : formatPrice(shipping);
    document.getElementById('total').textContent = formatPrice(subtotal + shipping);
  } catch {}
}

function initForm() {
  const form = document.getElementById('checkout-form');
  if (currentUser) {
    document.getElementById('email').value = currentUser.email || '';
    const parts = (currentUser.name || '').split(' ');
    document.getElementById('firstName').value = parts[0] || '';
    document.getElementById('lastName').value = parts.slice(1).join(' ') || '';
  }
  document.getElementById('cardNumber').addEventListener('input', e => { let v = e.target.value.replace(/\D/g, ''); e.target.value = v.replace(/(\d{4})/g, '$1 ').trim(); });
  document.getElementById('expiry').addEventListener('input', e => { let v = e.target.value.replace(/\D/g, ''); if (v.length >= 2) v = v.slice(0,2) + '/' + v.slice(2); e.target.value = v; });
  document.getElementById('cvv').addEventListener('input', e => { e.target.value = e.target.value.replace(/\D/g, ''); });
  form.addEventListener('submit', e => { e.preventDefault(); if (form.checkValidity()) placeOrder(); else form.reportValidity(); });
}

async function placeOrder() {
  try {
    const shipping = {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      address: document.getElementById('address').value,
      city: document.getElementById('city').value,
      zip: document.getElementById('zip').value,
      country: document.getElementById('country').value
    };
    const order = await placeOrderAPI(shipping);
    showToast('Order placed!');
    setTimeout(() => { window.location.href = 'account.html?order=' + order._id; }, 1500);
  } catch (e) { showToast(e.message, 'error'); }
}
