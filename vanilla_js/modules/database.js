require('dotenv').config();
const mysql = require('mysql2/promise');
const controller = require('../controllers/controller');

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
exports.pool = pool;

async function fetchAccounts() {
    const query = 'SELECT * FROM accounts';
    const [row] = await pool.query(query);
    return row;
}

async function fetchBanks() {
  const query = 'SELECT * FROM banks';
  const [row] = await pool.query(query);
  return row;
}

// Function to check if an account exists
async function accountExists(accountId) {
    const query = 'SELECT COUNT(*) AS count FROM accounts WHERE account_id = ?';
    const [rows] = await pool.query(query, [accountId]);
    return rows[0].count > 0;
}
///
async function getAccountById(account_id) {
    const query = 'SELECT * FROM accounts WHERE account_id = ?';
    const [rows] = await pool.execute(query, [account_id]);
    return rows.length > 0 ? rows[0] : null;
}


async function updateAccount(account) {
    const query = `
        UPDATE accounts
        SET account_name = ?, statement_bal = ?, credit_limit = ?
        WHERE account_id = ?`;
    await pool.execute(query, [account.name, account.balances.current, account.balances.limit, account.account_id]);
}
async function insertAccount(account) {
    const query = `
        INSERT INTO accounts (account_id, account_name, statement_bal, credit_limit)
        VALUES (?, ?, ?, ?)`;
    await pool.execute(query, [account.account_id, account.name, account.balances.current, account.balances.limit]);
}

async function storeAccessToken(ACCESS_TOKEN, ITEM_ID, BANK_NAME) {
  const query = 'INSERT INTO banks (access_token, item_id, bank_name) VALUES (?, ?, ?)';
  try {
      // Execute the query with the parameters
      const [result] = await pool.query(query, [ACCESS_TOKEN, ITEM_ID, BANK_NAME]);
      console.log("Record inserted, ID:", result.insertId);
  } catch (error) {
      console.error("Error inserting record:", error.message);
  }
}



async function getAccessTokenFromDB(banksId) {
    // Replace with your database query logic
    const query = 'SELECT * FROM banks WHERE id = ?';
    const [rows] = await pool.query(query, [banksId]);
    if (rows.length === 0) {
      throw new Error('No access token found for this user');
    }
    return rows[0].access_token;
} 
  











module.exports = {
    fetchAccounts,
    // generateCreditCardSQL,
    storeAccessToken,
    fetchBanks,
    getAccessTokenFromDB,
    accountExists,
    insertAccount,
    updateAccount,
    getAccountById
   
};
