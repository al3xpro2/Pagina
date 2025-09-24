// home-products.js - Renderiza productos destacados en index.html

document.addEventListener('DOMContentLoaded', function() {
  const grid = document.getElementById('featuredProductsGrid');
  if (!grid) return;
  // Productos directos (sin JSON ni fetch)
  const products = [
    {
      id: 'p001',
      name: 'Control PS5',
      price: 59990,
      salePrice: 49990,
      stock: 12,
  image: 'https://images.pexels.com/photos/1298601/pexels-photo-1298601.jpeg?auto=compress&w=400',
      description: 'Control inalámbrico DualSense para PlayStation 5, color blanco. Vibración háptica y gatillos adaptativos.'
    },
    {
      id: 'p002',
      name: 'Xbox Series X',
      price: 599990,
      stock: 5,
  image: 'https://images.unsplash.com/photo-1606813902912-0c9e4c9c3c7a?auto=format&fit=crop&w=400&q=80',
      description: 'Consola Xbox Series X 1TB, 4K gaming, ultra rápida, compatible con generaciones anteriores.'
    },
    {
      id: 'p003',
      name: 'Nintendo Switch OLED',
      price: 389990,
      stock: 8,
  image: 'https://images.pexels.com/photos/845255/pexels-photo-845255.jpeg?auto=compress&w=400',
      description: "Nintendo Switch OLED, pantalla de 7'', modo portátil y dock, color blanco."
    },
    {
      id: 'p004',
      name: 'PC Gamer RTX 4060',
      price: 1299990,
      stock: 3,
  image: 'https://images.pexels.com/photos/1181355/pexels-photo-1181355.jpeg?auto=compress&w=400',
      description: 'PC Gamer con Intel i5, 16GB RAM, SSD 1TB, RTX 4060, Windows 11.'
    },
    {
      id: 'p005',
      name: 'The Legend of Zelda: Tears of the Kingdom',
      price: 69990,
      stock: 15,
  image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
      description: 'Videojuego para Nintendo Switch, aventura épica en mundo abierto.'
    },
    {
      id: 'p006',
      name: 'God of War Ragnarok',
      price: 59990,
      stock: 10,
  image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=400&q=80',
      description: 'Videojuego para PlayStation 5, acción y mitología nórdica.'
    },
    {
      id: 'p007',
      name: 'FIFA 25',
      price: 49990,
      stock: 20,
      image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
      description: 'El clásico juego de fútbol, edición 2025 para todas las consolas.'
    },
    {
      id: 'p008',
      name: 'Auriculares HyperX Cloud II',
      price: 69990,
      stock: 7,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
      description: 'Auriculares gaming con sonido envolvente 7.1 y micrófono desmontable.'
    },
    {
      id: 'p009',
      name: 'Monitor Gaming 27" 165Hz',
      price: 249990,
      stock: 6,
      image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
      description: 'Monitor para gaming, 27 pulgadas, 165Hz, 1ms, G-Sync compatible.'
    },
    {
      id: 'p010',
      name: 'Teclado Mecánico RGB',
      price: 39990,
      stock: 18,
  image: 'https://images.pexels.com/photos/3945682/pexels-photo-3945682.jpeg?auto=compress&w=400',
      description: 'Teclado mecánico con retroiluminación RGB y switches azules.'
    }
  ];
  grid.innerHTML = '';
  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}" class="card-img" style="height:180px;object-fit:cover;" />
      <div class="card-content">
        <div class="card-title" style="font-size:1.1em;font-weight:bold;">${p.name}</div>
        <div class="card-desc" style="font-size:0.95em;color:#ccc;margin-bottom:0.5em;">${p.description}</div>
        <div class="card-price" style="font-weight:bold;">${(p.salePrice||p.price).toLocaleString('es-CL',{style:'currency',currency:'CLP'})}</div>
        <button class="btn card-cta add-to-cart" data-product-id="${p.id}" ${p.stock === 0 ? 'disabled' : ''}>${p.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}</button>
      </div>
    `;
    grid.appendChild(card);
  });
  // Exponer función global para obtener producto por id
  window.getProductById = function(id) {
    return products.find(p => p.id === id);
  };
  grid.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart')) {
      const id = e.target.getAttribute('data-product-id');
      if (window.addToCart) window.addToCart(id, 1);
    }
  });
});
