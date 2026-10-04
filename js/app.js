"use strict";
let productos = [];
let procesandoCompra = false;
const seleccionar = selector => document.querySelector(selector);
const moneda = importe => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(importe);
const escapar = texto => String(texto).replace(/[&<>"']/g, caracter => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[caracter]));
function notificar(texto, icono = "success") {
  return Swal.fire({ text: texto, icon: icono, toast: true, position: "top-end", timer: 2200, showConfirmButton: false });
}
async function cargarProductos() {
  seleccionar("#estado").textContent = "Cargando catálogo…";
  seleccionar("#productos").setAttribute("aria-busy", "true");
  seleccionar("#reintentar").hidden = true;
  try {
    const respuesta = await fetch("data/productos.json");
    if (!respuesta.ok) throw new Error("No se pudo leer el catálogo");
    const datos = await respuesta.json();
    const ids = new Set();
    if (!Array.isArray(datos) || !datos.length || !datos.every(producto => {
      if (!producto || typeof producto.id !== "string" || !/^[a-z0-9-]+$/.test(producto.id) || ids.has(producto.id)) return false;
      ids.add(producto.id);
      return typeof producto.nombre === "string" && typeof producto.categoria === "string" && typeof producto.descripcion === "string" && typeof producto.imagen === "string" && /^assets\/[a-z0-9-]+\.svg$/.test(producto.imagen) && Number.isFinite(producto.precio) && producto.precio > 0 && Number.isInteger(producto.stock) && producto.stock > 0;
    })) throw new Error("Catálogo inválido");
    productos = datos;
    recuperarCarrito(productos);
    const categorias = [...new Set(productos.map(({ categoria }) => categoria))];
    seleccionar("#categoria").innerHTML = '<option value="">Todo el catálogo</option>' + categorias.map(categoria => `<option value="${escapar(categoria)}">${escapar(categoria)}</option>`).join("");
    renderizarProductos();
    renderizarCarrito();
  } catch {
    seleccionar("#estado").textContent = "No pudimos cargar los productos. Verificá que la app esté abierta con Live Server y reintentá.";
    seleccionar("#reintentar").hidden = false;
  } finally {
    seleccionar("#productos").setAttribute("aria-busy", "false");
  }
}
function renderizarProductos() {
  const busqueda = seleccionar("#busqueda").value.trim().toLocaleLowerCase("es");
  const categoria = seleccionar("#categoria").value;
  const orden = seleccionar("#orden").value;
  const visibles = productos.filter(producto => (producto.nombre.toLocaleLowerCase("es").includes(busqueda) || producto.descripcion.toLocaleLowerCase("es").includes(busqueda)) && (!categoria || producto.categoria === categoria));
  if (orden !== "destacados") visibles.sort((primero, segundo) => orden === "menor" ? primero.precio - segundo.precio : segundo.precio - primero.precio);
  seleccionar("#estado").textContent = visibles.length ? `${visibles.length} productos para tu ritual` : "No encontramos productos. Probá otra búsqueda o categoría.";
  seleccionar("#productos").innerHTML = visibles.map(({ id, nombre, descripcion, precio, imagen, stock }) => `<article class="product"><img src="${escapar(imagen)}" alt="${escapar(nombre)}"><h3>${escapar(nombre)}</h3><p>${escapar(descripcion)}</p><p class="price">${moneda(precio)}</p><p>Máximo ${stock} unidades por pedido</p><button data-agregar="${id}" ${carrito[id] >= stock ? "disabled" : ""}>${carrito[id] >= stock ? "Máximo alcanzado" : "+ Agregar al carrito"}</button></article>`).join("");
}
function renderizarCarrito() {
  const seleccionados = productos.filter(({ id }) => carrito[id]);
  seleccionar("#items").innerHTML = seleccionados.length ? seleccionados.map(({ id, nombre, precio, stock }) => `<div class="cart-item"><p><strong>${escapar(nombre)}</strong> · ${moneda(precio * carrito[id])}</p><div class="cart-actions"><button type="button" data-id="${id}" data-accion="restar" aria-label="Restar ${escapar(nombre)}">−</button><span>${carrito[id]}</span><button type="button" data-id="${id}" data-accion="sumar" aria-label="Sumar ${escapar(nombre)}" ${carrito[id] >= stock ? "disabled" : ""}>+</button><button type="button" class="remove" data-id="${id}" data-accion="eliminar">Quitar</button></div></div>`).join("") : '<p class="hint">Tu carrito está esperando su primer mate.<br>Elegí algo del catálogo para empezar.</p>';
  const { subtotal, envio, total, cantidad } = calcularTotales(productos, seleccionar("#entrega").value);
  seleccionar("#subtotal").textContent = moneda(subtotal);
  seleccionar("#costo-envio").textContent = envio ? moneda(envio) : "Sin cargo";
  seleccionar("#total").textContent = moneda(total);
  seleccionar("#cantidad").textContent = cantidad;
  seleccionar("#confirmar").disabled = !cantidad || procesandoCompra;
  seleccionar("#vaciar").disabled = !cantidad;
}
function actualizarVista() { renderizarProductos(); renderizarCarrito(); }
seleccionar("#productos").addEventListener("click", evento => {
  const boton = evento.target.closest("[data-agregar]");
  if (!boton) return;
  const agregado = cambiarCantidad(boton.dataset.agregar, 1, productos);
  actualizarVista();
  notificar(agregado ? "Producto agregado a tu carrito" : "Alcanzaste el máximo disponible", agregado ? "success" : "info");
});
seleccionar("#items").addEventListener("click", evento => {
  const boton = evento.target.closest("[data-accion]");
  if (!boton) return;
  const { id, accion } = boton.dataset;
  if (accion === "eliminar") eliminarProducto(id);
  else cambiarCantidad(id, accion === "sumar" ? 1 : -1, productos);
  actualizarVista();
});
seleccionar("#vaciar").addEventListener("click", async () => {
  const resultado = await Swal.fire({ title: "¿Vaciar el carrito?", text: "Se quitarán todos los productos seleccionados.", icon: "question", showCancelButton: true, confirmButtonText: "Sí, vaciar", cancelButtonText: "Seguir comprando", confirmButtonColor: "#263d30" });
  if (resultado.isConfirmed) { vaciarCarrito(); actualizarVista(); }
});
seleccionar("#entrega").addEventListener("change", () => {
  const envio = seleccionar("#entrega").value === "envio";
  seleccionar("#direccion-grupo").hidden = !envio;
  seleccionar("#direccion").required = envio;
  renderizarCarrito();
});
seleccionar("#compra").addEventListener("submit", async evento => {
  evento.preventDefault();
  if (procesandoCompra || !Object.keys(carrito).length) return;
  const nombre = seleccionar("#nombre").value.trim();
  const direccion = seleccionar("#direccion").value.trim();
  const entrega = seleccionar("#entrega").value;
  if (nombre.length < 2 || (entrega === "envio" && direccion.length < 5)) {
    await Swal.fire({ icon: "warning", title: "Revisá tus datos", text: "Ingresá un nombre válido y, para envío, una dirección completa." });
    return;
  }
  procesandoCompra = true;
  renderizarCarrito();
  try {
    const { total, cantidad } = calcularTotales(productos, entrega);
    const resultado = await Swal.fire({ title: "¿Confirmamos tu pedido?", text: `${cantidad} unidades · ${moneda(total)} · ${entrega === "envio" ? "Envío a domicilio" : "Retiro sin cargo"}. Es una compra simulada.`, icon: "question", showCancelButton: true, confirmButtonText: "Confirmar pedido", cancelButtonText: "Volver", confirmButtonColor: "#263d30" });
    if (!resultado.isConfirmed) return;
    const numero = `MC-${Date.now().toString(36).toUpperCase()}`;
    const resumen = productos.filter(({ id }) => carrito[id]).map(({ id, nombre }) => `${carrito[id]} × ${nombre}`).join("; ");
    seleccionar("#detalle-pedido").textContent = `${nombre}, tu pedido ${numero} fue confirmado. ${resumen}. Total: ${moneda(total)}. ${entrega === "envio" ? `Entrega: ${direccion}.` : "Retiro en tienda (simulado)."} No se realizó ningún cobro.`;
    seleccionar("#comprobante").hidden = false;
    vaciarCarrito();
    seleccionar("#compra").reset();
    seleccionar("#direccion-grupo").hidden = true;
    seleccionar("#direccion").required = false;
    actualizarVista();
    await Swal.fire({ icon: "success", title: "¡Gracias por elegirnos!", text: `Pedido ${numero} confirmado. Encontrás el resumen debajo del carrito.`, confirmButtonColor: "#263d30" });
  } finally { procesandoCompra = false; renderizarCarrito(); }
});
seleccionar("#busqueda").addEventListener("input", renderizarProductos);
seleccionar("#categoria").addEventListener("change", renderizarProductos);
seleccionar("#orden").addEventListener("change", renderizarProductos);
seleccionar("#reintentar").addEventListener("click", cargarProductos);
renderizarCarrito();
cargarProductos();
