import { Router } from "express";
import { readFile, writeFile } from 'fs/promises';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verificarTokenMiddleware } from './middleware.js';


const router = Router();
const fileUsers = await readFile('/GTAM/frontend/users/users.json', 'utf-8');
const userData = JSON.parse(fileUsers);

const secret = process.env.SECRET || "gYVYnoPSRPXfhGQe73MjxpPWtknSAw8DAloNkocz5hV4Plnso5Tdi5AXXQV5LZ4a"


// Ruta de prueba
router.post('/comprar', verificarTokenMiddleware, (req, res) => {
    const user = req.user;
    res.status(200).json({
        status: true,
        message: `Compra realizada por ${user.nombre} ${user.apellido}`
    });
});

// Generar un token secreto
router.post('/login', async (req, res) => {
    const fileUsers = await readFile('/GTAM/frontend/users/users.json', 'utf-8');
    const userData = JSON.parse(fileUsers);
    const userName = req.body.nombre;
    const pass = req.body.contraseña;

    const result = userData.find(e => e.nombre === userName);

    if (!result) {
        return res.status(400).send({ status: false, message: "Usuario no encontrado" });
    }

    const controlPass = bcrypt.compareSync(pass, result.contraseña);
    console.log(controlPass);

    if (!controlPass) {
        return res.status(400).send({ status: false, message: "Contraseña incorrecta" });
    }
    const token = jwt.sign({id: result.id,nombre: result.nombre,apellido: result.apellido,email: result.email}, secret,{ expiresIn: 86400 });

    res.status(200).json(token)
})

// Crea un nuevo usuario
router.post('/create', async (req, res) => {
    const fileUsers = await readFile('/GTAM/frontend/users/users.json', 'utf-8');
    const userData = JSON.parse(fileUsers);
    const { nombre, apellido, email, contraseña } = req.body;

    try {
        const hashedPass = bcrypt.hashSync(contraseña, 8);
        console.log(hashedPass);
        const id = userData.length > 0 ? userData[userData.length - 1].id + 1 : 1;

        userData.push({id, nombre, apellido, email, contraseña:hashedPass});
        await writeFile('/GTAM/frontend/users/users.json', JSON.stringify(userData, null, 2)) 
        res.status(200).json({ status: true, message: "Usuario creado correctamente" });

    }catch (error) {
        console.log(error);
        res.status(400).json({ status: false, message: "Error al crear el usuario" });
    }
})


// Ruta para buscar al usuario
router.post('/search', async (req, res) => {
    const fileUsers = await readFile('/GTAM/frontend/users/users.json', 'utf-8');
    const userData = JSON.parse(fileUsers);
    const userEmail = req.body.email;
    const userPass = req.body.contraseña;

    const result = userData.find(e => e.email === userEmail);
    if (!result) return res.status(400).json({ status: false });

    const passCorrecta = bcrypt.compareSync(userPass, result.contraseña);

    if (!passCorrecta) return res.status(400).json({ status: false });

    const data = {
        id: result.id,
        nombre: result.nombre,
        apellido: result.apellido,
        email: result.email,
        status: true
    };
    res.status(200).json(data);
});

export default router;