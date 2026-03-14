require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function testUsers() {
    console.log('--- TEST DE INTEGRIDAD DE USUARIOS ---');
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306,
        });

        const [users] = await pool.query('SELECT id, username, role, password_hash FROM users');
        console.log(`\nUsuarios en la base de datos: ${users.length} (Mínimo exigido: 5)`);
        
        let allValid = true;
        for (const user of users) {
            const isMatch = await bcrypt.compare('1234', user.password_hash);
            console.log(`- Usuario: ${user.username.padEnd(12)} | Rol: ${user.role.padEnd(8)} | Pass '1234' válida: ${isMatch ? 'SÍ ✅' : 'NO ❌'}`);
            if (!isMatch) allValid = false;
        }

        if (users.length >= 5 && allValid) {
            console.log('\n✅ ESTADO: IMPECABLE Y PERFECTO. Cumple reglas del Módulo 3.');
        } else {
            console.log('\n❌ ESTADO: FALLO EN INTEGRIDAD.');
        }

        await pool.end();
    } catch (error) {
        console.error('Error de conexión:', error.message);
    }
}

testUsers();
