const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET Dashboard Stats
router.get('/', async (req, res) => {
    try {
        const today = new Date().toISOString().slice(0, 10);

        // 1. Daily Sales
        const [salesRows] = await db.query(`
            SELECT SUM(total) as total 
            FROM orders 
            WHERE DATE(created_at) = ?
        `, [today]);
        const dailySales = salesRows[0].total || 0;

        // 2. Items Sold (Today/Total? Let's do Total for now or Today)
        // User asked for "Artículos vendidos" matching the UI. Let's do Monthly/Total implied?
        // Let's do Total Items Sold Ever for simplicity, or Today if strict.
        // The mock said "48 u." which implies a running count. Let's do Weekly or Total.
        // Let's stick to Today for consistency with "Ventas del Día", or Total for "Items Vendidos".
        // Let's do Total items sold in confirmed orders to be safe.
        const [itemsRows] = await db.query(`
            SELECT SUM(quantity) as total 
            FROM order_items
        `);
        const itemsSold = itemsRows[0].total || 0;

        // 3. Inventory Value (Stock * Price)
        const [stockRows] = await db.query(`
            SELECT SUM(price * stock) as value 
            FROM products
        `);
        const inventoryValue = stockRows[0].value || 0;

        // 4. Sales Chart (Last 7 Days)
        const [chartRows] = await db.query(`
            SELECT DATE(created_at) as date, SUM(total) as sales
            FROM orders
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        `);

        // Format for Recharts (Lun, Mar, etc)
        const daysMap = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        const chartData = chartRows.map(row => {
            const d = new Date(row.date);
            return {
                name: daysMap[d.getDay()],
                ventas: Number(row.sales)
            };
        });

        // 5. Recent Activity (Last 5 Orders)
        const [activityRows] = await db.query(`
            SELECT o.id, o.client_name, o.total, o.created_at
            FROM orders o
            ORDER BY o.created_at DESC
            LIMIT 5
        `);

        res.json({
            dailySales,
            itemsSold,
            inventoryValue,
            chartData,
            recentActivity: activityRows
        });

    } catch (error) {
        console.error('Dashboard Error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
