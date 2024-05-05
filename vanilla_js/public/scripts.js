 (async ($) => {
        // Grab a Link token to initialize Link
        const createLinkToken = async () => {
          const res = await fetch("/api/create_link_token");
          const data = await res.json();
          const linkToken = data.link_token;
          localStorage.setItem("link_token", linkToken);
          return linkToken;
        };

        // Initialize Link
        const handler = Plaid.create({
          token: await createLinkToken(),
          onSuccess: async (publicToken, metadata) => {
            await fetch("/api/exchange_public_token", {
              method: "POST",
              body: JSON.stringify({ public_token: publicToken }),
              headers: {
                "Content-Type": "application/json",
              },
            });
            // await getProducts();
          },
          onEvent: (eventName, metadata) => {
            console.log("Event:", eventName);
            console.log("Metadata:", metadata);
          },
          onExit: (error, metadata) => {
            console.log(error, metadata);
          },
        });

        // Start Link when button is clicked
        const linkAccountButton = document.getElementById("link-account");
        linkAccountButton.addEventListener("click", (event) => {
          handler.open();
        });
      })(jQuery);

      // Retrieves balance and liability information
      const getProducts = async function () {
        const response = await fetch("/api/balance", {
          method: "GET",
        });

        const data = await response.json();
        const liabilities_response = await fetch("/api/liabilities", {
          method: "GET",
        });
        const liabilities_data = await liabilities_response.json();

        const combined_data = {
          ...data,
          liabilities: liabilities_data,
        };

        //Render response data
        const pre = document.getElementById("response");
        pre.textContent = JSON.stringify(combined_data, null, 2);
        pre.style.background = "#F6F6F6";
      };


      // Check whether account is connected
      const getStatus = async function () {
        const account = await fetch("/api/is_account_connected");
        const connected = await account.json();
        if (connected.status == true) {
          getProducts();
        }
      };

      getStatus();






      
    function addTestRow() {
        // Function to add an account
        const table = document.getElementById('accountsTable').getElementsByTagName('tbody')[0];
        const newRow = table.insertRow(table.rows.length);

        for (let i = 0; i < 9; i++) {
            let newCell = newRow.insertCell(i);
            newCell.innerHTML = 'New data'; // Placeholder, replace with actual data
        }
        
        let refreshCell = newRow.insertCell(8);
        refreshCell.innerHTML = '<button onclick="refreshRow(this)">Refresh</button> <button onclick="deleteRow(this)">Delete</button>';
    }
//update table from database
function updateBanksTable(banks) {
    const tableBody = document.getElementById('banksTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear existing table rows

    banks.forEach(bank => {
        const row = tableBody.insertRow();
        const id = row.insertCell(0);
        const user = row.insertCell(1);
        const item_id = row.insertCell(2);
        const bank_name = row.insertCell(3);
        const token = row.insertCell(4);
        const action  = row.insertCell(5);

        id.textContent = bank.id;
        user.textContent = bank.user_id;
        item_id.textContent = bank.item_id;
        bank_name.textContent = bank.bank_name;
        token.textContent = bank.access_token;
        action.innerHTML = '<button onclick="getBankRowID(this)">Fetch Liabilities</button> <button onclick="refreshRow(this)">Refresh</button> <button onclick="deleteRow(this)">Delete</button> ';


        
    });
}
//get bank row id form first colomn will have to update when hiding id
function getBankRowID(button) {
  let row = button.parentNode.parentNode;
  let rowId = row.cells[0].textContent; // Assuming the ID is in the first cell of the row
  // Call your function with the row ID
  fetchLiabilities(rowId);
}
function updateAccountsTable(accounts) {
    const tableBody = document.getElementById('accountsTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear existing table rows

    accounts.forEach(account => {
        const row = tableBody.insertRow();
        const id = row.insertCell(0);
        const user = row.insertCell(1);
        const account_name = row.insertCell(2);
        const account_number = row.insertCell(3);
        const total_bal = row.insertCell(4);
        const credit_limit = row.insertCell(5);
        const interest_rate = row.insertCell(6);
        const last_payment_date = row.insertCell(7);
        const last_payment_amount = row.insertCell(8);
        const next_payment_due = row.insertCell(9);
        const due_date = row.insertCell(10);
        const pay_date = row.insertCell(11);
        const statement_balance = row.insertCell(12);
        const account_type = row.insertCell(13);
        const buisness_account = row.insertCell(14);
        const action  = row.insertCell(15);

        id.textContent = account.id;
        user.textContent = account.user_id;
        account_name.textContent = account.account_name;
        account_number.textContent = account.account_number;
        total_bal.textContent = account.total_bal;
        credit_limit.textContent = account.credit_limit;
        interest_rate.textContent = account.rate;
        last_payment_date.textContent = account.last_payment_date;
        last_payment_amount.textContent = account.last_payment_amount;
        next_payment_due.textContent = account.due_date;
        due_date.textContent = account.due_date;
        pay_date.textContent = account.pay_date;
        statement_balance.textContent = account.statement_bal;
        account_type.textContent = account.type;
        buisness_account.textContent = account.bank; 
        action.innerHTML = '<button onclick="refreshRow(this)">Refresh</button> <button onclick="deleteRow(this)">Delete</button>';


        
    });
}


    function refreshRow(button) {
        // Function to refresh a row
        alert("Refresh row " + button.parentNode.parentNode.rowIndex);
    }

    function deleteRow(button) {
        // Function to delete a row
        let row = button.parentNode.parentNode;
        let table = row.parentNode.parentNode;
        table.deleteRow(row.rowIndex);
    }
    // async function fetchFromDb() {
    //   const response = await fetch("/api/accountData", {
    //     method: "GET",
    //   });
    //   const data = await response.json();
    //   return data;
    // }

 
// Correct assignment for the event listeners
const fetchAccountsButton = document.getElementById("fetch_accounts");
fetchAccountsButton.addEventListener("click", fetchAccounts);

const fetchBanksButton = document.getElementById("fetch_banks");
fetchBanksButton.addEventListener("click", fetchBanks);

const fetchLiabilitiesButton = document.getElementById("fetch_liabilities");
fetchLiabilitiesButton.addEventListener("click", testFunction);


    async function fetchBanks() {
      try {
        const response = await fetch('/api/bankData');
        const data = await response.json();
        
      updateBanksTable(data);
        // const dbDataElement = document.getElementById("db_data");
        // dbDataElement.innerHTML = JSON.stringify(data);
      } catch (error) {
        console.error(error);
      }
    }
    
    async function fetchAccounts() {
      try {
        const response = await fetch('/api/accountData');
        const data = await response.json();
        
      updateAccountsTable(data);
        // const dbDataElement = document.getElementById("db_data");
        // dbDataElement.innerHTML = JSON.stringify(data);
      } catch (error) {
        console.error(error);
      }
    }

    
    async function fetchLiabilities(banks_id) {
      try {
        // Send the bank ID via the POST body
        const response = await fetch('/api/liabilities', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ banks_id })
        });
        const data = await response.json();
        const dbDataElement = document.getElementById("db_data");
        dbDataElement.innerHTML = JSON.stringify(data, null, 2);

        console.log(data);
      } catch (error) {
        console.error('Error fetching liabilities:', error);
      }
    }
    
    

    
   function testFunction() {
     alert("Test Successful");
   }