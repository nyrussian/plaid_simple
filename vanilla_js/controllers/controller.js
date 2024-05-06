const database = require('../modules/database');


//FIXME: not working supposed to loop through data and populate credit card info into database. 
//might just put info directly into table from api then I won' tneed this or helper functions 
async function generateCreditCardSQL(data) {
    // Process each account in the `accounts` section of the JSON
    for (const account of data.liabilities.accounts) {
        if (account.subtype === "credit card") {
            const existingAccount = await database.getAccountById(account.account_id);

            if (existingAccount) {
                // Update the existing account
                await database.updateAccount(account);
                console.log(`Updated account: ${account.account_id}`);
            } else {
                // Insert the new credit card account
                await database.insertAccount(account);
                console.log(`Inserted new account: ${account.account_id}`);
            }
        }
    }
}



async function generateCreditCardSQL(data) {
   const accounts = data.data.accounts
    const credits = data.data.liabilities.credit
    
    for (const credit of credits) {




    
        


    }
 

   
    // Iterate through the accounts
    for (const account of accounts) {
        if (account.subtype === "credit card") {
            // Find the matching credit liability by account_id
            const liability = liabilities.find(liab => liab.account_id === account.account_id);

            // Check if the account already exists in the database
            const existingAccount = await database.getAccountById(account.account_id);

            if (existingAccount) {
                // Update the existing account with relevant information
                await database.updateAccount({
                    account_id: account.account_id,
                    account_name: account.name,
                    balances: account.balances,
                    liability_info: liability || {}, // Optional liability information
                });
                console.log(`Updated account: ${account.account_id}`);
            } else {
                // Insert the new credit card account with liability information
                await database.insertAccount({
                    account_id: account.account_id,
                    account_name: account.name,
                    balances: account.balances,
                    liability_info: liability || {}, // Optional liability information
                });
                console.log(`Inserted new account: ${account.account_id}`);
            }
        }
    }
}


module.exports = {
    generateCreditCardSQL
};



