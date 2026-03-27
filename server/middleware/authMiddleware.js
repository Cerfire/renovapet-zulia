const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'renovapet_dev_fallback_secret_2026';

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // { id, username, role, iat, exp }
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Sesión expirada. Por favor, inicie sesión nuevamente.' });
        }
        return res.status(401).json({ error: 'Token inválido.' });
    }
};

module.exports = authMiddleware;
