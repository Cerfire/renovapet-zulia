const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function runMigration() {
    try {
        console.log('Connecting to Aiven DB...');
        console.log('DB Host:', process.env.DB_HOST);
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD || process.env.DB_PASS || '',
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306,
            ssl: process.env.DB_HOST && process.env.DB_HOST !== 'localhost' ? { rejectUnauthorized: false } : false
        });
        
        console.log('Checking if is_active exists...');
        const [columns] = await connection.query(`SHOW COLUMNS FROM users LIKE 'is_active'`);
        if (columns.length === 0) {
            console.log('Adding is_active column...');
            await connection.query('ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT TRUE;');
            console.log('Column added successfully!');
        } else {
            console.log('is_active column already exists. No changes needed.');
        }
        
        await connection.end();
        console.log('Migration complete.');
    } catch (e) {
        console.error('Migration failed:', e.message);
    }
}

runMigration();
