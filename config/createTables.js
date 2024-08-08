const db = require("../utils/db");

const createTables = () => {
  const createProductsTable = `
    CREATE TABLE IF NOT EXISTS products (
      product_id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description VARCHAR(255) NOT NULL,
      unit_price DECIMAL(10, 2) NOT NULL,
      barcode VARCHAR(255) UNIQUE NOT NULL,
      images TEXT NOT NULL
    );
  `;

  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      user_id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL
    );
  `;

  const createSuppliersTable = `
    CREATE TABLE IF NOT EXISTS suppliers (
      user_id VARCHAR(255) PRIMARY KEY,
      SupplierCode INT AUTO_INCREMENT UNIQUE,
      SupplierDescription VARCHAR(255) NOT NULL,
      SupplierAddress VARCHAR(255) NOT NULL 
        );
    
  `;

  const createIteamTable = `
  CREATE TABLE IF NOT EXISTS iteamTabele (
  product_id VARCHAR(255) PRIMARY KEY,
    ItemCode VARCHAR(255) NOT NULL,
    ItemDescription VARCHAR(255) NOT NULL,    
     ItemSupplier VARCHAR(255) NOT NULL, 
    ItemUnit VARCHAR(255) NOT NULL,
    ItemTax DECIMAL(10, 2) NOT NULL,
    IteamDiscount DECIMAL(10, 2) NOT NULL,
    IteamPrice DECIMAL(10, 2) NOT NULL,
    Iteamstock DECIMAL(10, 2) NOT NULL,    
    FOREIGN KEY (ItemSupplier) REFERENCES suppliers(user_id)
   
  );
`;
// user_id VARCHAR(255),

const createCustomerTable = `
CREATE TABLE IF NOT EXISTS customerTabele (
  customer_id VARCHAR(255) PRIMARY KEY,
  customerName VARCHAR(255) NOT NULL,
customerContactNo VARCHAR(255) NOT NULL,
 customerTownCity VARCHAR(255) NOT NULL,
  customerPin VARCHAR(255) NOT NULL,
 customerGSTN VARCHAR(255) NOT NULL,
customerAddress VARCHAR(255) NOT NULL  
);
`;

const createInvoiceTable = `
CREATE TABLE IF NOT EXISTS Invoice (
invoice_id VARCHAR(255) PRIMARY KEY,
invoice_no VARCHAR(255) NOT NULL,
customer_id VARCHAR(255) NOT NULL,
product_id VARCHAR(255) NOT NULL,
product_actual_total DECIMAL(10, 2),
product_discounted_total DECIMAL(10, 2),
cartCount INT NOT NULL,
orderstatus VARCHAR(255) NOT NULL,
FOREIGN KEY (customer_id) REFERENCES customerTabele(customer_id),
 FOREIGN KEY (product_id) REFERENCES iteamTabele(product_id)
);
`;
// customerContactNo VARCHAR(255) NOT NULL,
//  customerTownCity VARCHAR(255) NOT NULL,
//   customerPin VARCHAR(255) NOT NULL,
//  customerGSTN VARCHAR(255) NOT NULL,
// customerAddress VARCHAR(255) NOT NULL  ,
   // Function to run the queries
   const runQuery = (query, successMessage, errorMessage, callback) => {
    db.query(query, (err, result) => {
      if (err) {
        console.error(errorMessage, err);
      } else {
        console.log(successMessage);
        if (callback) callback();
      }
    });
  };

  // Create tables and set AUTO_INCREMENT value
  runQuery(createProductsTable, "Products table created or already exists.", "Error creating products table.");
  runQuery(createSuppliersTable, "Suppliers table created or already exists.", "Error creating suppliers table.", () => {    runQuery(createUsersTable, "Users table created or already exists.", "Error creating users table.");
  runQuery(createIteamTable, "Iteam table created or already exists.", "Error creating iteam table.");
    runQuery(createCustomerTable, "Customer table created or already exists.", "Error creating Customer table.");
    runQuery(createInvoiceTable, "invoice table created or already exists.", "Error creating invoice table.");
  });
};

module.exports = createTables;

createTables();
