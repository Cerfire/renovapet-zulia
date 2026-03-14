const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { body, validationResult } = require('express-validator');

const validationRules = [
    body('name').notEmpty().withMessage('El nombre es obligatorio').trim()
];

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM categories ORDER BY name ASC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error del servidor' });
    }
});

router.post('/', validationRules, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const [result] = await db.query('INSERT INTO categories (name, description) VALUES (?, ?)', [req.body.name, req.body.description || '']);
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
        if(error.code === 'ER_DUP_ENTRY') return res.status(400).json({ errors: [{msg: 'La categoría ya existe'}]});
        res.status(500).json({ error: 'Error del servidor' });
    }
});

router.put('/:id', validationRules, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const [result] = await db.query('UPDATE categories SET name = ?, description = ? WHERE id = ?', [req.body.name, req.body.description || '', req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'No encontrado' });
        res.json({ id: req.params.id, ...req.body });
    } catch (error) {
        if(error.code === 'ER_DUP_ENTRY') return res.status(400).json({ errors: [{msg: 'La categoría ya existe'}]});
        res.status(500).json({ error: 'Error del servidor' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'No encontrado' });
        res.json({ message: 'Eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error del servidor' });
    }
});

module.exports = router;
