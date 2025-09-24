// cart.js - API de carrito para GAMERAT
// Maneja LocalStorage (gr:cart) y expone funciones para la UI

const CART_KEY = 'gr:cart';

/**
 * Devuelve el array de ítems del carrito [{ productId, qty }]
 */
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

/**
 * Guarda el array de ítems en LocalStorage
 */
function setCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  triggerCartChange();
}

/**
 * Devuelve la cantidad total de ítems (sumatoria de qty)
 */
function getCartCount() {
  return getCart().reduce((acc, item) => acc + Number(item.qty), 0);
}

/**
 * Devuelve el subtotal global del carrito (requiere products.js cargado)
 */
function getCartTotal() {
  if (!window.getProductById) return 0;
  return getCart().reduce((acc, item) => {
    const p = getProductById(item.productId);
    if (!p) return acc;
    const price = p.salePrice || p.price;
    return acc + price * item.qty;
  }, 0);
}

/**
 * Añade un producto al carrito (o suma cantidad si ya existe)
 */
function addToCart(productId, qty = 1) {
  const cart = getCart();
  const idx = cart.findIndex(i => i.productId === productId);
  if (idx >= 0) {
    cart[idx].qty += Number(qty);
  } else {
    cart.push({ productId, qty: Number(qty) });
  }
  setCart(cart);
}

/**
 * Actualiza la cantidad de un producto
 */
function updateQuantity(productId, qty) {
  let cart = getCart();
  cart = cart.map(i => i.productId === productId ? { ...i, qty: Number(qty) } : i);
  setCart(cart);
}

/**
 * Elimina un producto del carrito
 */
function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(i => i.productId !== productId);
  setCart(cart);
}

/**
 * Vacía el carrito
 */
function clearCart() {
  setCart([]);
}

// Subscripción a cambios de carrito
const cartChangeListeners = [];
function onCartChange(cb) {
  cartChangeListeners.push(cb);
}
function triggerCartChange() {
  cartChangeListeners.forEach(cb => cb(getCart()));
}

// Exponer funciones globalmente
window.getCart = getCart;
window.getCartCount = getCartCount;
window.getCartTotal = getCartTotal;
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.onCartChange = onCartChange;
