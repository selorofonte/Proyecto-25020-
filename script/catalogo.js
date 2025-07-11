const API_URL = 'https://dummyjson.com/products/category/mens-shoes';
let productosGlobales = [];

async function llamarAPI() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    const data = await response.json();
    productosGlobales = data.products; // los 10 productos
    dibujarDatos(productosGlobales);
  } catch (error) {
    console.error('Error al cargar productos:', error);
  }
}

function Producto(producto) {
  const tituloCorto = producto.title.length > 20 ? producto.title.substring(0, 20) + '...' : producto.title;

  return `
    <div class="producto">
      <img src="${producto.thumbnail}" alt="${producto.title}">
      <div class="producto-descripcion">
        <span>${producto.category}</span>
        <h5>${tituloCorto}</h5>
        <h4>$${producto.price.toFixed(2)}</h4>
      </div>
      <a id="btn-agregar-${producto.id}" class="carrito">
        <i class="fal fa-shopping-cart"></i>
      </a>
    </div>
  `;
}

function dibujarDatos(productos) {
  const container = document.querySelector('.productos-container');
  container.innerHTML = productos.map(Producto).join('');
  adjuntarEventosCarrito();
}

function adjuntarEventosCarrito() {
  productosGlobales.forEach(producto => {
    const btn = document.getElementById(`btn-agregar-${producto.id}`);
    if (btn) {
      btn.addEventListener('click', () => agregarProductoAlCarrito(producto));
    }
  });
}

function agregarProductoAlCarrito(producto) {
  let carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];
  const idx = carrito.findIndex(item => item.id === producto.id);

  if (idx !== -1) {
    carrito[idx].cantidad++;
  } else {
    carrito.push({
      id: producto.id,
      title: producto.title,
      price: producto.price,
      image: producto.thumbnail,
      cantidad: 1
    });
  }

  localStorage.setItem('carritoDeCompras', JSON.stringify(carrito));
  alert(`${producto.title} agregado al carrito!`);
}

document.addEventListener('DOMContentLoaded', llamarAPI);
