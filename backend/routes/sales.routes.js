import { Router } from "express";
import { ObjectId } from "mongodb";
import { verificarTokenMiddleware } from './../utils/middleware.js';

const router = Router();

// Ruta para obtener todas las ventas (puede requerir autenticación y/o roles de admin)
router.get('/', async (req, res) => {
    try {
        const salesCollection = req.db.collection('ventas');
        
        const sales = await salesCollection.find({}).toArray();
        
        res.status(200).json({
            status: true,
            message: "Ventas obtenidas correctamente",
            data: sales
        });
    } catch (error) {
        console.error('Error al obtener ventas:', error);
        res.status(500).json({ status: false, message: "Error interno del servidor al obtener ventas.", details: error.message });
    }
});

// Ruta para obtener una venta específica por su ID
router.get('/:id', verificarTokenMiddleware, async (req, res) => {
    try {
        const salesCollection = req.db.collection('ventas');
        const saleId = req.params.id;

        if (!ObjectId.isValid(saleId)) {
            return res.status(400).json({ status: false, message: "ID de venta no válido." });
        }

        const sale = await salesCollection.findOne({ _id: new ObjectId(saleId) });

        if (!sale) {
            return res.status(404).json({ status: false, message: "Venta no encontrada." });
        }

        res.status(200).json({
            status: true,
            message: "Venta obtenida correctamente",
            data: sale
        });
    } catch (error) {
        console.error('Error al obtener venta por ID:', error);
        res.status(500).json({ status: false, message: "Error interno del servidor al obtener la venta por ID.", details: error.message });
    }
});


router.post('/create', /*verificarTokenMiddleware,*/ async (req, res) => {
    try {
        const salesCollection = req.db.collection('ventas');
        const { userId, items, total, estado, direccionEnvio } = req.body;

        if (!userId || !items || !Array.isArray(items) || items.length === 0 || !total) {
            return res.status(400).json({ status: false, message: "Faltan campos obligatorios o formato incorrecto: userId, items (array no vacío), total." });
        }

        const validatedItems = items.map(item => ({
            productId: ObjectId.isValid(item.productId) ? new ObjectId(item.productId) : item.productId,
            nombre: item.nombre,
            cantidad: parseInt(item.cantidad),
            precioUnitario: parseFloat(item.precioUnitario)
        }));

        const newSale = {
            userId: ObjectId.isValid(userId) ? new ObjectId(userId) : userId,
            items: validatedItems,
            total: parseFloat(total),
            estado: estado || 'pendiente',
            fechaVenta: new Date(),
            direccionEnvio: direccionEnvio || {},
        };

        const result = await salesCollection.insertOne(newSale);

        res.status(201).json({
            status: true,
            message: "Venta registrada correctamente",
            saleId: result.insertedId,
            data: newSale
        });

    } catch (error) {
        console.error('Error al registrar la venta:', error);
        res.status(500).json({ status: false, message: "Error interno del servidor al registrar la venta.", details: error.message });
    }
});

// Ruta para actualizar el estado de una venta (requiere token de autenticación y posiblemente rol de admin)
router.put('/update-status/:id', verificarTokenMiddleware, async (req, res) => {
    try {
        const salesCollection = req.db.collection('ventas');
        const saleId = req.params.id;
        const { estado } = req.body;

        if (!ObjectId.isValid(saleId)) {
            return res.status(400).json({ status: false, message: "ID de venta no válido." });
        }
        if (!estado) {
            return res.status(400).json({ status: false, message: "Se requiere un nuevo estado para actualizar." });
        }

        const result = await salesCollection.updateOne(
            { _id: new ObjectId(saleId) },
            { $set: { estado: estado, updatedAt: new Date() } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ status: false, message: "Venta no encontrada." });
        }

        res.status(200).json({
            status: true,
            message: "Estado de venta actualizado correctamente",
            modifiedCount: result.modifiedCount
        });

    } catch (error) {
        console.error('Error al actualizar el estado de la venta:', error);
        res.status(500).json({ status: false, message: "Error interno del servidor al actualizar el estado de la venta.", details: error.message });
    }
});

// Ruta para eliminar una venta (requiere token de autenticación y/o rol de admin)
router.delete('/delete/:id', verificarTokenMiddleware, async (req, res) => {
    try {
        const salesCollection = req.db.collection('ventas');
        const saleId = req.params.id;

        if (!ObjectId.isValid(saleId)) {
            return res.status(400).json({ status: false, message: "ID de venta no válido." });
        }

        const result = await salesCollection.deleteOne({ _id: new ObjectId(saleId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ status: false, message: "Venta no encontrada." });
        }

        res.status(200).json({
            status: true,
            message: "Venta eliminada correctamente",
            deletedCount: result.deletedCount
        });

    } catch (error) {
        console.error('Error al eliminar la venta:', error);
        res.status(500).json({ status: false, message: "Error interno del servidor al eliminar la venta.", details: error.message });
    }
});

export default router;