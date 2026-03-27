const express = require('express');
const router = express.Router();
const db = require('../config/db');
const audit = require('../middleware/audit');

const { body, validationResult } = require('express-validator');

const validateOrder = [
    body('client_name').notEmpty().withMessage('El nombre del cliente es requerido'),
    body('total').isNumeric().custom(value => value > 0).withMessage('El total debe ser mayor a 0'),
    body('items').isArray({ min: 1 }).withMessage('Debe incluir al menos un producto'),
    body('items.*.product_id').isInt().withMessage('ID de producto inválido'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Cantidad inválida'),
    body('items.*.price').isNumeric().custom(value => value >= 0).withMessage('Precio inválido'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// GET all orders
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT o.*, u.username 
            FROM orders o 
            LEFT JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST create order
router.post('/', validateOrder, audit('CREATE', 'orders'), async (req, res) => {
    const { user_id, client_name, total, items, dispatch_info } = req.body;
    // items should be array of { product_id, quantity, price }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Validate stock availability with row-level locking (FOR UPDATE)
        for (const item of items) {
            const [rows] = await connection.query(
                'SELECT stock, name FROM products WHERE id = ? FOR UPDATE',
                [item.product_id]
            );

            if (rows.length === 0) {
                await connection.rollback();
                return res.status(400).json({
                    error: `Producto con ID ${item.product_id} no encontrado.`
                });
            }

            const product = rows[0];
            if (product.stock < item.quantity) {
                await connection.rollback();
                return res.status(400).json({
                    error: `Stock insuficiente para "${product.name}". Disponible: ${product.stock}, Solicitado: ${item.quantity}`
                });
            }
        }

        const [orderResult] = await connection.query(
            'INSERT INTO orders (user_id, client_name, total, dispatch_info) VALUES (?, ?, ?, ?)',
            [user_id, client_name, total, JSON.stringify(dispatch_info)]
        );

        const orderId = orderResult.insertId;

        for (const item of items) {
            await connection.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.product_id, item.quantity, item.price]
            );

            // Update stock (already validated above with FOR UPDATE lock)
            await connection.query(
                'UPDATE products SET stock = stock - ? WHERE id = ?',
                [item.quantity, item.product_id]
            );
        }

        await connection.commit();
        res.status(201).json({ message: 'Order created', id: orderId });

    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
});

// PUT dispatch order
router.put('/:id/dispatch', audit('DISPATCH', 'orders'), async (req, res) => {
    const { id } = req.params;
    try {
        await db.query(
            'UPDATE orders SET status = "Despachado" WHERE id = ?',
            [id]
        );
        res.json({ message: 'Order dispatched' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const validateUpdateOrder = [
    body('client_name').optional().notEmpty().withMessage('El nombre del cliente no puede estar vacío'),
    body('total').optional().isNumeric().custom(value => value > 0).withMessage('El total debe ser mayor a 0'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// PUT update order details
router.put('/:id', validateUpdateOrder, audit('UPDATE', 'orders'), async (req, res) => {
    const { id } = req.params;
    const { client_name, total, dispatch_info, status } = req.body;

    try {
        await db.query(
            'UPDATE orders SET client_name = ?, total = ?, dispatch_info = ?, status = COALESCE(?, status) WHERE id = ?',
            [client_name, total, JSON.stringify(dispatch_info), status, id]
        );
        res.json({ message: 'Order updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
