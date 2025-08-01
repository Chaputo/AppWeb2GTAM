import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verificarTokenMiddleware } from './../utils/middleware.js';

const router = Router();

const secret = process.env.SECRET || "gYVYnoPSRPXfhGQe73MjxpPWtknSAw8DAloNkocz5hV4Plnso5Tdi5AXXQV5LZ4a";


// Ruta de prueba
router.post('/comprar', verificarTokenMiddleware, (req, res) => {
    const user = req.user;
    res.status(200).json({
        status: true,
        message: `Compra realizada por ${user.nombre} ${user.apellido}`
    });
});

// Generar un token secreto (Login con MongoDB)
router.post('/login', async (req, res) => {

    try {
        const usersCollection = req.db.collection('usuarios');

        const userName = req.body.nombre;
        const pass = req.body.contraseña;

        const user = await usersCollection.findOne({ nombre: userName });

        if (!user) {
            return res.status(400).send({ status: false, message: "Usuario no encontrado" });
        }

        const controlPass = bcrypt.compareSync(pass, user.contraseña);
        console.log(controlPass);

        if (!controlPass) {
            return res.status(400).send({ status: false, message: "Contraseña incorrecta" });
        }

        const token = jwt.sign(
            { id: user._id, nombre: user.nombre, apellido: user.apellido, email: user.email },
            secret,
            { expiresIn: 86400 }
        );

        res.status(200).json(token);

    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).send({ status: false, message: "Error interno del servidor al intentar loguearse." });
    }
});

// Crea un nuevo usuario
router.post('/create', async (req, res) => {
    try {
        const usersCollection = req.db.collection('usuarios');

        const { nombre, apellido, email, contraseña } = req.body;

        const existingUser = await usersCollection.findOne({ email: email });
        if (existingUser) {
            return res.status(409).json({ status: false, message: "El correo electrónico ya está registrado." });
        }

        const hashedPass = bcrypt.hashSync(contraseña, 8);
        console.log(hashedPass);

        const newUser = {
            nombre,
            apellido,
            email,
            contraseña: hashedPass,
            createdAt: new Date()
        };

        const result = await usersCollection.insertOne(newUser);

        res.status(201).json({
            status: true,
            message: "Usuario creado correctamente",
            userId: result.insertedId
        });

    } catch (error) {
        console.error('Error al crear el usuario:', error);
        res.status(500).json({ status: false, message: "Error interno del servidor al crear el usuario.", details: error.message });
    }
});


// Ruta para buscar al usuario
router.post('/search', async (req, res) => {
    try {
        const usersCollection = req.db.collection('usuarios');

        const userEmail = req.body.email;
        const userPass = req.body.contraseña;

        const user = await usersCollection.findOne({ email: userEmail });
        if (!user) {
            return res.status(400).json({ status: false, message: "Usuario no encontrado." });
        }

        const passCorrecta = bcrypt.compareSync(userPass, user.contraseña);

        if (!passCorrecta) {
            return res.status(400).json({ status: false, message: "Contraseña incorrecta." });
        }

        const data = {
            id: user._id,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            status: true
        };
        res.status(200).json(data);

    } catch (error) {
        console.error('Error al buscar usuario:', error);
        res.status(500).json({ status: false, message: "Error interno del servidor al buscar el usuario.", details: error.message });
    }
});

export default router;