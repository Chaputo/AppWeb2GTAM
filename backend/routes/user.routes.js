import { Router } from "express";
import { readFile } from 'fs/promises';

const router = Router();

// Cargar los usuarios desde el archivo JSON
const fileUsers = await readFile('/GTAM/frontend/users/users.json', 'utf-8');
const userData = JSON.parse(fileUsers);

// Ruta para buscar al usuario
router.post('/search', (req, res) => {
    const userEmail = req.body.email;
    const userPass = req.body.contraseña;

    const result = userData.find(e => e.email === userEmail && e.contraseña === userPass);

    if (result) {
        const data = {
            id: result.id,
            nombre: result.nombre,
            apellido: result.apellido,
            email: result.email,
            status: true
        };
        res.status(200).json(data);
    } else {
        res.status(400).json({ status: false });
    }
});

export default router;