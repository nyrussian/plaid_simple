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

function generateCreditCardSQL(data) {
    // Iterate through each account
    data.accounts.forEach(account => {
      if (account.subtype === "credit card") {
        // Create an SQL query for the credit card account
        const sql = `INSERT INTO credit_cards (account_id, account_name, statement_bal, credit_limit) VALUES 
        ('${account.account_id}', '${account.name}', ${account.balances.current}, ${account.balances.limit});`;
        console.log(sql);
        // You can execute the SQL here using your database library, or collect these queries to execute later
      }
    });
}












module.exports = {
    fetchAccounts,
    generateCreditCardSQL
};
