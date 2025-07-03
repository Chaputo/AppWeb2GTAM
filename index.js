import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, 'frontend', 'public')));

import userRouter from './backend/routes/user.routes.js';
app.use('/user', userRouter);

let productData = [];
let salesData = [];
let userData = [];

async function loadDatas() {
    try {
        userData = JSON.parse(await readFile(path.join(__dirname, 'frontend', 'users', 'users.json'), 'utf-8'));
        productData = JSON.parse(await readFile(path.join(__dirname, 'frontend', 'public', 'products', 'products.json'), 'utf-8'));
        salesData = JSON.parse(await readFile(path.join(__dirname, 'frontend', 'sales', 'sales.json'), 'utf-8'));
        console.log('Datos cargados correctamente');
    } catch (err) {
        console.error('Error de carga:', err.message);
    }
}
loadDatas();

app.get('/users/all', (req, res) => res.json(userData));
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

app.listen(port, () => {
    console.log(`Servidor levantado en http://localhost:${port}`);
});