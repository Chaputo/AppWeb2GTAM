// index.js

// 1. Importaciones: Usamos solo ES Modules si tu proyecto está configurado para ello
//    (asegúrate de tener "type": "module" en tu package.json, o usa CommonJS consistentemente)
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { readFile, writeFile } from 'fs/promises'; // Para leer/escribir archivos de forma asíncrona
import path from 'path'; // Para manejar rutas de archivos de forma robusta
import { fileURLToPath } from 'url'; // Necesario para __dirname en ES Modules

// Configuración para __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config();

// Inicializar la aplicación Express
const app = express();
const port = process.env.PORT || 3000; // Usa el puerto del .env o el 3000 por defecto

// 2. Middlewares GLOBALES: Van al principio para que afecten a todas las rutas
app.use(express.json()); // Permite a Express parsear cuerpos de solicitud JSON
app.use(cors()); // Habilita CORS para permitir solicitudes desde otros orígenes

// 3. Servir archivos estáticos
// Si tus archivos frontend (HTML, CSS, JS del cliente, imágenes) están en 'frontend/public'
// y este index.js está en la raíz del proyecto, esta es la configuración correcta.
app.use(express.static(path.join(__dirname, 'frontend', 'public')));

// Middleware para servir los productos estáticos (si products.json está en 'frontend/public/products')
// app.use('/products', express.static(path.join(__dirname, 'frontend', 'public', 'products')));
// Si products.json está dentro de 'frontend/public', ya sería accesible por la línea anterior.

// 4. Importar rutas de la API (si `userRouter` es tu ruta de API)
// Si userRouter está en './backend/routes/user.routes.js'
import userRouter from './backend/routes/user.routes.js';
app.use('/user', userRouter);


// 5. Cargar datos iniciales (Data Storage)
let productData = [];
let salesData = [];
let userData = [];

async function loadDatas() {
    try {
        // Asegúrate de que estas rutas sean CORRECTAS en relación con donde se ejecuta index.js
        // Si index.js está en la raíz, y las carpetas 'users', 'products', 'sales' están dentro de 'frontend'
        userData = JSON.parse(await readFile(path.join(__dirname, 'frontend', 'users', 'users.json'), 'utf-8'));
        productData = JSON.parse(await readFile(path.join(__dirname, 'frontend', 'public', 'products', 'products.json'), 'utf-8'));
        salesData = JSON.parse(await readFile(path.join(__dirname, 'frontend', 'sales', 'sales.json'), 'utf-8'));
        console.log('Datos cargados correctamente');
    } catch (err) {
        console.error('Error de carga:', err.message);
        // Si products.json no se carga, productData quedará vacío.
        // Asegúrate de que los archivos JSON existan y sean válidos.
    }
}
loadDatas(); // Ejecutar la función para cargar los datos al inicio

// 6. ENDPOINTS (Rutas API)
app.get('/users/all', (req, res) => res.json(userData));
app.get('/products/all', (req, res) => res.json(productData)); // Esto servirá los datos cargados en 'productData'
app.get('/sales/all', (req, res) => res.json(salesData));

app.post('/orden', (req, res) => {
    const orden = req.body;
    console.log('Orden recibida:', orden);
    res.json({ mensaje: 'Orden procesada correctamente' });
});

// 7. Ruta para servir el archivo HTML principal (Catch-all para SPA o ruta específica)
// Esta ruta debe ir DESPUÉS de las rutas de la API, pero ANTES del app.listen
// Si tu archivo principal se llama 'index.html' y está en 'frontend/public'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'public', 'index.html'));
});

// 8. Iniciar el servidor: ¡Solo una vez!
app.listen(port, () => {
    console.log(`Servidor levantado en http://localhost:${port}`);
});