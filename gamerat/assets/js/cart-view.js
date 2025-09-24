// cart-view.js - Renderiza la vista de carrito con productos, total y pago

document.addEventListener('DOMContentLoaded', function() {
  // Asegura que los productos estén cargados antes de renderizar el carrito
  if (window.ensureProductsSeed) {
    const seedResult = window.ensureProductsSeed();
    if (seedResult && typeof seedResult.then === 'function') {
      seedResult.then(renderCart);
    } else {
      renderCart();
    }
  } else {
    renderCart();
  }
  const cartList = document.getElementById('cartList');
  const cartTotal = document.getElementById('cartTotal');
  const emptyCartMsg = document.getElementById('emptyCartMsg');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const realizarCompraBtn = document.getElementById('realizarCompraBtn');

  function renderCart() {
    if (!window.getCart || !window.getProductById) return;
    const cart = window.getCart();
    cartList.innerHTML = '';
    let total = 0;
    if (cart.length === 0) {
      emptyCartMsg.style.display = 'block';
      cartTotal.textContent = '$0';
      checkoutBtn.style.display = 'none';
      realizarCompraBtn.style.display = 'none';
      return;
    }
    emptyCartMsg.style.display = 'none';
    checkoutBtn.style.display = 'block';
    realizarCompraBtn.style.display = 'block';
    cart.forEach(item => {
      const p = window.getProductById(item.productId);
      if (!p) return;
      const price = p.salePrice || p.price;
      total += price * item.qty;
      cartList.innerHTML += `
        <div class="cart-product">
          <img src="${p.image}" alt="${p.name}" class="cart-product-img">
          <div class="cart-product-info">
            <div class="cart-product-name">${p.name}</div>
            <div class="cart-product-desc">${p.description || ''}</div>
            <div class="cart-product-price">$${price.toLocaleString()}</div>
          </div>
          <div class="cart-product-actions">
            <button class="cart-product-add" data-product-id="${item.productId}" style="background:#4caf50; color:#fff; border:none; border-radius:5px; padding:0.2em 0.7em; font-size:1em; cursor:pointer;">+</button>
            <input type="number" min="1" max="${p.stock}" value="${item.qty}" class="cart-product-qty" data-product-id="${item.productId}">
            <button class="cart-product-remove" data-product-id="${item.productId}" title="Eliminar">🗑</button>
          </div>
        </div>
      `;
    });
    cartTotal.textContent = `$${total.toLocaleString()}`;
  }

  // Eventos para agregar, eliminar y cambiar cantidad
  cartList.addEventListener('click', function(e) {
    if (e.target.classList.contains('cart-product-add')) {
      const id = e.target.getAttribute('data-product-id');
      if (window.addToCart) window.addToCart(id, 1);
    }
    if (e.target.classList.contains('cart-product-remove')) {
      const id = e.target.getAttribute('data-product-id');
      if (window.removeFromCart) window.removeFromCart(id);
    }
  });
  cartList.addEventListener('input', function(e) {
    if (e.target.classList.contains('cart-product-qty')) {
      const id = e.target.getAttribute('data-product-id');
      const qty = Number(e.target.value);
      if (window.updateQuantity) window.updateQuantity(id, qty);
    }
  });

  if (window.onCartChange) window.onCartChange(renderCart);
  // El renderCart inicial ahora lo llama ensureProductsSeed

  // Botón de pago
  checkoutBtn.onclick = function() {
    alert('Aquí iría el proceso de pago (integración pendiente)');
  };
  realizarCompraBtn.onclick = function() {
    alert('¡Compra realizada! (simulado)');
    if (window.clearCart) window.clearCart();
  };
});
