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
/*function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  document.getElementById('contadorCarrito').textContent = carrito.length;
}
actualizarContadorCarrito();*/


// Mostrar los productos en la página
function mostrarProductos(lista) {
  const contenedor = document.getElementById('contenedorProductos');
  contenedor.innerHTML = '';
  lista.forEach(prod => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="relative bg-white rounded-3xl shadow-xl overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl w-full max-w-sm group">
  <div class="relative h-56 w-full overflow-hidden">
    <img src="${prod.imagenUrl}" alt="${prod.nombre}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
    <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
  </div>

  <div class="p-6 flex flex-col justify-between h-full">
    <div>
      <h3 class="text-2xl font-extrabold text-gray-900 mb-2 leading-tight truncate">${prod.nombre}</h3>
      <p class="text-sm text-gray-600 mb-4 line-clamp-2">${prod.descripcion}</p>
      <p class="text-xl font-bold text-blue-700 mb-4">Precio: $${prod.precio}</p>
    </div>

    <button class="botonAgregar w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg">
      Agregar al carrito
    </button>
  </div>
</div>
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

fetch('/api/products')
  .then(res => res.json())
  .then(data => {
    if (data.status && data.data) {
      mostrarProductos(data.data);
    } else {
      console.error('Error al obtener productos:', data.message);
    }
  })
  .catch(err => {
    console.error('Error al cargar productos desde el servidor:', err);
  });