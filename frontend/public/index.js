let cantidades2 = {};
let productos = [];

// --- Función para actualizar el contador del carrito ---
function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const contadorCarritoElement = document.querySelector('.bi-cart-plus');
    if (contadorCarritoElement) {
        contadorCarritoElement.textContent = carrito.reduce((total, item) => total + (item.cantidad || 0), 0);
    }
}

// --- Función para agregar productos al carrito ---
function agregarAlCarrito(producto, cantidad) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    const index = carrito.findIndex(item => item.id === producto.id);

    if (index !== -1) {

        carrito[index].cantidad = (carrito[index].cantidad || 0) + parseInt(cantidad, 10);
        carrito[index].cantidad = Math.min(5, carrito[index].cantidad);
    } else {
        const productoConCantidad = { ...producto, cantidad: parseInt(cantidad, 10) };
        carrito.push(productoConCantidad);
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
}

// --- Función para mostrar los productos en la página ---
function mostrarProductos(lista) {
    const contenedor = document.getElementById('contenedorProductos');
    if (!contenedor) {
        console.error("Error: No se encontró el contenedor de productos con ID 'contenedorProductos'.");
        return;
    }
    contenedor.innerHTML = '';

    lista.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'w-full';
        card.innerHTML = `
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl w-full h-full flex flex-col">
                <div class="relative h-48 w-full overflow-hidden">
                    <img src="${prod.imagenUrl || 'https://via.placeholder.com/150'}" alt="${prod.nombre}" class="block w-full h-full object-cover transition-transform duration-300 hover:scale-105">
                    <div class="absolute top-0 right-0 bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-bl-lg">
                        $${prod.precio.toFixed(2)}
                    </div>
                </div>
                <div class="p-4 flex flex-col justify-between flex-grow">
                    <h3 class="text-xl font-bold text-gray-900 mb-2 truncate">${prod.nombre}</h3>
                    <p class="text-sm text-gray-600 mb-3 overflow-hidden transition-all duration-300 ease-in-out max-h-12 hover:max-h-32">
                        ${prod.descripcion}
                    </p>
                    <div class="mt-auto">
                        <div class="flex items-center justify-center gap-3 mb-3">
                            <button onclick="decrementarCantidad('${prod._id || prod.id}')" class="bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold py-1 px-3 rounded-full text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">-</button>
                            <span id="cantidad-${prod._id || prod.id}" class="text-lg font-bold text-gray-800">0</span>
                            <button onclick="incrementarCantidad('${prod._id || prod.id}')" class="bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold py-1 px-3 rounded-full text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">+</button>
                        </div>
                        <button id="btnAgregar-${prod._id || prod.id}" disabled class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200 ease-in-out transform shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                            Agregar al carrito
                        </button>
                    </div>
                </div>
            </div>
        `;

        contenedor.appendChild(card);

        const productId = prod._id || prod.id;
        const btnAgregar = card.querySelector(`#btnAgregar-${productId}`);
        if (btnAgregar) {
            btnAgregar.addEventListener('click', () => {
                const cantidadElemento = document.getElementById(`cantidad-${productId}`);
                const cantidadSeleccionada = parseInt(cantidadElemento.textContent, 10);

                if (cantidadSeleccionada > 0) {
                    agregarAlCarrito(prod, cantidadSeleccionada);
                    cantidades2[productId] = 0;
                    actualizarUI(productId);
                } else {
                    alert('Por favor, selecciona una cantidad mayor a cero para agregar al carrito.');
                }
            });
        }

        cantidades2[productId] = cantidades2[productId] || 0;
        actualizarUI(productId);
    });
}


// Función para cargar categorías en el filtro
function cargarCategorias(lista) {
    const categorias = [...new Set(lista.map(p => p.categoria))];
    const select = document.getElementById('filtroCategoria');
    select.innerHTML = '<option value="todas">Todas</option>';
    categorias.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        select.appendChild(option);
    });

    select.addEventListener('change', () => {
        const cat = select.value;
        const filtrados = (cat === 'todas') ? productos : productos.filter(p => p.categoria === cat);
        mostrarProductos(filtrados);
    });
}

// Funciones de control de cantidad
function incrementarCantidad(id) {
    if (!cantidades2[id]) cantidades2[id] = 0;
    if (cantidades2[id] < 5) {
        cantidades2[id]++;
        actualizarUI(id);
    }
}

function decrementarCantidad(id) {
    if (!cantidades2[id]) cantidades2[id] = 0;
    if (cantidades2[id] > 0) {
        cantidades2[id]--;
        actualizarUI(id);
    }
}

function actualizarUI(id) {
    const contador = document.getElementById(`cantidad-${id}`);
    const boton = document.getElementById(`btnAgregar-${id}`);

    if (contador) {
        contador.textContent = cantidades2[id];
    }

    if (boton) {
        if (cantidades2[id] > 0) {
            boton.disabled = false;
            boton.classList.remove("bg-blue-400", "cursor-not-allowed", "opacity-50");
            boton.classList.add("bg-blue-600", "hover:bg-blue-700", "cursor-pointer");
        } else {
            boton.disabled = true;
            boton.classList.remove("bg-blue-600", "hover:bg-blue-700", "cursor-pointer");
            boton.classList.add("bg-blue-400", "cursor-not-allowed", "opacity-50");
        }
    }
}

// Manejo del botón "Finalizar compra"
document.getElementById('btnComprar').addEventListener('click', () => {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito.length === 0) {
        alert('Tu carrito está vacío. ¡Agrega algunos productos antes de finalizar la compra!');
        return;
    }

    const backendBaseUrl = 'http://localhost:3000';
    fetch(`${backendBaseUrl}/orden`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            usuario: 'cliente_demo',
            productos: carrito
        })
    })
    .then(res => {
        if (!res.ok) {
            return res.json().then(errorData => {
                throw new Error(errorData.message || 'Error en la respuesta del servidor');
            });
        }
        return res.json();
    })
    .then(data => {
        document.getElementById('mensajeCompra').textContent = '¡Compra realizada con éxito! ID de tu orden: ' + data.id;
        localStorage.removeItem('carrito');
        actualizarContadorCarrito();
    })
    .catch(err => {
        console.error('Error al realizar la compra:', err);
        alert('Error al finalizar la compra. Por favor, inténtalo de nuevo.');
    });
});

document.addEventListener('DOMContentLoaded', () => {
    actualizarContadorCarrito();
    const backendBaseUrl = 'http://localhost:3000';
    const productsApiEndpoint = `${backendBaseUrl}/api/products`;

    fetch(productsApiEndpoint)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(responsePayload => {
            if (responsePayload.status === true) {
                productos = responsePayload.data;
                cargarCategorias(productos);
                mostrarProductos(productos);
            } else {
                console.error('La API de productos devolvió un estado falso:', responsePayload.message);
                const contenedor = document.getElementById('contenedorProductos');
                if (contenedor) {
                    contenedor.innerHTML = `<p class="text-danger">Error al cargar productos: ${responsePayload.message}</p>`;
                }
            }
        })
        .catch(error => {
            console.error('Error al cargar los productos desde el backend:', error);
            const contenedor = document.getElementById('contenedorProductos');
            if (contenedor) {
                contenedor.innerHTML = '<p class="text-danger">¡Ups! No pudimos cargar los productos en este momento. Por favor, verifica la conexión del servidor y la consola del navegador.</p>';
            }
        });
});