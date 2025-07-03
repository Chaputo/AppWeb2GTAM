const navElements = [
    { title: 'Videojuegos', link: '../categories/catVideojuegos.html' },
    { title: 'Coleccionables', link: '../categories/catColeccionables.html' },
    { title: 'Ropa', link: '../categories/catRopa.html' },
    { title: 'Decoración', link: '../categories/catDecoracion.html' }
];

function agregarAlCarrito(producto) {
    let carrito = JSON.parse(localStorage.getItem('cart')) || []; 
    const existingProductIndex = carrito.findIndex(item => item.id === producto.id);
    if (existingProductIndex > -1) {
        carrito[existingProductIndex].quantity += 1;
    } else {
        producto.quantity = 1; 
        carrito.push(producto);
    }
    localStorage.setItem('cart', JSON.stringify(carrito));
    actualizarContadorCarrito(); 
}

function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = carrito.reduce((sum, item) => sum + item.quantity, 0);
    const contadorElement = document.getElementById('contadorCarrito');
    if (contadorElement) {
        contadorElement.textContent = totalItems;
    }
}

//<!-- NavBar -->//
const navBar = `
    <nav class="navbar navbar-expand-lg bg-dark text-light">
        <div class="container-fluid">
            <a href="/index.html" class="navbar-brand text-light">
                <img src="../../assets/icono.png" alt="Log In Icon" style="width: 50px; height: 50px; margin-right: 8px;">
                GTA Market
            </a>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" 
            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon text-light"></span>
            </button>
            
            <div class="collapse navbar-collapse text-light" id="navbarSupportedContent">
                <ul class="navbar-nav">
                    ${navElements.map(e => `
                        <li class="nav-item">
                            <a class="nav-link text-light" href=${e.link}>${e.title}</a>
                        </li>
                    `).join('')}
                </ul>
                <div class="ms-auto d-flex align-items-center">  
                    <a href="../cart/cart.html" class="btn btn-outline-light ms-auto me-2">
                        <i class="bi bi-cart-plus"></i> Carrito (<span id="contadorCarrito">0</span>) 
                    </a>
                    <a href="../register/register.html" class="btn btn-outline-light ms-auto me-2">
                        <i class="bi bi-bookmark-plus"></i> Registrarse
                    </a>
                    <button class="btn btn-outline-light ms-auto me-2" data-bs-toggle="modal" data-bs-target="#modal-login">
                        <i class="bi bi-box-arrow-in-right"></i> Ingresar
                    </button>
                    <button id="logOutBtn" class="btn btn-outline-danger ms-auto">
                        <i class="bi bi-box-arrow-left"></i>
                    </button>
                </div>
            </div>
        </div>
    </nav>
`;
//<!-- Fin NavBar -->//

let navContainer = document.querySelector('header');
let modContainer = document.getElementById('modalContainer');
let pageNameElement = document.getElementById('pageName');
let pageName = pageNameElement ? pageNameElement.value : '';
let titleElement = document.getElementById('title');

//<!-- Modal -->//
const modal = `
    <div class="modal fade" tabindex="-1" id="modal-login">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <img src="../assets/icono.png" alt="Log In Icon" style="width: 50px; height: 50px; margin-right: 8px;">
                    <h5 class="modal-title">- Iniciar Sesión</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="login-form">
                        <div class="mb-3">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" class="form-control" id="email-login" placeholder="nombre@ejemplo.com" required>
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label">Contraseña</label>
                            <input type="password" class="form-control" id="password-login" placeholder="Contraseña" required>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="submit" form="login-form" id="btn-login" class="btn btn-primary">Iniciar Sesión</button>
                </div>
            </div>
        </div>
    </div>
`;
//<!-- Fin modal -->//


window.addEventListener('load', () => {
    if (navContainer) {
        navContainer.innerHTML = navBar;
    }
    if (modContainer) {
        modContainer.innerHTML = modal;
    }
    setBtnLogin();
    actualizarContadorCarrito(); 

    const logOutButton = document.getElementById('logOutBtn');
    if (logOutButton) {
        logOutButton.addEventListener('click', function() {
            sessionStorage.clear();  
            actualizarContadorCarrito();
        });
    }
});

function setBtnLogin(){
    const saveDataBtn = document.getElementById('btn-login');
    const emailInput = document.getElementById('email-login');

    if (saveDataBtn && emailInput) { 
        saveDataBtn.addEventListener('click', () => {
            const value1 = emailInput.value;
            sessionStorage.setItem('email-login', value1);
        });
    }
}