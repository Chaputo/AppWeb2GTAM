actualizarContadorCarrito();

// Agregar productos al carrito
function agregarAlCarrito(producto) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || []; 
    const existingProductIndex = carrito.findIndex(item => item.id === producto.id);
    if (existingProductIndex > -1) {
        carrito[existingProductIndex].cantidad += 1;
    } else {
        producto.cantidad = 1; 
        carrito.push(producto);
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito(); 
}

// Mostrar el contador del carrito
function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  document.getElementById('contadorCarrito').textContent = carrito.length;
}
actualizarContadorCarrito();


// Mostrar los productos en la página
function mostrarProductos(lista) {
  const contenedor = document.getElementById('contenedorProductos');
  contenedor.innerHTML = '';
  lista.forEach(prod => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${prod.nombre}</h3>
      <p>${prod.descripcion}</p>
      <p>Precio: $${prod.precio}</p>
      <button class="botonAgregar">Agregar al carrito</button>
    `;
    card.querySelector('.botonAgregar').addEventListener('click', () => agregarAlCarrito(prod));
    contenedor.appendChild(card);
  });
}


//Orden de compra al backend
document.getElementById('btnComprar').addEventListener('click', () => {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  if (carrito.length === 0) {
    alert('Tu carrito está vacío');
    return;
  }
  fetch('/orden', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      usuario: 'cliente_demo',
      productos: carrito
    })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById('mensajeCompra').textContent = 'Compra realizada con éxito. ID: ' + data.id;
    localStorage.removeItem('carrito');
    actualizarContadorCarrito();
  })
  .catch(err => {
    console.error(err);
    alert('Error al realizar la compra');
  });
});