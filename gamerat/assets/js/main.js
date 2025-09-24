// main.js - GAMERAT
// JS principal para interacciones básicas y hooks futuros

document.addEventListener('DOMContentLoaded', function() {
  // Siempre asegurar productos sembrados antes de cualquier render
  function initCartHooks() {
    if (window.onCartChange) window.onCartChange(updateCartCounter);
    updateCartCounter();
    if (document.getElementById('cartList')) {
      // Reinstalar hooks y render
      const cartList = document.getElementById('cartList');
      const cartTotal = document.getElementById('cartTotal');
      const emptyMsg = document.getElementById('emptyCartMsg');
      const feedback = document.getElementById('cartFeedbackMsg');
      function renderCart() {
        const cart = window.getCart ? window.getCart() : [];
        let total = 0;
        if (!cart.length) {
          cartList.innerHTML = '';
          if (cartTotal) cartTotal.textContent = '$0';
          emptyMsg.style.display = 'block';
          return;
        }
        emptyMsg.style.display = 'none';
        cartList.innerHTML = '';
        cart.forEach(item => {
          const p = window.getProductById ? window.getProductById(item.productId) : null;
          if (!p) return;
          const price = p.salePrice || p.price;
          total += price * item.qty;
          const div = document.createElement('div');
          div.className = 'cart-product';
          div.setAttribute('data-product-id', item.productId);
          div.innerHTML = `
            <img src="${p.image}" alt="${p.name}" class="cart-product-img" />
            <div class="cart-product-info">
              <div class="cart-product-name">${p.name}</div>
              <div class="cart-product-desc">${p.description || ''}</div>
              <div class="cart-product-price">${formatPrice(price)}</div>
            </div>
            <div class="cart-product-actions">
              <input type="number" class="cart-product-qty" min="1" max="${p.stock}" value="${item.qty}" data-product-id="${item.productId}" title="Cantidad">
              <button class="cart-product-remove" data-product-id="${item.productId}" title="Eliminar">&#8722;</button>
            </div>
          `;
          cartList.appendChild(div);
        });
        if (cartTotal) cartTotal.textContent = formatPrice(total);
      }
      function formatPrice(price) {
        return price.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
      }
      if (window.onCartChange) window.onCartChange(renderCart);
      renderCart();
      cartList.addEventListener('click', function(e) {
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
    }
  }
  if (window.ensureProductsSeed) {
    const seedResult = window.ensureProductsSeed();
    if (seedResult && typeof seedResult.then === 'function') {
      seedResult.then(initCartHooks);
    } else {
      initCartHooks();
    }
  } else {
    initCartHooks();
  }

  // Actualizar contador de carrito en header
  function updateCartCounter() {
    const el = document.querySelector('.nav-cart-count');
    if (el && window.getCartCount) el.textContent = window.getCartCount();
  }
  if (window.onCartChange) window.onCartChange(updateCartCounter);
  updateCartCounter();

  // --- productos.html ---
  if (document.getElementById('productsGrid')) {
    const grid = document.getElementById('productsGrid');
    const count = document.getElementById('resultsCount');
    const search = document.getElementById('search');
    const category = document.getElementById('category');
    const sort = document.getElementById('sort');
    const noResults = document.getElementById('noResultsMsg');
    let products = window.getAllProducts ? window.getAllProducts() : [];

    function render() {
      const params = {
        text: search.value,
        category: category.value,
        sort: sort.value
      };
      products = window.filterProducts ? window.filterProducts(params) : [];
      grid.innerHTML = '';
      if (products.length === 0) {
        noResults.style.display = 'block';
        count.textContent = 'Mostrando 0 de 0';
        return;
      }
      noResults.style.display = 'none';
      count.textContent = `Mostrando ${products.length} de ${window.getAllProducts().length}`;
      products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <img src="${p.image}" alt="${p.name}" loading="lazy" class="card-img" />
          <div class="card-content">
            <a href="#" class="card-title" data-id="${p.id}">${p.name}</a>
            <div class="card-price">${formatPrice(p.salePrice || p.price)}</div>
            <button class="btn card-cta add-to-cart" data-product-id="${p.id}" ${p.stock === 0 ? 'disabled' : ''}>${p.stock === 0 ? 'Sin stock' : 'Añadir al carrito'}</button>
          </div>
        `;
        grid.appendChild(card);
      });
    }

    function formatPrice(price) {
      return price.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
    }

    // Filtros
    [search, category, sort].forEach(input => input && input.addEventListener('input', render));
    render();

    // Añadir al carrito
    grid.addEventListener('click', function(e) {
      if (e.target.classList.contains('add-to-cart')) {
        const id = e.target.getAttribute('data-product-id');
        if (window.addToCart) window.addToCart(id, 1);
      }
      if (e.target.classList.contains('card-title')) {
        // Navegación a detalle (si se reactiva producto.html)
        // window.location.href = `producto.html?id=${e.target.getAttribute('data-id')}`;
      }
    });
  }

  // --- carrito.html ---
  if (document.getElementById('cartList')) {
    const cartList = document.getElementById('cartList');
    const cartTotal = document.getElementById('cartTotal');
    const emptyMsg = document.getElementById('emptyCartMsg');
    const feedback = document.getElementById('cartFeedbackMsg');
    function renderCart() {
      const cart = window.getCart ? window.getCart() : [];
      let total = 0;
      if (!cart.length) {
        cartList.innerHTML = '';
        if (cartTotal) cartTotal.textContent = '$0';
        emptyMsg.style.display = 'block';
        return;
      }
      emptyMsg.style.display = 'none';
      cartList.innerHTML = '';
      cart.forEach(item => {
        const p = window.getProductById ? window.getProductById(item.productId) : null;
        if (!p) return;
        const price = p.salePrice || p.price;
        total += price * item.qty;
        const div = document.createElement('div');
        div.className = 'cart-product';
        div.setAttribute('data-product-id', item.productId);
        div.innerHTML = `
          <img src="${p.image}" alt="${p.name}" class="cart-product-img" />
          <div class="cart-product-info">
            <div class="cart-product-name">${p.name}</div>
            <div class="cart-product-desc">${p.description || ''}</div>
            <div class="cart-product-price">${formatPrice(price)}</div>
          </div>
          <div class="cart-product-actions">
            <input type="number" class="cart-product-qty" min="1" max="${p.stock}" value="${item.qty}" data-product-id="${item.productId}" title="Cantidad">
            <button class="cart-product-remove" data-product-id="${item.productId}" title="Eliminar">&#8722;</button>
          </div>
        `;
        cartList.appendChild(div);
      });
      if (cartTotal) cartTotal.textContent = formatPrice(total);
    }
    function formatPrice(price) {
      return price.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
    }
    if (window.onCartChange) window.onCartChange(renderCart);
    renderCart();
    cartList.addEventListener('click', function(e) {
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
  }
  // Hook: Scroll suave para anclas
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
  // ...otros hooks futuros...
});
