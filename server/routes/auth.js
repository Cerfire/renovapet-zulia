const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'renovapet_dev_fallback_secret_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

// POST /login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

        if (users.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const user = users[0];

        if (user.is_active === 0) {
            return res.status(403).json({ error: 'Usuario suspendido. Contacte al administrador.' });
        }

        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Return user info without password
        const { password_hash, ...userInfo } = user;

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.json({ token, user: userInfo });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

module.exports = router;
