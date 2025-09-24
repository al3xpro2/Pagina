// mini-cart.js - Controla el contador y el mini carrito desplegable

document.addEventListener('DOMContentLoaded', function() {
  const miniCart = document.getElementById('miniCart');
  const miniCartItems = document.getElementById('miniCartItems');
  const miniCartTotal = document.getElementById('miniCartTotal');
  const viewCartBtn = document.getElementById('viewCartBtn');

  function renderMiniCart() {
    if (!window.getCart || !window.getProductById) return;
    const cart = window.getCart();
    miniCartItems.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
      const p = window.getProductById(item.productId);
      if (!p) return;
      const price = p.salePrice || p.price;
      total += price * item.qty;
      miniCartItems.innerHTML += `
        <div style="display:flex; align-items:center; margin-bottom:0.7em;">
          <img src="${p.image}" alt="${p.name}" style="width:60px; height:60px; object-fit:cover; border-radius:8px; margin-right:0.7em;">
          <div style="flex:1;">
            <div style="font-weight:bold; font-size:0.98em;">${p.name}</div>
            <div style="font-size:0.9em; color:#666;">x${item.qty}</div>
            <div style="color:#009e60; font-weight:bold; font-size:0.97em;">$${price.toLocaleString()}</div>
          </div>
          <div style="display:flex; flex-direction:column; gap:0.3em; margin-left:0.7em;">
            <button class="mini-cart-add" data-product-id="${item.productId}" style="background:#4caf50; color:#fff; border:none; border-radius:5px; padding:0.2em 0.7em; font-size:1em; cursor:pointer;">+</button>
            <button class="mini-cart-remove" data-product-id="${item.productId}" style="background:#e53935; color:#fff; border:none; border-radius:5px; padding:0.2em 0.7em; font-size:1em; cursor:pointer;">🗑</button>
          </div>
        </div>
      `;
    });
  // Manejar clicks en agregar y eliminar
  miniCartItems.addEventListener('click', function(e) {
    if (e.target.classList.contains('mini-cart-add')) {
      const id = e.target.getAttribute('data-product-id');
      if (window.addToCart) window.addToCart(id, 1);
    }
    if (e.target.classList.contains('mini-cart-remove')) {
      const id = e.target.getAttribute('data-product-id');
      if (window.removeFromCart) window.removeFromCart(id);
    }
  });
  miniCartTotal.textContent = `$${total.toLocaleString()}`;
  // No cambiar display aquí, solo renderizar contenido
  }

  if (window.onCartChange) window.onCartChange(renderMiniCart);
  renderMiniCart();

  // Ver carrito
  if (viewCartBtn) {
    viewCartBtn.onclick = function() {
      window.location.href = 'carrito.html';
    };
  }

  // Mostrar/ocultar mini carrito al hacer clic en el icono del carrito
  const navCart = document.querySelector('.nav-cart');
  if (navCart && miniCart) {
    navCart.addEventListener('click', (e) => {
      e.preventDefault();
      renderMiniCart();
      miniCart.style.display = miniCart.style.display === 'block' ? 'none' : 'block';
    });
    // Ocultar el mini carrito si se hace clic fuera de él
    document.addEventListener('click', function(e) {
      if (!miniCart.contains(e.target) && !navCart.contains(e.target)) {
        miniCart.style.display = 'none';
      }
    });
  }
});
