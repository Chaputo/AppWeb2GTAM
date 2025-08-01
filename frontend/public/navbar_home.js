const navElements = [
    { title: 'Videojuegos', link: 'categories/catVideojuegos.html' },
    { title: 'Coleccionables', link: 'categories/catColeccionables.html' },
    { title: 'Ropa', link: 'categories/catRopa.html' },
    { title: 'Decoración', link: 'categories/catDecoracion.html' }
];

const navBar = `
    <nav class="bg-gray-900 text-white p-4 shadow-lg border-b border-gray-700">
        <div class="container mx-auto flex flex-wrap items-center justify-between">
            <a href="index.html" class="flex items-center text-white text-2xl font-extrabold tracking-wider hover:text-gray-200 transition duration-300">
                <img src="assets/icono.png" alt="Logotipo GTA Market" class="w-12 h-12 mr-3 animate-pulse">
                GTA Market
            </a>

            <button
                id="navbar-toggle"
                class="lg:hidden text-white focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-md p-2"
                type="button"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>

            <div id="navbarSupportedContent" class="hidden w-full lg:flex lg:w-auto lg:flex-grow items-center">
                <ul class="flex flex-col lg:flex-row lg:space-x-6 mt-4 lg:mt-0 lg:ml-8 w-full lg:w-auto">
                    ${
                        navElements.map(e => {
                            return `
                            <li>
                                <a class="block py-2 px-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition duration-300 ease-in-out font-medium" href="${e.link}">${e.title}</a>
                            </li>
                            `
                        }).join('')
                    }
                </ul>

                <div class="flex flex-col lg:flex-row lg:ml-auto items-center mt-4 lg:mt-0 space-y-3 lg:space-y-0 lg:space-x-3 w-full lg:w-auto" id="nav-actions">
                    <span id="user-display" class="hidden text-white font-bold text-lg px-2 py-1 rounded-md bg-purple-700"></span>

                    <a href="cart/cart.html" class="inline-flex items-center justify-center px-4 py-2 rounded-lg border-2 border-green-500 text-green-300 hover:bg-green-600 hover:text-white transition duration-300 shadow-md w-full lg:w-auto">
                        <i class="bi bi-cart-plus text-lg mr-2"></i>
                        <span class="font-semibold">Carrito</span>
                    </a>
                    <a href="register/register.html" class="inline-flex items-center justify-center px-4 py-2 rounded-lg border-2 border-blue-500 text-blue-300 hover:bg-blue-600 hover:text-white transition duration-300 shadow-md w-full lg:w-auto">
                        <i class="bi bi-bookmark-plus text-lg mr-2"></i> <span class="font-semibold">Registrarse</span>
                    </a>
                    <button id="login-button-modal" class="inline-flex items-center justify-center px-4 py-2 rounded-lg border-2 border-purple-500 text-purple-300 hover:bg-purple-600 hover:text-white transition duration-300 shadow-md w-full lg:w-auto">
                        <i class="bi bi-box-arrow-in-right text-lg mr-2"></i> <span class="font-semibold">Ingresar</span>
                    </button>
                    <button id="logOutBtn" class="hidden inline-flex items-center justify-center px-4 py-2 rounded-lg border-2 border-red-500 text-red-400 hover:bg-red-600 hover:text-white transition duration-300 shadow-md w-full lg:w-auto">
                        <i class="bi bi-box-arrow-left text-lg mr-2"></i>
                        <span class="font-semibold">Cerrar sesión</span>
                    </button>
                </div>
            </div>
        </div>
    </nav>
`;

const modal = `
    <div id="modal-login" class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 hidden">
        <div class="bg-gray-800 text-white border border-gray-700 shadow-xl rounded-lg max-w-lg w-full mx-4 my-8 relative">
            <div class="p-4 border-b border-gray-700 flex items-center justify-between">
                <div class="flex items-center">
                    <img src="assets/icono.png" alt="Log In Icon" class="w-14 h-14 mr-3">
                    <h5 class="text-2xl font-bold text-white">- Iniciar Sesión</h5>
                </div>
                <button type="button" id="close-modal-button" class="text-white opacity-100 hover:opacity-75 transition duration-200 absolute top-2 right-2">
                    <i class="bi bi-x-lg text-xl"></i>
                </button>
            </div>
            <div class="p-5">
                <form id="login-form">
                    <div class="mb-4">
                        <label for="email" class="block text-gray-300 text-lg mb-2 font-medium">Email</label>
                        <input type="email" class="bg-gray-700 text-white border border-gray-600 rounded-md p-3 w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400" id="email-login" placeholder="nombre@ejemplo.com" required>
                    </div>
                    <div class="mb-4">
                        <label for="password" class="block text-gray-300 text-lg mb-2 font-medium">Contraseña</label>
                        <input type="password" class="bg-gray-700 text-white border border-gray-600 rounded-md p-3 w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400" id="password-login" placeholder="Contraseña" required>
                    </div>
                </form>
            </div>
            <div class="p-4 border-t border-gray-700 flex justify-end space-x-3">
                <button type="button" id="close-modal-footer-button" class="bg-gray-600 hover:bg-gray-700 text-white rounded-md px-4 py-2 transition duration-200 shadow-sm">Cerrar</button>
                <button type="submit" form="login-form" id="btn-login" class="bg-purple-600 hover:bg-purple-700 text-white rounded-md px-4 py-2 transition duration-200 shadow-md">Iniciar Sesión</button>
            </div>
        </div>
    </div>
`;

let navContainer = document.querySelector('header');
let modContainer = document.getElementById('modalContainer');
let pageName = document.getElementById('pageName') ? document.getElementById('pageName').value : ''; 
let title = document.getElementById('title');

window.addEventListener('load', () => {
    navContainer.innerHTML = navBar;
    modContainer.innerHTML = modal;
    setBtnLogin();

    if (title) {
        title.textContent = `Bienvenido a ${pageName}`;
    }

    if (pageName) {
        document.title = pageName;
    } else {
        document.title = "GTA Market";
    }


    const navbarToggle = document.getElementById('navbar-toggle');
    const navbarContent = document.getElementById('navbarSupportedContent');

    if (navbarToggle && navbarContent) {
        navbarToggle.addEventListener('click', () => {
            navbarContent.classList.toggle('hidden');
            navbarContent.classList.toggle('flex');
            const isExpanded = navbarContent.classList.contains('flex');
            navbarToggle.setAttribute('aria-expanded', isExpanded);
        });
    }

    const loginButtonModal = document.getElementById('login-button-modal');
    const modalLogin = document.getElementById('modal-login');
    const closeModalButton = document.getElementById('close-modal-button');
    const closeModalFooterButton = document.getElementById('close-modal-footer-button');

    if (loginButtonModal && modalLogin && closeModalButton && closeModalFooterButton) {
        loginButtonModal.addEventListener('click', () => {
            modalLogin.classList.remove('hidden');

        });

        closeModalButton.addEventListener('click', () => {
            modalLogin.classList.add('hidden');
        });

        closeModalFooterButton.addEventListener('click', () => {
            modalLogin.classList.add('hidden');
        });

        modalLogin.addEventListener('click', (event) => {
            if (event.target === modalLogin) {
                modalLogin.classList.add('hidden');
            }
        });
    }

    const logOutButton = document.getElementById('logOutBtn');
    if (logOutButton) {
        logOutButton.addEventListener('click', function() {
            sessionStorage.clear();
            window.location.reload();
        });
    }

    updateNavbarForUserStatus();
});

function setBtnLogin() {
    const saveDataBtn = document.getElementById('btn-login');
    const emailInput = document.getElementById('email-login');
    const passwordInput = document.getElementById('password-login');

    if (saveDataBtn && emailInput && passwordInput) {
        saveDataBtn.addEventListener('click', async (event) => {
            event.preventDefault();

            const email = emailInput.value;
            const password = passwordInput.value;

            try {
                const simulatedResponse = await new Promise(resolve => setTimeout(() => {
                    if (email === "test@example.com" && password === "password123") {
                        resolve({ ok: true, json: () => Promise.resolve({ status: true, nombre: "Usuario", apellido: "Demo" }) });
                    } else {
                        resolve({ ok: false, json: () => Promise.resolve({ status: false }) });
                    }
                }, 500));

                const data = await simulatedResponse.json();

                if (simulatedResponse.ok && data.status) {
                    sessionStorage.setItem('usuario', JSON.stringify(data));
                    alert(`¡Bienvenido/a ${data.nombre} ${data.apellido}!`);

                    const modalLogin = document.getElementById('modal-login');
                    if (modalLogin) modalLogin.classList.add('hidden');

                    updateNavbarForUserStatus();
                    window.location.reload();
                } else {
                    alert('Correo o contraseña incorrectos. Por favor, inténtalo de nuevo.');
                }
            } catch (error) {
                console.error('Error al iniciar sesión:', error);
                alert('Ocurrió un error al intentar iniciar sesión. Por favor, inténtalo más tarde.');
            }
        });
    }
}

function updateNavbarForUserStatus() {
    const usuarioGuardado = JSON.parse(sessionStorage.getItem('usuario'));
    const registerBtn = document.querySelector('a[href="register/register.html"]');
    const loginBtn = document.getElementById('login-button-modal');
    const logOutBtn = document.getElementById('logOutBtn');
    const userDisplay = document.getElementById('user-display');

    if (usuarioGuardado) {
        if (registerBtn) registerBtn.classList.add('hidden');
        if (loginBtn) loginBtn.classList.add('hidden');
        if (logOutBtn) logOutBtn.classList.remove('hidden');
        if (userDisplay) {
            userDisplay.textContent = `👋 Hola, ${usuarioGuardado.nombre}`;
            userDisplay.classList.remove('hidden');
        }
    } else {
        if (registerBtn) registerBtn.classList.remove('hidden');
        if (loginBtn) loginBtn.classList.remove('hidden');
        if (logOutBtn) logOutBtn.classList.add('hidden');
        if (userDisplay) userDisplay.classList.add('hidden');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateNavbarForUserStatus();
});