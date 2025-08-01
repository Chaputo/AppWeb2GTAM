import { Router } from "express";
import { ObjectId } from "mongodb";
import { verificarTokenMiddleware } from './../utils/middleware.js';

const router = Router();

// Ruta para obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const productsCollection = req.db.collection('productos');
        const products = await productsCollection.find({}).toArray();
        res.status(200).json({
            status: true,
            message: "Productos obtenidos correctamente",
            data: products
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ status: false, message: "Error interno del servidor al obtener productos.", details: error.message });
    }
});

// Ruta para obtener un producto por su ID
router.get('/:id', async (req, res) => {
    try {
        const productsCollection = req.db.collection('productos');
        const productId = req.params.id;

        if (!ObjectId.isValid(productId)) {
            return res.status(400).json({ status: false, message: "ID de producto no válido." });
        }

        const product = await productsCollection.findOne({ _id: new ObjectId(productId) });

        if (!product) {
            return res.status(404).json({ status: false, message: "Producto no encontrado." });
        }

        res.status(200).json({
            status: true,
            message: "Producto obtenido correctamente",
            data: product
        });
    } catch (error) {
        console.error('Error al obtener producto por ID:', error);
        res.status(500).json({ status: false, message: "Error interno del servidor al obtener el producto por ID.", details: error.message });
    }
});


// Ruta para crear un nuevo producto (requiere token de autenticación)
router.post('/create', verificarTokenMiddleware, async (req, res) => {
    try {
        const productsCollection = req.db.collection('productos');
        const { nombre, descripcion, precio, stock, imagenUrl } = req.body;

        if (!nombre || !precio || !stock) {
            return res.status(400).json({ status: false, message: "Faltan campos obligatorios: nombre, precio, stock." });
        }

        const newProduct = {
            nombre,
            descripcion: descripcion || '',
            precio: parseFloat(precio),
            stock: parseInt(stock),
            imagenUrl: imagenUrl || '',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await productsCollection.insertOne(newProduct);

        res.status(201).json({
            status: true,
            message: "Producto creado correctamente",
            productId: result.insertedId,
            data: newProduct
        });

    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).json({ status: false, message: "Error interno del servidor al crear el producto.", details: error.message });
    }
});


// Ruta para crear múltiples productos
router.post('/create2', verificarTokenMiddleware, async (req, res) => {
    try {
        const productsCollection = req.db.collection('productos');
        const productsData = req.body;

        if (!Array.isArray(productsData) || productsData.length === 0) {
            return res.status(400).json({ status: false, message: "La solicitud debe contener un array de productos." });
        }

        const productsToInsert = [];
        const errors = [];

        productsData.forEach((product, index) => {

            const {
                titulo,
                descripcion,
                precio,
                imagen,
                categoria,
                id
            } = product;


            const defaultStock = 100;

            if (!titulo || !precio) {
                errors.push({
                    index,
                    message: "Faltan campos obligatorios: 'titulo' y 'precio' para este producto.",
                    productReceived: product
                });
                return;
            }

            productsToInsert.push({
                nombre: titulo,
                descripcion: descripcion || '',
                precio: parseFloat(precio),
                stock: parseInt(defaultStock),
                imagenUrl: imagen || '',
                categoria: categoria || 'Sin Categoría',
                originalId: id,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        });

        if (errors.length > 0) {
            return res.status(400).json({
                status: false,
                message: "Algunos productos tienen campos obligatorios faltantes o inválidos.",
                details: errors
            });
        }

        const result = await productsCollection.insertMany(productsToInsert);

        res.status(201).json({
            status: true,
            message: `Se crearon correctamente ${result.insertedCount} productos.`,
            insertedIds: result.insertedIds,
            data: productsToInsert
        });

    } catch (error) {
        console.error('Error al crear los productos:', error);
        res.status(500).json({ status: false, message: "Error interno del servidor al crear los productos.", details: error.message });
    }
});

// Ruta para actualizar un producto (requiere token de autenticación)
router.put('/update/:id', verificarTokenMiddleware, async (req, res) => {
    try {
        const productsCollection = req.db.collection('productos');
        const productId = req.params.id;
        const { nombre, descripcion, precio, stock, imagenUrl } = req.body;

        if (!ObjectId.isValid(productId)) {
            return res.status(400).json({ status: false, message: "ID de producto no válido." });
        }

        const updateData = { updatedAt: new Date() };
        if (nombre) updateData.nombre = nombre;
        if (descripcion !== undefined) updateData.descripcion = descripcion;
        if (precio !== undefined) updateData.precio = parseFloat(precio);
        if (stock !== undefined) updateData.stock = parseInt(stock);
        if (imagenUrl !== undefined) updateData.imagenUrl = imagenUrl;

        const result = await productsCollection.updateOne(
            { _id: new ObjectId(productId) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ status: false, message: "Producto no encontrado." });
        }

        res.status(200).json({
            status: true,
            message: "Producto actualizado correctamente",
            modifiedCount: result.modifiedCount
        });

    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ status: false, message: "Error interno del servidor al actualizar el producto.", details: error.message });
    }
});

// Ruta para eliminar un producto (requiere token de autenticación)
router.delete('/delete/:id', verificarTokenMiddleware, async (req, res) => {
    try {
        const productsCollection = req.db.collection('productos');
        const productId = req.params.id;

        if (!ObjectId.isValid(productId)) {
            return res.status(400).json({ status: false, message: "ID de producto no válido." });
        }

        const result = await productsCollection.deleteOne({ _id: new ObjectId(productId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ status: false, message: "Producto no encontrado." });
        }

        res.status(200).json({
            status: true,
            message: "Producto eliminado correctamente",
            deletedCount: result.deletedCount
        });

    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ status: false, message: "Error interno del servidor al eliminar el producto.", details: error.message });
    }
});

export default router;