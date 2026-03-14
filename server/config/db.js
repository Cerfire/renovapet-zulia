const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Enforce loading .env specifically from the server/ directory
dotenv.config({ path: path.join(__dirname, '../.env') });

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'renovapet_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // Activa SSL inteligentemente solo cuando no estamos en localhost (requerido por Aiven)
    ssl: process.env.DB_HOST && process.env.DB_HOST !== 'localhost' ? { rejectUnauthorized: false } : false
});

module.exports = pool;