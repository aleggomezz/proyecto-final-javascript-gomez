# Mate Club · Proyecto final JavaScript

Autor: Alejandro Gomez. Simulador educativo de compra de mates, termos y accesorios. Precios, disponibilidad, retiro y envíos ficticios. No procesa pagos ni envía pedidos a un servidor.

## 1. Abrir y probar en Windows

1. Extraé el ZIP (clic derecho → Extraer todo).
2. Abrí Visual Studio Code. Elegí Archivo → Abrir carpeta y seleccioná `mate-club`, donde está `index.html`.
3. En Extensiones, buscá **Live Server**, de Ritwick Dey, e instalalo.
4. Clic derecho sobre `index.html` → **Open with Live Server**.
5. Se abrirá una dirección similar a `http://127.0.0.1:5500`. Usá esa ventana.
6. No abras el HTML con doble clic: `fetch` necesita un servidor HTTP para leer el JSON correctamente.

Alternativa si tenés Python: abrí una terminal dentro de `mate-club`, ejecutá `python -m http.server 5500` y visitá `http://localhost:5500`. No se necesita npm, claves, compilación ni backend. SweetAlert2 se incluye localmente.

## 2. Probar el circuito

1. Buscá “mate”, probá categorías y orden por precio.
2. Agregá Mate Oliva y aumentá a 2 unidades: subtotal $37.000.
3. Elegí envío: total $41.500 (incluye $4.500).
4. Recargá: los productos y cantidades siguen. Nombre, dirección y entrega se reinician; no se guardan datos personales.
5. Cambiá a retiro: envío sin cargo.
6. Probá restar, quitar un producto y vaciar (con opción de cancelar).
7. Agregá 2 Termos Bosque y elegí envío: $84.000, envío gratis.
8. Completá nombre y dirección. Confirmá compra; primero probá cancelar.
9. Confirmá nuevamente y aceptá: aparece el número y resumen de pedido y se vacía el carrito.
10. Recargá: el carrito permanece vacío. El comprobante solo permanece durante la sesión de página actual.
11. Probá alcanzar el máximo de un producto: los botones de sumar/agregar se deshabilitan.
12. Para probar un fallo de carga, renombrá temporalmente `data/productos.json`, recargá, comprobá el error, restaurá el nombre y pulsá Reintentar carga.
13. Revisá la vista móvil con las herramientas del navegador y comprobá que no haya errores rojos en Console.

## 3. Subir a GitHub y entregar

1. Iniciá sesión en https://github.com y creá un repositorio con **New repository**.
2. Nombre sugerido: `proyecto-final-javascript-gomez`. Elegí **Public**.
3. No agregues README, licencia ni .gitignore automáticos: la consigna exige que el único archivo suelto en raíz sea index.html. La documentación ya está en `docs/`.
4. Creá el repositorio y elegí **uploading an existing file** (o Add file → Upload files).
5. Arrastrá el CONTENIDO de `mate-club`: `index.html` y las carpetas `assets`, `css`, `js`, `data`, `docs`. No subas el ZIP ni la carpeta exterior completa.
6. Confirmá con **Commit changes**. Verificá que index.html aparece directamente en la raíz.
7. Opcional y recomendado: Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: main → carpeta /(root) → Save.
8. Esperá a que GitHub muestre la URL publicada. Abrila y repetí una compra; verificá también `URL-DEL-SITIO/data/productos.json`.
9. Entregá la URL del REPOSITORIO público. Podés añadir la URL de Pages como demo, pero no reemplaza al repositorio.
10. Abrí el repositorio en una ventana privada para comprobar que se ve sin iniciar sesión.

No se creó ni publicó un repositorio desde este entregable; esos pasos deben realizarse con tu cuenta.

## 4. Organización

- `index.html`: estructura de la interfaz y referencias a los tres scripts, en orden y con defer.
- `assets/`: seis ilustraciones SVG originales, locales.
- `css/styles.css`: diseño responsive propio.
- `data/productos.json`: catálogo completo; único array de objetos inicial de la aplicación.
- `js/carrito.js`: reglas del carrito, cálculos y persistencia.
- `js/app.js`: fetch, validación, DOM, filtros, eventos y confirmación.
- `js/vendor/sweetalert2.all.min.js`: librería de terceros SweetAlert2 11.26.25, sin modificar.
- `docs/`: esta guía y licencia de la librería.

Hay exactamente tres archivos .js, incluidos los de terceros. Los scripts propios son dos. No hay arrays de productos escritos manualmente en JavaScript: se cargan desde JSON. Los resultados de filter/map se derivan de esa fuente. El carrito es un objeto de cantidades por ID, no un segundo catálogo duplicado. No se usa login.

## 5. Cómo entender y explicar el código

### Paso A: los datos

Abrí productos.json. Cada objeto describe id, nombre, categoría, precio, stock, descripción e imagen. Para cambiar productos editás este archivo. Usá comillas dobles, sin comentarios ni comas finales. Los IDs son únicos y contienen minúsculas, números y guiones. Las imágenes deben seguir el formato assets/nombre.svg. El stock representa el máximo por pedido; no es inventario real compartido entre compradores.

### Paso B: carga asíncrona

En app.js, cargarProductos() hace fetch del JSON dentro de try. await espera la respuesta y luego su conversión con respuesta.json(). Se verifica respuesta.ok y se valida el contenido. catch muestra un error y un botón para reintentar. finally quita el estado de carga, tanto si hubo éxito como error.

### Paso C: DOM y eventos

renderizarProductos() genera tarjetas a partir de los datos. Los eventos input y change actualizan filtros. Los eventos click de los contenedores usan closest y dataset para identificar el botón: es delegación de eventos, útil porque las tarjetas se vuelven a crear. renderizarCarrito() actualiza las líneas, cantidades, totales y botones. Los textos variables se escapan antes de insertarlos con innerHTML; el comprobante usa textContent.

### Paso D: funciones de orden superior

- map transforma productos en tarjetas HTML y genera categorías.
- filter selecciona productos por búsqueda/categoría y los que están en el carrito.
- find localiza un producto por ID al cambiar cantidades.
- reduce calcula subtotal y cantidad total.
- forEach recupera cantidades válidas del almacenamiento.
- every valida los registros del JSON.

Una función de orden superior recibe otra función. Por ejemplo, reduce recibe una función que acumula precio × cantidad.

### Paso E: storage y operadores

En carrito.js, carrito empieza como objeto vacío. Al agregar un producto se guarda una propiedad como `"mate-oliva": 2`. JSON.stringify convierte el objeto a texto; setItem lo guarda. JSON.parse y getItem lo recuperan. Cambiar cantidades modifica la información persistida; eliminarProducto borra una propiedad y vuelve a guardar. vaciarCarrito usa removeItem mediante guardarCarrito. Se elimina solo la clave propia, sin borrar información ajena del mismo origen.

`carrito[id] || 0` usa OR como valor alternativo. `cantidad > 0 ? valorA : valorB` ejemplifica un ternario; en el código se aplica al costo de envío, orden y mensajes. `const { subtotal, envio, total, cantidad } = ...` es destructuring: extrae propiedades del objeto devuelto por calcularTotales.

Si el navegador bloquea localStorage, la interfaz lo informa y el carrito funciona en memoria. Si encuentra datos dañados, inicia un carrito nuevo. Al recargar se valida cada ID y se limita la cantidad al stock del catálogo.

### Paso F: confirmación

El formulario valida nombre y dirección para envío. SweetAlert2 pide confirmación. Cancelar conserva el carrito; aceptar genera un número de pedido, muestra un resumen y limpia el carrito. procesandoCompra evita confirmaciones duplicadas mientras se completa el flujo. No hay pago real ni reserva en una base de datos remota.

## 6. Checklist de la consigna

| Requisito | Implementación |
|---|---|
| Único archivo en raíz | index.html; documentación en docs/readme.md |
| Recursos multimedia | assets con imágenes SVG |
| Entre 2 y 3 JS | 2 propios + 1 librería local |
| JSON mediante fetch | data/productos.json, cargarProductos |
| DOM y eventos | renderizarProductos, renderizarCarrito, addEventListener |
| Dos funciones de orden superior | map, filter, reduce, find, forEach, every |
| Guardar/modificar/borrar/vaciar storage | guardarCarrito, cambiarCantidad, eliminarProducto, vaciarCarrito |
| Ternario, OR, destructuring | carrito.js y app.js |
| async/await, try/catch/finally | cargarProductos |
| Error de carga y reintento | estado y botón reintentar |
| Librería JS externa | SweetAlert2 local, con licencia |
| Circuito completo | catálogo → selección → carrito → cantidades → total → confirmación → comprobante |
| Sin cuadros nativos | diálogos SweetAlert2 y validación del formulario |
| Nombres semánticos | productos, carrito, calcularTotales, cargarProductos |

## 7. Fuentes y licencia de terceros

SweetAlert2: https://sweetalert2.github.io/ — https://github.com/sweetalert2/sweetalert2
Distribución: https://cdn.jsdelivr.net/npm/sweetalert2@11.26.25/dist/sweetalert2.all.min.js
Licencia MIT incluida en LICENCIA-SweetAlert2.txt. El archivo minificado es código de terceros; la explicación y los criterios de claridad se aplican a los scripts propios.
GitHub: https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository
GitHub Pages: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

Antes de entregar, recorré la guía y practicá explicar el flujo con tus palabras. Personalizá los datos o estilos que quieras, sin romper las rutas ni agregar scripts innecesarios.

## 8. Verificación realizada

Se verificaron sintaxis de ambos scripts, estructura, rutas y recursos. Pruebas automatizadas de lógica: cálculos, envío gratis, persistencia, cantidades, límites, eliminación, vaciado y recuperación ante datos dañados. Pruebas con DOM simulado: catálogo, búsqueda sin resultados, cancelación, confirmación, comprobante y errores/reintentos de fetch.

No se completó la prueba visual en navegador real en el entorno de preparación porque no se pudo instalar el navegador de pruebas. Antes de entregar, realizá el recorrido manual de la sección 2 en tu navegador, tanto en escritorio como en vista móvil.
