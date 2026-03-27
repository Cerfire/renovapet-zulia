const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({ origin: '*' })); // Allow all origins for development and vercel

app.get('/api/test', (req, res) => {
    res.json({ message: "Backend conectado" });
});


// Debug endpoint
app.get('/api/health', (req, res) => {
    console.log('Health check request received from:', req.ip);
    res.json({ status: 'ok', time: new Date().toISOString() });
});

// Routes
const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const auditRoutes = require('./routes/audit');
const usersRoutes = require('./routes/users');
const categoriesRoutes = require('./routes/categories');
const suppliersRoutes = require('./routes/suppliers');
const customersRoutes = require('./routes/customers');
const authMiddleware = require('./middleware/authMiddleware');

// Public routes (no JWT required)
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes); // GET is public for /tienda storefront; POST/PUT/DELETE are protected inside the router

// Protected routes (JWT required)
app.use('/api/orders', authMiddleware, ordersRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);
app.use('/api/audit', authMiddleware, auditRoutes);
app.use('/api/users', authMiddleware, usersRoutes);
app.use('/api/categories', authMiddleware, categoriesRoutes);
app.use('/api/suppliers', authMiddleware, suppliersRoutes);
app.use('/api/customers', authMiddleware, customersRoutes);

// Admin: Reset Data Endpoint (protected)
app.delete('/api/admin/reset', authMiddleware, async (req, res) => {
    const db = require('./config/db');
    const { type } = req.body;

    try {
        // Disable foreign key checks to truncate freely
        await db.query('SET FOREIGN_KEY_CHECKS = 0');

        if (type === 'orders') {
            await db.query('TRUNCATE TABLE order_items');
            await db.query('TRUNCATE TABLE orders');
            console.log('Database reset by admin (Orders only)');
        } else if (type === 'audit') {
            await db.query('TRUNCATE TABLE audit_logs');
            console.log('Database reset by admin (Audit only)');
        } else if (type === 'all') {
            await db.query('TRUNCATE TABLE order_items');
            await db.query('TRUNCATE TABLE orders');
            await db.query('TRUNCATE TABLE audit_logs');
            console.log('Database reset by admin (Factory Reset - preserving products and users)');
        } else {
            await db.query('SET FOREIGN_KEY_CHECKS = 1');
            return res.status(400).json({ error: 'Tipo de limpieza inválido' });
        }

        await db.query('SET FOREIGN_KEY_CHECKS = 1');
        res.json({ message: 'Sistema reiniciado: Datos eliminados correctamente según la opción seleccionada.' });
    } catch (error) {
        console.error('Reset error:', error);
        res.status(500).json({ error: 'Error al reiniciar el sistema' });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app; // Export for Vercel serverless functions
