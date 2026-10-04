"use strict";
// El catálogo vive en JSON. El carrito guarda únicamente id: cantidad.
const CLAVE_CARRITO = "mateClub.carrito.v1";
let carrito = {};
function avisarStorage() {
  document.querySelector("#aviso-storage").textContent = "No se pudo acceder al almacenamiento. Podés comprar, pero el carrito podría perderse al recargar.";
}
function recuperarCarrito(productos) {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_CARRITO) || "{}");
    if (!guardado || typeof guardado !== "object" || Array.isArray(guardado)) throw new Error("Formato inválido");
    carrito = {};
    productos.forEach(({ id, stock }) => {
      const cantidad = guardado[id];
      if (Number.isInteger(cantidad) && cantidad > 0) carrito[id] = Math.min(cantidad, stock);
    });
    guardarCarrito();
  } catch {
    carrito = {};
    try { localStorage.removeItem(CLAVE_CARRITO); } catch { avisarStorage(); }
    document.querySelector("#aviso-storage").textContent = "No se pudo recuperar el carrito anterior. Iniciamos uno nuevo.";
  }
}
function guardarCarrito() {
  try {
    if (Object.keys(carrito).length) localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
    else localStorage.removeItem(CLAVE_CARRITO);
  } catch { avisarStorage(); }
}
function cambiarCantidad(id, variacion, productos) {
  const producto = productos.find(producto => producto.id === id);
  if (!producto) return false;
  const cantidad = (carrito[id] || 0) + variacion;
  if (cantidad > producto.stock) return false;
  if (cantidad <= 0) delete carrito[id];
  else carrito[id] = cantidad;
  guardarCarrito();
  return true;
}
function eliminarProducto(id) { delete carrito[id]; guardarCarrito(); }
function vaciarCarrito() { carrito = {}; guardarCarrito(); }
function calcularTotales(productos, entrega) {
  const subtotal = productos.reduce((acumulado, { id, precio }) => acumulado + precio * (carrito[id] || 0), 0);
  const envio = subtotal > 0 && entrega === "envio" && subtotal < 70000 ? 4500 : 0;
  const cantidad = Object.values(carrito).reduce((acumulado, unidades) => acumulado + unidades, 0);
  return { subtotal, envio, total: subtotal + envio, cantidad };
}
