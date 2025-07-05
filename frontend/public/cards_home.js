 
function updateQuantity(titulo, change) {
    const input = document.querySelector(`input[data-titulo='${titulo}']`);
    
    if (input) {
        let currentValue = parseInt(input.value);
        currentValue = Math.max(0, Math.min(5, currentValue + change));
        input.value = currentValue;
    }
}


function agregarAlCarrito(producto, cantidad) {

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    const index = carrito.findIndex(item => item.titulo === producto.titulo);
    if (index !== -1) {
        carrito[index].cantidad += parseInt(cantidad, 10) || 1;
    } else {
        producto.cantidad = parseInt(cantidad, 10) || 1;
        carrito.push(producto);
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));

    actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const contadorCarrito = document.querySelector('.bi-cart-plus');

    if (contadorCarrito) {
        contadorCarrito.textContent = carrito.reduce((total, item) => total + item.cantidad, 0);
    }
}

document.addEventListener('DOMContentLoaded', actualizarContadorCarrito);