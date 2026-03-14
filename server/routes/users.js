const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

// Validation Rules
const userValidationRules = [
    body('username').notEmpty().withMessage('El nombre de usuario es obligatorio').trim().escape(),
    body('role').isIn(['Gerente', 'Vendedor']).withMessage('El rol debe ser Gerente o Vendedor')
];

// GET all users
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, username, role, avatar FROM users');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// GET single user
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, username, role, avatar FROM users WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// POST new user
router.post('/', userValidationRules, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, role } = req.body;
    let { avatar } = req.body;

    if (!password) {
        return res.status(400).json({ errors: [{ msg: 'La contraseña es obligatoria para nuevos usuarios' }] });
    }

    if (!avatar) {
        avatar = `https://ui-avatars.com/api/?name=${username}&background=random`;
    }

    try {
        const password_hash = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            'INSERT INTO users (username, password_hash, role, avatar) VALUES (?, ?, ?, ?)',
            [username, password_hash, role, avatar]
        );
        res.status(201).json({ id: result.insertId, username, role, avatar });
    } catch (error) {
        console.error('Error creating user:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ errors: [{ msg: 'El nombre de usuario ya existe' }] });
        }
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// PUT update user
router.put('/:id', userValidationRules, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, role, avatar, password } = req.body;

    try {
        let query = 'UPDATE users SET username = ?, role = ?, avatar = ? WHERE id = ?';
        let values = [username, role, avatar, req.params.id];

        if (password && password.trim() !== '') {
            const password_hash = await bcrypt.hash(password, 10);
            query = 'UPDATE users SET username = ?, role = ?, avatar = ?, password_hash = ? WHERE id = ?';
            values = [username, role, avatar, password_hash, req.params.id];
        }

        const [result] = await db.query(query, values);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        
        res.json({ id: req.params.id, username, role, avatar });
    } catch (error) {
        console.error('Error updating user:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ errors: [{ msg: 'El nombre de usuario ya existe' }] });
        }
        res.status(500).json({ error: 'Error del servidor' });
    }
});

// DELETE user
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json({ message: 'Usuario eliminado' });
    } catch (error) {
        console.error('Error deleting user:', error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
             return res.status(400).json({ error: 'No se puede eliminar un usuario que tiene registros asociados.' });
        }
        res.status(500).json({ error: 'Error del servidor' });
    }
});

module.exports = router;
