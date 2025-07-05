var cantidades3 = {};
var productos = [];

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

    const productId = producto._id || producto.id; // Usamos _id o id para la identificación
    const index = carrito.findIndex(item => (item._id === productId || item.id === productId));

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
        const productId = prod._id || prod.id; // Usamos _id o id para la identificación
        const card = document.createElement('div');
        card.className = 'w-full';
        card.innerHTML = `
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl w-full h-full flex flex-col">
                <div class="relative h-48 w-full overflow-hidden">
                    <img src="${prod.imagenUrl || 'https://via.placeholder.com/150'}" alt="${prod.nombre || prod.titulo}" class="block w-full h-full object-cover transition-transform duration-300 hover:scale-105">
                    <div class="absolute top-0 right-0 bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-bl-lg">
                        $${prod.precio.toFixed(2)}
                    </div>
                </div>
                <div class="p-4 flex flex-col justify-between flex-grow">
                    <h3 class="text-xl font-bold text-gray-900 mb-2 truncate">${prod.nombre || prod.titulo}</h3>
                    <p class="text-sm text-gray-600 mb-3 overflow-hidden transition-all duration-300 ease-in-out max-h-12 hover:max-h-32">
                        ${prod.descripcion}
                    </p>
                    <div class="mt-auto">
                        <div class="flex items-center justify-center gap-3 mb-3">
                            <button onclick="decrementarCantidad('${productId}')" class="bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold py-1 px-3 rounded-full text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">-</button>
                            <span id="cantidad-${productId}" class="text-lg font-bold text-gray-800">0</span>
                            <button onclick="incrementarCantidad('${productId}')" class="bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold py-1 px-3 rounded-full text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">+</button>
                        </div>
                        <button id="btnAgregar-${productId}" disabled class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200 ease-in-out transform shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                            Agregar al carrito
                        </button>
                    </div>
                </div>
            </div>
        `;

        contenedor.appendChild(card);

        const btnAgregar = card.querySelector(`#btnAgregar-${productId}`);
        if (btnAgregar) {
            btnAgregar.addEventListener('click', () => {
                const cantidadElemento = document.getElementById(`cantidad-${productId}`);
                const cantidadSeleccionada = parseInt(cantidadElemento.textContent, 10);

                if (cantidadSeleccionada > 0) {
                    agregarAlCarrito(prod, cantidadSeleccionada);
                    cantidades3[productId] = 0;
                    actualizarUI(productId);
                } else {
                    alert('Por favor, selecciona una cantidad mayor a cero para agregar al carrito.');
                }
            });
        }

        cantidades3[productId] = cantidades3[productId] || 0;
        actualizarUI(productId);
    });
}

// Función para cargar categorías en el filtro
function cargarCategorias(lista) {
    const categorias = [...new Set(lista.map(p => p.categoria))];
    const select = document.getElementById('filtroCategoria');
    if (select) {
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
}

// Funciones de control de cantidad
function incrementarCantidad(id) {
    if (!cantidades3[id]) cantidades3[id] = 0;
    if (cantidades3[id] < 5) {
        cantidades3[id]++;
        actualizarUI(id);
    }
}

function decrementarCantidad(id) {
    if (!cantidades3[id]) cantidades3[id] = 0;
    if (cantidades3[id] > 0) {
        cantidades3[id]--;
        actualizarUI(id);
    }
}

function actualizarUI(id) {
    const contador = document.getElementById(`cantidad-${id}`);
    const boton = document.getElementById(`btnAgregar-${id}`);

    if (contador) {
        contador.textContent = cantidades3[id];
    }

    if (boton) {
        if (cantidades3[id] > 0) {
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

// Manejo del botón "Finalizar compra" y carga inicial de productos
document.addEventListener('DOMContentLoaded', () => {
    actualizarContadorCarrito();
    const backendBaseUrl = 'http://localhost:3000';
    const productsApiEndpoint = `${backendBaseUrl}/api/products`;

    // --- Obtener la categoría del título de la página ---
    const pageTitle = document.title;
    // Asume que el título de la página será "Tienda de Videojuegos", "Tienda de Libros", etc.
    // Extraemos la parte relevante. Por ejemplo, de "Tienda de Videojuegos" queremos "Videojuegos".
    // Esto es una suposición. Si tus títulos son diferentes, la lógica de parseo necesitará ajustarse.
    const categoriaParaFiltrar = pageTitle.split(' ').pop(); // Toma la última palabra del título

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
                
                let productosAmostrar = productos;

                // Aplica el filtro dinámico si la categoría se pudo extraer
                if (categoriaParaFiltrar) {
                    productosAmostrar = productos.filter(prod => 
                        prod.categoria && prod.categoria.toLowerCase() === categoriaParaFiltrar.toLowerCase()
                    );
                }
                
                // Cargar categorías en el filtro (opcional, si tienes un select en tu HTML)
                // Si la página solo mostrará una categoría y no quieres que el usuario filtre, puedes omitir esta línea.
                cargarCategorias(productos); 
                
                // Muestra los productos filtrados (o todos si no se pudo determinar una categoría)
                mostrarProductos(productosAmostrar); 
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

    const btnComprar = document.getElementById('btnComprar');
    if (btnComprar) {
        btnComprar.addEventListener('click', () => {
            const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
            if (carrito.length === 0) {
                alert('Tu carrito está vacío. ¡Agrega algunos productos antes de finalizar la compra!');
                return;
            }

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
                const mensajeCompraElement = document.getElementById('mensajeCompra');
                if (mensajeCompraElement) {
                    mensajeCompraElement.textContent = '¡Compra realizada con éxito! ID de tu orden: ' + data.id;
                }
                localStorage.removeItem('carrito');
                actualizarContadorCarrito();
            })
            .catch(err => {
                console.error('Error al realizar la compra:', err);
                alert('Error al finalizar la compra. Por favor, inténtalo de nuevo.');
            });
        });
    }
});