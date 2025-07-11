
document.addEventListener('DOMContentLoaded', () => {
    cargarProductosCarrito();
});


// Cargamos los productos que se encuentran en localStorage
function cargarProductosCarrito() {
    
    const carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];

    document.querySelector('#tabla_carrito').innerHTML = ''; // Limpiar el contenido existente de la tabla

    let subtotalCalculado = 0;

    if (carrito.length === 0) {
        // Mostrar mensaje si el carrito está vacío
        document.querySelector('#tabla_carrito').innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">Tu carrito está vacío. Agrega productos desde el <a href="./catalogo.html">catalogo</a>.</td></tr>';
    } else {
        carrito.forEach(producto => {
            const filaHTML = crearFilaProducto(producto);
            document.querySelector('#tabla_carrito').innerHTML += filaHTML; // Añadir la fila al tbody
            subtotalCalculado += producto.price * producto.cantidad;
        });
    }

    // subtotal y el total 
    actualizarTotalCarrito(subtotalCalculado);

  
    eventosFila();
}


// Funciones 

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
   `
}

function actualizarTotalCarrito(subtotal) {
    document.querySelectorAll('#total').forEach(elemento => elemento.innerHTML = subtotal.toFixed(2))
}


// eliminar o cambiar cantidad

function eventosFila() {

   
    //const botonesEliminar = document.querySelectorAll('.remove-btn');
    document.querySelectorAll('.remove-btn').forEach(boton => {
        boton.addEventListener('click', () => {
            // Obtenemos el carrito
            const carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];
            //obtenemos el id del boton
            const productId = parseInt(boton.id);
            // Encontrar el índice del producto en el carrito
            const indiceProducto = carrito.findIndex(producto => producto.id === productId);
            //console.log(indiceProducto)
            if (indiceProducto !== -1) {
                // Eliminar el producto del array
                carrito.splice(indiceProducto, 1);

                // Actualizar localStorage
                localStorage.setItem('carritoDeCompras', JSON.stringify(carrito));

                // Recargar la vista del carrito
                cargarProductosCarrito();

                console.log(`Producto con ID ${productId} eliminado del carrito`);
            }

        });
    });


    // cambiar cantidad

    document.querySelectorAll('.cantidad-producto').forEach(input => {
        input.addEventListener('change', () => {
            // Obtenemos el carrito
            const carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];
            // Obtener el input que fue modificado
            const input = document.activeElement;
            const productId = parseInt(input.id);
            const nuevaCantidad = parseInt(input.value);

            // Validar cantidad
            if (nuevaCantidad < 1) {
                input.value = 1;
                return;
            }

            // Encontrar el producto en el carrito
            const producto = carrito.find(item => item.id === productId);

            if (producto) {
                // Actualizar la cantidad
                producto.cantidad = nuevaCantidad;

                // Actualizar localStorage
                localStorage.setItem('carritoDeCompras', JSON.stringify(carrito));

                // Recalcular y actualizar solo los totales 
                actualizarTotales();

                console.log(`Cantidad del producto ID ${productId} actualizada a ${nuevaCantidad}`);
            }
        });
    });

}

function actualizarTotales() {
    // Obtenemos el carrito
    const carrito = JSON.parse(localStorage.getItem('carritoDeCompras')) || [];
    let subtotalCalculado = 0;

    // calcular subtotal
    carrito.forEach(producto => {
        subtotalCalculado += producto.price * producto.cantidad;
    });

    // Actualizar subtotales individuales en la tabla
    const filas = document.querySelectorAll('#tabla_carrito tr');
    filas.forEach(fila => {
        const input = fila.querySelector('.cantidad-producto');
        if (input) {
            const productId = parseInt(input.id);
            const producto = carrito.find(item => item.id === productId);
            if (producto) {
                const subtotalCelda = fila.cells[5]; // La celda del subtotal es la sexta (índice 5)
                const subtotalProducto = (producto.price * producto.cantidad).toFixed(2);
                subtotalCelda.textContent = `$${subtotalProducto}`;
            }
        }
    });

    // Actualizar el total final
    actualizarTotalCarrito(subtotalCalculado);
}

