import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { readFile, writeFile } from 'fs/promises'; // Mantenemos esto para productos/ventas si todavía usas JSON para ellos
import path from 'path';
import { fileURLToPath } from 'url';
import userRouter from './backend/routes/user.routes.js';

// Importar la función de conexión a MongoDB
import { connectToDatabase } from './backend/database/db.js'; // Ajusta la ruta si es necesario

// --- Configuración estándar de ES Module __dirname ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// --- Fin de configuración estándar de ES Module __dirname ---

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Esencial para analizar los cuerpos de las peticiones JSON
app.use(cors()); // Habilitar CORS para peticiones entre orígenes

app.use(express.static(path.join(__dirname, 'frontend', 'public')));

// Variable para almacenar la instancia de la base de datos
let dbInstance;

// --- Cargar otros datos JSON (si sigue siendo aplicable) ---
// Nota: userData es ELIMINADO ya que provendrá de MongoDB
let productData = [];
let salesData = [];

async function loadOtherJsonDatas() {
    try {
        // Solo carga datos de productos y ventas desde JSON si aún están basados en JSON
        productData = JSON.parse(await readFile(path.join(__dirname, 'frontend', 'public', 'products', 'products.json'), 'utf-8'));
        salesData = JSON.parse(await readFile(path.join(__dirname, 'frontend', 'sales', 'sales.json'), 'utf-8'));
        console.log('Datos de productos y ventas cargados correctamente desde JSON.');
    } catch (err) {
        console.error('Error al cargar datos JSON (productos/ventas):', err.message);
        // Considera si debes salir si estos son críticos
    }
}

// Conectar a MongoDB una vez cuando la aplicación se inicia
connectToDatabase()
    .then(db => {
        dbInstance = db;
        console.log('Base de datos MongoDB conectada y lista para usar.');

        // Middleware para adjuntar la instancia de la base de datos a cada solicitud
        // Esto hace que `req.db` esté disponible en todos tus manejadores de ruta
        app.use((req, res, next) => {
            req.db = dbInstance;
            next();
        });

        // Importar y montar el router de usuario DESPUÉS de que la base de datos esté conectada
        // Cambiado '/user' a '/api/users' por convención común de API
        
        app.use('/api/users', userRouter); // Ahora las rutas serán /api/users/create, /api/users/login, etc.

        // Cargar otros datos JSON *después* de que la base de datos esté conectada (o antes, depende de las dependencias)
        loadOtherJsonDatas();

        // Iniciar el servidor SOLAMENTE después de que la base de datos esté conectada
        app.listen(port, () => {
            console.log(`Servidor levantado en http://localhost:${port}`);
        });

    })
    .catch(error => {
        console.error('*** ERROR FATAL: No se pudo conectar a la base de datos. La aplicación no se iniciará. ***', error);
        process.exit(1); // Sale del proceso si la conexión a la DB falla
    });

// --- RUTAS ---

// ELIMINADO: app.get('/users/all', (req, res) => res.json(userData));
// Esta ruta ahora necesita obtener usuarios de MongoDB si aún quieres una lista de todos los usuarios.
// Tendrías que añadir una nueva ruta en user.routes.js como router.get('/', async (req, res) => { ... obtener de la db ... });

app.get('/products/all', (req, res) => res.json(productData));
app.get('/sales/all', (req, res) => res.json(salesData));

app.post('/orden', (req, res) => {
    const orden = req.body;
    console.log('Orden recibida:', orden);
    res.json({ mensaje: 'Orden procesada correctamente' });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'public', 'index.html'));
});

// `app.listen` se movió dentro del bloque .then() de connectToDatabase()
// para asegurar que el servidor solo se inicie cuando la conexión a la DB sea exitosa.