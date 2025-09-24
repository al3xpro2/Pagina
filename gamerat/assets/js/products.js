// products.js - API de productos para GAMERAT
// Maneja LocalStorage (gr:products) y expone funciones para la UI

const PRODUCTS_KEY = 'gr:products';

/**
 * Si no hay productos en LocalStorage, los siembra desde /assets/data/productos.json
 */
async function ensureProductsSeed() {
  if (!localStorage.getItem(PRODUCTS_KEY)) {
    const res = await fetch('assets/data/productos.json');
    const data = await res.json();
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(data));
  }
}

/**
 * Devuelve el array de productos
 */
function getAllProducts() {
  try {
    return JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];
  } catch {
    return [];
  }
}

/**
 * Devuelve un producto por id
 */
function getProductById(id) {
  return getAllProducts().find(p => p.id === id);
}

/**
 * Filtra y ordena productos
 * @param {Object} params { text, category, sort }
 */
function filterProducts({ text = '', category = '', sort = 'priceAsc' } = {}) {
  let products = getAllProducts();
  if (category) products = products.filter(p => p.category === category);
  if (text) products = products.filter(p => p.name.toLowerCase().includes(text.toLowerCase()) || (p.description && p.description.toLowerCase().includes(text.toLowerCase())));
  switch (sort) {
    case 'priceAsc': products.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price)); break;
    case 'priceDesc': products.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price)); break;
    case 'nameAsc': products.sort((a, b) => a.name.localeCompare(b.name)); break;
    case 'nameDesc': products.sort((a, b) => b.name.localeCompare(a.name)); break;
  }
  return products;
}

/**
 * Devuelve productos relacionados (misma categoría, excluyendo el actual)
 */
function getRelatedProducts(product, limit = 4) {
  if (!product) return [];
  return getAllProducts().filter(p => p.category === product.category && p.id !== product.id).slice(0, limit);
}

// Exponer funciones globalmente
window.ensureProductsSeed = ensureProductsSeed;
window.getAllProducts = getAllProducts;
window.getProductById = getProductById;
window.filterProducts = filterProducts;
window.getRelatedProducts = getRelatedProducts;
