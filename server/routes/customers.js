const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { body, validationResult } = require('express-validator');

const validationRules = [
    body('first_name').notEmpty().withMessage('El nombre es obligatorio').trim(),
    body('last_name').notEmpty().withMessage('El apellido es obligatorio').trim()
];

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM customers ORDER BY first_name ASC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error del servidor' });
    }
});

router.post('/', validationRules, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { first_name, last_name, phone, email, address } = req.body;
        const [result] = await db.query('INSERT INTO customers (first_name, last_name, phone, email, address) VALUES (?, ?, ?, ?, ?)', [first_name, last_name, phone, email, address]);
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
        if(error.code === 'ER_DUP_ENTRY') return res.status(400).json({ errors: [{msg: 'El email ya está registrado'}]});
        res.status(500).json({ error: 'Error del servidor' });
    }
});

router.put('/:id', validationRules, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { first_name, last_name, phone, email, address } = req.body;
        const [result] = await db.query('UPDATE customers SET first_name = ?, last_name = ?, phone = ?, email = ?, address = ? WHERE id = ?', [first_name, last_name, phone, email, address, req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'No encontrado' });
        res.json({ id: req.params.id, ...req.body });
    } catch (error) {
        if(error.code === 'ER_DUP_ENTRY') return res.status(400).json({ errors: [{msg: 'El email ya está registrado'}]});
        res.status(500).json({ error: 'Error del servidor' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM customers WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'No encontrado' });
        res.json({ message: 'Eliminado correctamente' });
    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
             return res.status(400).json({ error: 'No se puede eliminar un cliente que tiene historial de facturación.' });
        }
        res.status(500).json({ error: 'Error del servidor' });
    }
});

module.exports = router;
