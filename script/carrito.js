document.addEventListener('DOMContentLoaded', () => {
    cargarProductosCarrito();
});

// Muestra los productos almacenados en el carrito
function cargarProductosCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];
    document.querySelector('#tabla_carrito').innerHTML = '';
    let subtotalCalculado = 0;

    if (carrito.length === 0) {
        document.querySelector('#tabla_carrito').innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">Tu carrito está vacío. Agrega productos desde el <a href="./catalogo.html">catalogo</a>.</td></tr>';
    } else {
        carrito.forEach(producto => {
            const filaHTML = crearFilaProducto(producto);
            document.querySelector('#tabla_carrito').innerHTML += filaHTML;
            subtotalCalculado += producto.price * producto.cantidad;
        });
    }

    actualizarTotalCarrito(subtotalCalculado);
    eventosFila();
}

// Crea la fila HTML para un producto del carrito
function crearFilaProducto(producto) {
    const productoSubtotal = (producto.price * producto.cantidad).toFixed(2);
    const displayTitle = producto.title.substring(0, 10) + '...';
    return `
        <tr>
            <td>
                <button id="${producto.id}" class="remove-btn"><i class="far fa-times-circle"></i></button>
            </td>
            <td>
                <img src="${producto.image}" alt="${producto.title}" style="height: 80px; width: auto; object-fit: contain;">
            </td>
            <td>${displayTitle}</td>
            <td>$${producto.price.toFixed(2)}</td>
            <td>
                <input type="number" value="${producto.cantidad}" min="1" id="${producto.id}" class="cantidad-producto">
            </td>
            <td>$${productoSubtotal}</td>
        </tr>
   `;
}

// Actualiza el total mostrado en el carrito
function actualizarTotalCarrito(subtotal) {
    document.querySelectorAll('#total').forEach(elemento => {
        elemento.innerHTML = subtotal.toFixed(2);
    });
}

// Añade eventos a los botones de eliminar y a los inputs de cantidad
function eventosFila() {
    document.querySelectorAll('.remove-btn').forEach(boton => {
        boton.addEventListener('click', () => {
            const carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];
            const productId = parseInt(boton.id);
            const indiceProducto = carrito.findIndex(producto => producto.id === productId);

            if (indiceProducto !== -1) {
                carrito.splice(indiceProducto, 1);
                localStorage.setItem('carritoDeCompras', JSON.stringify(carrito));
                cargarProductosCarrito();
                console.log(`Producto con ID ${productId} eliminado del carrito`);
            }
        });
    });

    document.querySelectorAll('.cantidad-producto').forEach(input => {
        input.addEventListener('change', () => {
            const carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];
            const input = document.activeElement;
            const productId = parseInt(input.id);
            const nuevaCantidad = parseInt(input.value);

            if (nuevaCantidad < 1) {
                input.value = 1;
                return;
            }

            const producto = carrito.find(item => item.id === productId);

            if (producto) {
                producto.cantidad = nuevaCantidad;
                localStorage.setItem('carritoDeCompras', JSON.stringify(carrito));
                actualizarTotales();
                console.log(`Cantidad del producto ID ${productId} actualizada a ${nuevaCantidad}`);
            }
        });
    });
}

// Recalcula y actualiza subtotales y el total general
function actualizarTotales() {
    const carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];
    let subtotalCalculado = 0;

    carrito.forEach(producto => {
        subtotalCalculado += producto.price * producto.cantidad;
    });

    const filas = document.querySelectorAll('#tabla_carrito tr');
    filas.forEach(fila => {
        const input = fila.querySelector('.cantidad-producto');
        if (input) {
            const productId = parseInt(input.id);
            const producto = carrito.find(item => item.id === productId);
            if (producto) {
                const subtotalCelda = fila.cells[5];
                const subtotalProducto = (producto.price * producto.cantidad).toFixed(2);
                subtotalCelda.textContent = `$${subtotalProducto}`;
            }
        }
    });

    actualizarTotalCarrito(subtotalCalculado);
}
