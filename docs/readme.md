# Mate Club

Simulador de tienda online de mates, termos y accesorios, desarrollado como proyecto final del curso de JavaScript.

**Autor:** Alejandro Gomez

La aplicación permite recorrer un catálogo, seleccionar productos, gestionar un carrito y confirmar una compra simulada desde la interfaz, sin registro ni inicio de sesión.

## Funcionalidades

- Catálogo cargado desde un archivo JSON local mediante `fetch`.
- Búsqueda por nombre o descripción, filtro por categoría y orden por precio.
- Carrito con opciones para agregar productos, modificar cantidades, quitar artículos y vaciar la selección.
- Límite de unidades por producto según la disponibilidad definida en el catálogo.
- Persistencia de productos y cantidades con `localStorage`.
- Cálculo de subtotal, envío y total en pesos argentinos.
- Formulario con nombre y dirección obligatoria para envíos a domicilio.
- Confirmación de compra y notificaciones mediante SweetAlert2.
- Comprobante en pantalla con número de pedido, productos y total.
- Mensajes de error y opción de reintento si falla la carga del catálogo.
- Diseño adaptable a diferentes tamaños de pantalla.

## Tecnologías

- HTML5 y CSS3.
- JavaScript.
- JSON y Fetch API.
- Web Storage API (`localStorage`).
- SweetAlert2, incluida localmente.

## Ejecución local

1. Descargá o cloná el repositorio.
2. Abrí la carpeta que contiene `index.html` en Visual Studio Code.
3. Instalá la extensión **Live Server**, de Ritwick Dey, si todavía no la tenés.
4. Hacé clic derecho sobre `index.html` y seleccioná **Open with Live Server**.
5. Usá la aplicación desde la dirección local que se abre en el navegador.

El proyecto debe ejecutarse mediante un servidor HTTP local para permitir la lectura del JSON con `fetch`. No se debe abrir `index.html` directamente mediante doble clic.

No requiere instalar paquetes con npm, configurar claves ni compilar archivos.

### Alternativa con Python

Si tenés Python instalado, ejecutá este comando desde la carpeta que contiene `index.html`:

```bash
python -m http.server 5500
```

Luego abrí [http://localhost:5500](http://localhost:5500) en el navegador.

## Estructura del proyecto

| Ruta | Contenido |
| --- | --- |
| `index.html` | Estructura de la interfaz y referencias a estilos y scripts. |
| `assets/` | Ilustraciones SVG de los productos. |
| `css/styles.css` | Estilos y adaptación a pantallas pequeñas. |
| `data/productos.json` | Catálogo de productos y disponibilidad por pedido. |
| `js/carrito.js` | Gestión del carrito, persistencia y cálculo de importes. |
| `js/app.js` | Carga de datos, manipulación del DOM y eventos de la aplicación. |
| `js/vendor/sweetalert2.all.min.js` | Librería para notificaciones y confirmaciones. |
| `docs/readme.md` | Documentación del proyecto. |
| `docs/LICENCIA-SweetAlert2.txt` | Licencia de la librería externa. |

El proyecto incluye dos archivos JavaScript propios y un archivo JavaScript de terceros. El catálogo se define en JSON; el carrito almacena únicamente los identificadores de los productos y sus cantidades.

## Flujo de compra

1. Buscar o filtrar productos en el catálogo.
2. Agregar los productos al carrito.
3. Ajustar las cantidades o eliminar artículos.
4. Seleccionar retiro o envío a domicilio.
5. Completar los datos solicitados y revisar el total.
6. Confirmar el pedido en el cuadro de SweetAlert2.
7. Consultar el comprobante generado en pantalla.

Cancelar la confirmación conserva el carrito. Al confirmar la compra, se vacía la selección y se elimina su información persistida.

## Reglas del simulador

- Todos los importes se expresan en pesos argentinos (ARS).
- El retiro no tiene costo.
- El envío cuesta $4.500 y es gratuito desde un subtotal de $70.000.
- La disponibilidad representa un máximo de unidades por producto y por pedido.
- Los productos y cantidades del carrito se conservan al recargar la página.
- El nombre, la dirección y el método de entrega no se guardan en `localStorage`.
- El comprobante se muestra en la página actual y no se conserva al recargar.

## Implementación de JavaScript

| Concepto | Uso en el proyecto |
| --- | --- |
| DOM y eventos | Generación de tarjetas, actualización del carrito y respuesta a acciones del usuario. |
| `map` y `filter` | Creación de contenido y selección de productos según búsqueda y categoría. |
| `find` | Búsqueda de un producto por su identificador. |
| `reduce` | Cálculo de subtotales y cantidad de unidades. |
| `forEach` y `every` | Recuperación del carrito y validación del catálogo. |
| `localStorage` | Guardado, modificación, eliminación y vaciado de la información del carrito. |
| Operador ternario y OR | Selección de valores y uso de alternativas predeterminadas. |
| Destructuring | Extracción de propiedades de productos y resultados de cálculos. |
| `async/await` | Lectura asíncrona del catálogo. |
| `try/catch/finally` | Manejo de errores y actualización del estado de carga. |
| SweetAlert2 | Notificaciones y confirmaciones sin `alert`, `prompt` ni `confirm` nativos. |

## Alcance

Proyecto educativo: las compras, los precios y los envíos son simulados. No procesa pagos, no envía pedidos a un servidor y no administra inventario compartido entre usuarios.

## Librería de terceros

[SweetAlert2](https://sweetalert2.github.io/) se distribuye bajo licencia MIT. La licencia correspondiente se incluye en [LICENCIA-SweetAlert2.txt](LICENCIA-SweetAlert2.txt).
