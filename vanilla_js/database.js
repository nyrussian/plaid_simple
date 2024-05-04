require('dotenv').config();
const mysql = require('mysql2/promise');

// MySQL connection setup
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'finances',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function fetchAccounts() {
    const query = 'SELECT * FROM accounts';
    const [row] = await pool.query(query);
    return row;
}

module.exports = {
    fetchAccounts
};
