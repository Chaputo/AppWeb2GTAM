document.addEventListener('DOMContentLoaded', function() {
    actualizarContadorCarrito();
});



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