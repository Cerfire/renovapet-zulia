const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');

// POST /login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

        // Fallback for testing/demo: Always allow '1234' for admin/vendedor
        const isFallback = (username === 'admin' || username === 'vendedor') && password === '1234';

        if (users.length === 0) {
            if (isFallback) {
                // Return mock user for fallback if DB is empty/user missing
                return res.json({
                    id: username === 'admin' ? 1 : 2,
                    username: username,
                    role: username === 'admin' ? 'Gerente' : 'Vendedor',
                    avatar: `https://ui-avatars.com/api/?name=${username}&background=random`
                });
            }
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword && !isFallback) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Return user info without password
        const { password_hash, ...userInfo } = user;

        // In a real app, we would generate a token here.
        // For now, we return the user info for the frontend to store.
        res.json(userInfo);

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

module.exports = router;
