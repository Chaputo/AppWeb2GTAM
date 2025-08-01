let productos = [];
let cantidades2 = {};

const backendBaseUrl = 'http://localhost:3000';
const productsApiEndpoint = `${backendBaseUrl}/api/products`;
const salesApiEndpoint = `${backendBaseUrl}/api/sales/create`;
const authToken = "mi-token-super-secreto-de-prueba";

function capitalizarPrimeraLetra(cadena) {
    if (!cadena) return '';
    return cadena.charAt(0).toUpperCase() + cadena.slice(1);
}

function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const contadorCarritoElement = document.querySelector('.bi-cart-plus');
    if (contadorCarritoElement) {
        contadorCarritoElement.textContent = carrito.reduce((total, item) => total + (item.cantidad || 0), 0);
    }
}

function agregarAlCarrito(producto, cantidad) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const productId = producto.id || producto._id;
    const index = carrito.findIndex(item => item.id === productId);

    if (index !== -1) {
        carrito[index].cantidad = (carrito[index].cantidad || 0) + parseInt(cantidad, 10);
        carrito[index].cantidad = Math.min(5, carrito[index].cantidad);
    } else {
        const productoConCantidad = {
            id: productId,
            titulo: producto.nombre,
            imagen: producto.imagenUrl,
            precio: producto.precio,
            cantidad: parseInt(cantidad, 10)
        };
        carrito.push(productoConCantidad);
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
}

function mostrarProductos(lista) {
    const contenedor = document.getElementById('contenedorProductos');
    if (!contenedor) {
        console.error("Error: No se encontró el contenedor de productos.");
        return;
    }
    contenedor.innerHTML = '';

    if (lista.length === 0) {
        contenedor.innerHTML = '<p class="text-center text-gray-500 text-lg mt-8 col-span-full">No se encontraron productos.</p>';
        return;
    }

    lista.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'w-full';
        const imageUrl = prod.imagenUrl || 'https://via.placeholder.com/300x200?text=No+Image';
        const description = prod.descripcion || 'No hay descripción disponible para este producto.';

        card.innerHTML = `
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl w-full h-full flex flex-col">
                <div class="relative h-48 w-full overflow-hidden">
                    <img src="${imageUrl}" alt="${prod.nombre}" class="block w-full h-full object-cover transition-transform duration-300 hover:scale-105">
                    <div class="absolute top-0 right-0 bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-bl-lg">
                        $${prod.precio.toFixed(2)}
                    </div>
                </div>
                <div class="p-4 flex flex-col justify-between flex-grow">
                    <h3 class="text-xl font-bold text-gray-900 mb-2 truncate">${prod.nombre}</h3>
                    <p class="text-sm text-gray-600 mb-3 overflow-hidden transition-all duration-300 ease-in-out max-h-12 hover:max-h-32">
                        ${description}
                    </p>
                    <div class="mt-auto">
                        <div class="flex items-center justify-center gap-3 mb-3">
                            <button onclick="decrementarCantidad('${prod._id || prod.id}')" class="bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold py-1 px-3 rounded-full text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">-</button>
                            <span id="cantidad-${prod._id || prod.id}" class="text-lg font-bold text-gray-800">0</span>
                            <button onclick="incrementarCantidad('${prod._id || prod.id}')" class="bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold py-1 px-3 rounded-full text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">+</button>
                        </div>
                        <button id="btnAgregar-${prod._id || prod.id}" disabled class="w-full bg-blue-400 text-white font-semibold py-2 rounded-lg transition duration-200 ease-in-out transform shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
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
                    showNotification('Por favor, selecciona una cantidad mayor a cero.', 'bg-red-500');
                }
            });
        }
        cantidades2[productId] = cantidades2[productId] || 0;
        actualizarUI(productId);
    });
}

function cargarCategorias(lista) {
    const categoriasUnicas = [...new Set(lista.map(p => p.categoria.toLowerCase()))];
    const select = document.getElementById('filtroCategoria');
    select.innerHTML = '<option value="todas">Todas</option>';

    categoriasUnicas.forEach(catValue => {
        const option = document.createElement('option');
        option.value = catValue;
        option.textContent = capitalizarPrimeraLetra(catValue);
        select.appendChild(option);
    });

    select.addEventListener('change', () => {
        const catSeleccionadaValue = select.value;
        const productosFiltrados = (catSeleccionadaValue === 'todas') 
                          ? productos 
                          : productos.filter(p => p.categoria.toLowerCase() === catSeleccionadaValue);
        mostrarProductos(productosFiltrados);
    });
}

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

function showNotification(message, colorClass) {
    const notification = document.getElementById('feedbackMessage');
    if (notification) {
        notification.textContent = message;
        notification.className = `fixed bottom-4 right-4 ${colorClass} text-white px-6 py-3 rounded-lg shadow-xl transition-all duration-300 transform translate-x-0 opacity-100 z-50`;
        setTimeout(() => {
            notification.classList.add('translate-x-full', 'opacity-0');
        }, 3000);
        setTimeout(() => {
            notification.classList.remove('translate-x-full', 'opacity-0');
            notification.textContent = '';
        }, 3300);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const finalizarCompraBtn = document.getElementById('btnComprar');
    if (finalizarCompraBtn) {
        finalizarCompraBtn.addEventListener('click', async () => {
            const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

            if (carrito.length === 0) {
                showNotification('Tu carrito está vacío. ¡Agrega algunos productos antes de finalizar la compra!', 'bg-yellow-500');
                return;
            }

            const totalVenta = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

            const itemsVenta = carrito.map(item => ({
                productId: item.id,
                nombre: item.titulo,
                cantidad: item.cantidad,
                precioUnitario: item.precio
            }));

            const datosParaBackend = {
                userId: 'ID_DEL_USUARIO_DEMO', 
                items: itemsVenta,
                total: totalVenta,
                estado: 'completado',
                direccionEnvio: {
                    calle: "Calle Falsa 123",
                    ciudad: "Springfield",
                    codigoPostal: "12345",
                    pais: "Argentina"
                }
            };
            
            try {
                const response = await fetch(salesApiEndpoint, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    },
                    body: JSON.stringify(datosParaBackend)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `Error HTTP: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                showNotification('¡Compra realizada con éxito!', 'bg-green-500');
                console.log('Venta registrada:', data.saleId);

                localStorage.removeItem('carrito');
                actualizarContadorCarrito();
                
                productos.forEach(p => {
                    const prodId = p._id || p.id;
                    cantidades2[prodId] = 0;
                    actualizarUI(prodId);
                });

            } catch (error) {
                console.error('Error al finalizar la compra:', error);
                showNotification('Hubo un error al procesar tu compra. Por favor, inténtalo de nuevo.', 'bg-red-500');
            }
        });
    }

    // Código para cargar los productos al inicio
    actualizarContadorCarrito();
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
                    contenedor.innerHTML = `<p class="text-red-500 text-center text-lg mt-8">Error al cargar productos: ${responsePayload.message}</p>`;
                }
            }
        })
        .catch(error => {
            console.error('Error al cargar los productos desde el backend:', error);
            const contenedor = document.getElementById('contenedorProductos');
            if (contenedor) {
                contenedor.innerHTML = '<p class="text-red-500 text-center text-lg mt-8">¡Ups! No pudimos cargar los productos en este momento. Por favor, verifica la conexión del servidor y la consola del navegador.</p>';
            }
        });

    const pageNameInput = document.getElementById('pageName');
    const titleElement = document.getElementById('title');
    if (pageNameInput && titleElement) {
        titleElement.textContent = pageNameInput.value;
    }
});
