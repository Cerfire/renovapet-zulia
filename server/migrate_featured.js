const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const db = require('./config/db');

async function migrate() {
    try {
        console.log('Running migration: Add is_featured to products...');
        await db.query(`
            ALTER TABLE products
            ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;
        `);
        console.log('Migration successful!');
        process.exit(0);
    } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log('Column is_featured already exists. Skipping.');
            process.exit(0);
        } else {
            console.error('Migration failed:', error);
            process.exit(1);
        }
    }
}

migrate();
