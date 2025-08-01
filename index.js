import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import userRouter from './backend/routes/user.routes.js';
import productsRouter from './backend/routes/products.routes.js';
import salesRouter from './backend/routes/sales.routes.js';
import { connectToDatabase } from './backend/database/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'frontend', 'public')));

let dbInstance;

connectToDatabase()
    .then(db => {
        dbInstance = db;
        console.log('Base de datos MongoDB conectada y lista para usar.');

        app.use((req, res, next) => {
            req.db = dbInstance;
            next();
        });
        
        app.use('/api/users', userRouter);
        app.use('/api/products', productsRouter);
        app.use('/api/sales', salesRouter);

        app.listen(port, () => {
            console.log(`Servidor levantado en http://localhost:${port}`);
        });

    })
    .catch(error => {
        console.error('*** ERROR FATAL: No se pudo conectar a la base de datos. La aplicación no se iniciará. ***', error);
        process.exit(1);
    });

app.post('/orden', (req, res) => {
    const orden = req.body;
    console.log('Orden recibida:', orden);
    res.json({ mensaje: 'Orden procesada correctamente' });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'public', 'index.html'));
});
