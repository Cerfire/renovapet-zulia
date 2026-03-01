const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all audit logs
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT a.*, u.username
            FROM audit_logs a
            LEFT JOIN users u ON a.user_id = u.id
            ORDER BY a.timestamp DESC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /clear
router.delete('/clear', async (req, res) => {
    try {
        await db.query('TRUNCATE TABLE audit_logs');
        res.json({ message: 'Historial de bitácora eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
