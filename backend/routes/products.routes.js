import { Router } from "express";
import { ObjectId } from "mongodb"; // Necesario para buscar por ID de MongoDB
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

        // Validar si el ID es un ObjectId válido
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
        const productsData = req.body; // Esperamos un array de productos

        // 1. Validar que productsData sea un array y no esté vacío
        if (!Array.isArray(productsData) || productsData.length === 0) {
            return res.status(400).json({ status: false, message: "La solicitud debe contener un array de productos." });
        }

        const productsToInsert = [];
        const errors = [];

        // 2. Iterar sobre cada producto para validarlo y prepararlo
        productsData.forEach((product, index) => {
            // Renombrar las propiedades de tu JSON para que coincidan con tu esquema deseado
            const {
                titulo,         // Mapea a 'nombre'
                descripcion,
                precio,         // Mapea a 'precio'
                imagen,         // Mapea a 'imagenUrl'
                categoria,
                id              // Opcional, si quieres mantener tu propio 'id'
            } = product;

            // Define un valor por defecto para 'stock' ya que no está en tu JSON
            const defaultStock = 100; // Puedes ajustarlo o incluso requerirlo si es necesario.

            // Validar campos obligatorios adaptados a tu JSON
            if (!titulo || !precio) { // 'stock' ya no es un campo obligatorio del JSON de entrada
                errors.push({
                    index,
                    message: "Faltan campos obligatorios: 'titulo' y 'precio' para este producto.",
                    productReceived: product // Útil para depuración
                });
                return; // Saltar al siguiente producto si falta algo
            }

            // Convertir tipos de datos, manejar valores por defecto y añadir campos de fecha
            productsToInsert.push({
                nombre: titulo, // Usamos 'titulo' de tu JSON como 'nombre'
                descripcion: descripcion || '',
                precio: parseFloat(precio), // Asegúrate de convertir a número
                stock: parseInt(defaultStock), // Usamos el valor por defecto para stock
                imagenUrl: imagen || '', // Usamos 'imagen' de tu JSON como 'imagenUrl'
                categoria: categoria || 'Sin Categoría', // Agregamos categoría
                originalId: id, // Puedes guardar tu 'id' original si es útil, MongoDB generará su propio '_id'
                createdAt: new Date(),
                updatedAt: new Date()
            });
        });

        // 3. Manejar errores de validación si existen
        if (errors.length > 0) {
            return res.status(400).json({
                status: false,
                message: "Algunos productos tienen campos obligatorios faltantes o inválidos.",
                details: errors
            });
        }

        // 4. Insertar todos los productos válidos en la base de datos
        const result = await productsCollection.insertMany(productsToInsert);

        res.status(201).json({
            status: true,
            message: `Se crearon correctamente ${result.insertedCount} productos.`,
            insertedIds: result.insertedIds, // IDs de los productos insertados
            data: productsToInsert // Los datos que fueron insertados (con los campos adicionales)
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