const express = require('express');
const router = express.Router();
const db = require('../config/db');
const audit = require('../middleware/audit');

const { body, validationResult } = require('express-validator');

// Validation middleware
const validateProduct = [
    body('name').notEmpty().withMessage('El nombre es requerido'),
    body('price').isNumeric().custom(value => value > 0).withMessage('El precio debe ser mayor a 0'),
    body('stock').optional().isInt({ min: 0 }).withMessage('El stock no puede ser negativo'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// GET all products
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM products');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST create product
router.post('/', validateProduct, audit('CREATE', 'products'), async (req, res) => {
    const { name, description, price, stock, image, is_featured } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO products (name, description, price, stock, image, is_featured) VALUES (?, ?, ?, ?, ?, ?)',
            [name, description, price, stock, image, is_featured || false]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT update product
router.put('/:id', validateProduct, audit('UPDATE', 'products'), async (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock, image, is_featured } = req.body;
    try {
        await db.query(
            'UPDATE products SET name = ?, description = ?, price = ?, stock = ?, image = ?, is_featured = ? WHERE id = ?',
            [name, description, price, stock, image, is_featured, id]
        );
        res.json({ message: 'Product updated', id, ...req.body });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE delete product
router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        // Fetch product name before deleting for audit logs
        const [products] = await db.query('SELECT name FROM products WHERE id = ?', [id]);
        req.body = req.body || {}; // Create body if it doesn't exist in DELETE request
        if (products.length > 0) {
            req.body.name = products[0].name;
        } else {
            req.body.name = `Eliminado (ID: ${id})`;
        }
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}, audit('DELETE', 'products'), async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM products WHERE id = ?', [id]);
        res.json({ message: 'Product deleted', id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
