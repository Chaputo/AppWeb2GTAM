fetch('/products/products.json').then(response => response.json()).then(data => {

    const container = document.getElementById('card-container');
    const categoriaPagina = document.title.toLowerCase();

    // Función para renderizar productos
    function renderizarProductos(categoria = null) {
        container.innerHTML = '';

      // Filtrar productos por categoría si se especifica
        const productosFiltrados = categoria && categoria !== "gta market" ? data.filter(producto => producto.categoria && producto.categoria.toLowerCase() === categoria) : data;


      // Renderizar las tarjetas
        productosFiltrados.forEach(producto => {
            const card = document.createElement('div');
            card.classList.add('col-md-4');

            card.innerHTML = `
                <div class="card d-flex flex-column" style="width: 18rem; height: 100%;">
                <img src="${producto.imagen}" class="card-img-top" alt="Imagen de ${producto.titulo}">

                <div class="card-body d-flex flex-column" style="flex-grow: 1;">
                    <h5 class="card-title">${producto.titulo}</h5>
                    <p class="card-text">${producto.descripcion}</p>
                    <p class="card-text"><strong>Precio: ${producto.precio}</strong></p>
                
                    <div class="d-flex flex-column mb-3">
                        <div class="d-flex align-items-center mb-3">
                            <button class="btn btn-outline-secondary btn-sm decrease-btn" onclick="updateQuantity('${producto.titulo}', -1)" style="width: 40px;">-</button>
                            <input id="${producto.id}" type="number" class="form-control text-center product-count" value="0" min="0" max="5" style="width: 50px;" readonly data-titulo="${producto.titulo}">
                            <button class="btn btn-outline-secondary btn-sm increase-btn" onclick="updateQuantity('${producto.titulo}', 1)" style="width: 40px;">+</button>
                        </div>
                        <div class="mt-3">
                            <button class="btn btn-outline-success w-100 add-to-cart-btn" data-producto='${JSON.stringify(producto)}'>
                                <i class="bi bi-cart-plus"></i> Agregar al Carrito
                            </button>
                    </div>
                    </div>
                </div>
            </div>`;

            const btnAddToCart = card.querySelector('.add-to-cart-btn');

            btnAddToCart.addEventListener('click', () => {
                const productoSeleccionado = JSON.parse(btnAddToCart.getAttribute('data-producto'));
                const cantidadprod = document.getElementById(productoSeleccionado.id).value
                agregarAlCarrito(productoSeleccionado, cantidadprod);
            });

            container.appendChild(card);
        });
    }
    // Renderizar productos según la categoría del título de la página
    renderizarProductos(categoriaPagina);

  }).catch(error => {
    console.error('Error al cargar los productos:', error);
});

  
function updateQuantity(titulo, change) {
    // Buscar el input correspondiente a este producto
    const input = document.querySelector(`input[data-titulo='${titulo}']`);
    
    if (input) {
        // Obtener el valor actual del input
        let currentValue = parseInt(input.value);
        // Si el cambio no provoca que el valor esté fuera del rango permitido, actualizarlo
        currentValue = Math.max(0, Math.min(5, currentValue + change)); // Limitar entre 0 y 5
        input.value = currentValue; // Establecer el nuevo valor
    }
}

function agregarAlCarrito(producto, cantidad) {
    // Recuperar el carrito desde localStorage
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Buscar si el producto ya está en el carrito
    const index = carrito.findIndex(item => item.titulo === producto.titulo);
    if (index !== -1) {
        // Si ya está en el carrito, incrementar la cantidad
        carrito[index].cantidad += parseInt(cantidad, 10) || 1;
    } else {
        // Si no está, agregarlo al carrito
        producto.cantidad = parseInt(cantidad, 10) || 1; // Asegurarse de que la cantidad sea un número
        carrito.push(producto);
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Actualizar el contador del carrito en la interfaz
    actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const contadorCarrito = document.querySelector('.bi-cart-plus');
    contadorCarrito.textContent = carrito.reduce((total, item) => total + item.cantidad, 0);
}

