document.addEventListener('DOMContentLoaded', function() {
    renderizarCarrito();
    calcularTotal();
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

function calcularTotal() {
    // Recuperar el carrito del localStorage
    const cart = JSON.parse(localStorage.getItem('carrito')) || [];
  
    // Calcular el total sumando precio * cantidad para cada producto
    let total = 0;
    cart.forEach(producto => {
      total += producto.precio * producto.cantidad;
    });
  
    // Mostrar el total en el elemento con id 'cartTotal'
    const cartTotal = document.getElementById('cartTotal');
    cartTotal.textContent = total.toFixed(2); // Mostrar con 2 decimales
}

function cambiarCantidad(index, cambio) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito[index]) {
        const nuevaCantidad = carrito[index].cantidad + cambio;

        if (nuevaCantidad >= 0 && nuevaCantidad <= 5) {
            carrito[index].cantidad = nuevaCantidad;

            // Si la cantidad llega a 0, eliminar el producto
            if (nuevaCantidad === 0) {
                carrito.splice(index, 1);
            }

            localStorage.setItem('carrito', JSON.stringify(carrito));
            calcularTotal();
            renderizarCarrito(); // Volver a renderizar el carrito
        }
    }
}

function eliminarProducto(index) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.splice(index, 1); // Elimina el producto del carrito
    localStorage.setItem('carrito', JSON.stringify(carrito));
    calcularTotal();
    renderizarCarrito(); // Volver a renderizar el carrito
}

function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const contadorCarrito = document.querySelector('.bi-cart-plus');
    contadorCarrito.textContent = carrito.reduce((total, item) => total + item.cantidad, 0);
}