document.addEventListener('DOMContentLoaded', function() {
    renderizarCarrito();
    calcularTotal();
    actualizarContadorCarrito();
});

function renderizarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const container = document.getElementById('carrito-container');

    if (container) {
        container.innerHTML = '';

        carrito.forEach((item, index) => {
            const card = document.createElement('div');
            card.classList.add('carrito-item', 'mb-3', 'p-2', 'border', 'rounded');
            card.innerHTML = `
                <div class="d-flex align-items-center justify-content-between">
                    <img src="${item.imagen}" alt="${item.titulo}" style="width: 200px; height: auto; margin-right: 10px;">
                    <div>
                        <h5>${item.titulo}</h5>
                        <p>Precio: ${item.precio}</p>
                        <div class="d-flex align-items-center">
                            <button class="btn btn-outline-secondary btn-sm me-2" onclick="cambiarCantidad(${index}, -1)">-</button>
                            <span>${item.cantidad}</span>
                            <button class="btn btn-outline-secondary btn-sm ms-2" onclick="cambiarCantidad(${index}, 1)">+</button>
                        </div>
                    </div>
                    <button class="btn btn-outline-danger btn-sm" onclick="eliminarProducto(${index})">Eliminar</button>
                </div>
            `;
            container.appendChild(card);
            calcularTotal();
        });

        // Calcular y mostrar el total
        const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
        const totalElement = document.getElementById('total');
        if (totalElement) {
            totalElement.textContent = `Total: $${total.toFixed(2)}`;
        }
    } else {
        console.error('Elemento #carrito-container no encontrado');
    }
}

// Recuperar el carrito del localStorage y calcular el total
function calcularTotal() {

    const cart = JSON.parse(localStorage.getItem('carrito')) || [];
  
    let total = 0;
    cart.forEach(producto => {
      total += producto.precio * producto.cantidad;
    });
  
    const cartTotal = document.getElementById('cartTotal');
    cartTotal.textContent = total.toFixed(2);
}


// Cambiar la cantidad de un producto en el carrito
function cambiarCantidad(index, cambio) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito[index]) {
        const nuevaCantidad = carrito[index].cantidad + cambio;

        if (nuevaCantidad >= 0 && nuevaCantidad <= 5) {
            carrito[index].cantidad = nuevaCantidad;

            if (nuevaCantidad === 0) {
                carrito.splice(index, 1);
            }

            localStorage.setItem('carrito', JSON.stringify(carrito));
            calcularTotal();
            renderizarCarrito();
        }
    }
}

// Eliminar un producto del carrito
function eliminarProducto(index) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    calcularTotal();
    renderizarCarrito();
}

// Actualizar el contador del carrito en la parte superior de la página
function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const contadorElement = document.getElementById('contadorCarrito'); 
    
    if (contadorElement) {
        contadorElement.textContent = totalItems;
    } else {
        console.warn("Elemento con ID 'contadorCarrito' no encontrado.");
    }
}