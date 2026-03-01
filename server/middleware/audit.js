const db = require('../config/db');

const audit = (action, table_affected) => {
    return async (req, res, next) => {
        // Try to capture userId from various sources
        // 1. req.user.id (if explicitly set by auth middleware)
        // 2. req.body.user_id (sent by frontend)
        // 3. req.headers['x-user-id'] (custom header fallback)
        let userId = null;

        if (req.user && req.user.id) {
            userId = req.user.id;
        } else if (req.body && req.body.user_id) {
            userId = req.body.user_id;
        } else if (req.headers && req.headers['x-user-id']) {
            userId = req.headers['x-user-id'];
        }

        let details = '';
        if (table_affected === 'products') {
            const productName = req.body.name || req.params.id;
            details = `${action === 'CREATE' ? 'Creado' : action === 'UPDATE' ? 'Actualizado' : 'Eliminado'} producto: ${productName}`;
        } else if (table_affected === 'orders') {
            const clientName = req.body.client_name || req.params.id;
            details = `${action === 'CREATE' ? 'Nueva orden creada para' : action === 'UPDATE' ? 'Actualizada orden de' : action === 'DISPATCH' ? 'Despachada orden de' : 'Acción en orden'} ${clientName}`;
        } else {
            details = `${action} en tabla ${table_affected}`;
        }

        // Log asynchronously to avoid blocking the response
        try {
            await db.query(
                `INSERT INTO audit_logs (user_id, action, table_affected, details) VALUES (?, ?, ?, ?)`,
                [userId, action, table_affected, details]
            );
        } catch (error) {
            console.error('Audit Log Error:', error);
        }

        next();
    };
};

module.exports = audit;
