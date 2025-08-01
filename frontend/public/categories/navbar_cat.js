const navElements = [
    { title: 'Videojuegos', link: './catVideojuegos.html' }, 
    { title: 'Coleccionables', link: './catColeccionables.html' },
    { title: 'Ropa', link: './catRopa.html' },
    { title: 'Decoración', link: './catDecoracion.html' }
];

const navBar = `
    <nav class="bg-gray-900 text-white p-4 shadow-lg border-b border-gray-700">
        <div class="container mx-auto flex flex-wrap items-center justify-between">
            <a href="../index.html" class="flex items-center text-white text-2xl font-extrabold tracking-wider hover:text-gray-200 transition duration-300">
                <img src="../assets/icono.png" alt="Logotipo GTA Market" class="w-12 h-12 mr-3 animate-pulse">
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

                    <a href="../cart/cart.html" class="inline-flex items-center justify-center px-4 py-2 rounded-lg border-2 border-green-500 text-green-300 hover:bg-green-600 hover:text-white transition duration-300 shadow-md w-full lg:w-auto">
                        <i class="bi bi-cart-plus text-lg mr-2"></i>
                        <span class="font-semibold">Carrito</span>
                        <span id="cart-quantity" class="ml-1 px-2 py-1 bg-green-700 text-white text-xs font-bold rounded-full">0</span>
                    </a>
                    <a href="../register/register.html" class="inline-flex items-center justify-center px-4 py-2 rounded-lg border-2 border-blue-500 text-blue-300 hover:bg-blue-600 hover:text-white transition duration-300 shadow-md w-full lg:w-auto">
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

document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    if (header) {
        header.innerHTML = navBar;

        const navbarToggle = document.getElementById('navbar-toggle');
        const navbarSupportedContent = document.getElementById('navbarSupportedContent');

        if (navbarToggle && navbarSupportedContent) {
            navbarToggle.addEventListener('click', () => {
                const isExpanded = navbarToggle.getAttribute('aria-expanded') === 'true' || false;
                navbarToggle.setAttribute('aria-expanded', !isExpanded);
                navbarSupportedContent.classList.toggle('hidden', isExpanded);
                navbarSupportedContent.classList.toggle('flex', !isExpanded);
                navbarSupportedContent.classList.toggle('flex-col', !isExpanded);
            });
        }

        const loginButton = document.getElementById('login-button-modal');
        const modalContainer = document.getElementById('modalContainer');

        if (loginButton && modalContainer) {
            loginButton.addEventListener('click', () => {

                modalContainer.innerHTML = `
                    <div id="loginModal" class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
                        <div class="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full relative">
                            <button class="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl" id="closeModal">&times;</button>
                            <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Iniciar Sesión</h2>
                            <form>
                                <div class="mb-4">
                                    <label for="username" class="block text-gray-700 text-sm font-bold mb-2">Usuario:</label>
                                    <input type="text" id="username" name="username" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                </div>
                                <div class="mb-6">
                                    <label for="password" class="block text-gray-700 text-sm font-bold mb-2">Contraseña:</label>
                                    <input type="password" id="password" name="password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline">
                                </div>
                                <div class="flex items-center justify-between">
                                    <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                        Ingresar
                                    </button>
                                    <a class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
                                        ¿Olvidaste tu contraseña?
                                    </a>
                                </div>
                            </form>
                        </div>
                    </div>
                `;
                document.getElementById('closeModal').addEventListener('click', () => {
                    modalContainer.innerHTML = '';
                });
            });
        }

        const logOutBtn = document.getElementById('logOutBtn');
        if (logOutBtn) {
            logOutBtn.addEventListener('click', () => {
                alert('Sesión cerrada (simulado)');
            });
        }
    }
});