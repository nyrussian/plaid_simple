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

async function fetchBanks() {
  const query = 'SELECT * FROM banks';
  const [row] = await pool.query(query);
  return row;
}

function generateCreditCardSQL(data) {
    // // Iterate through each account
    // data.accounts.forEach(account => {
    //   if (account.subtype === "credit card") {
    //     // Create an SQL query for the credit card account
    //     const sql = `INSERT INTO accounts (account_id, account_name, statement_bal, credit_limit) VALUES 
    //     ('${account.account_id}', '${account.name}', ${account.balances.current}, ${account.balances.limit});`;
    //     console.log(sql);
    //     // You can execute the SQL here using your database library, or collect these queries to execute later
    //   }
    // });
    return data//temp to ignore function
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
    generateCreditCardSQL,
    storeAccessToken,
    fetchBanks,
    getAccessTokenFromDB
};
