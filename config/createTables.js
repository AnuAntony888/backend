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
      SupplierDescription VARCHAR(255) NOT NULL,
      SupplierAddress VARCHAR(255) NOT NULL
    );
  `;
  const createIteamTable = `
  CREATE TABLE IF NOT EXISTS iteamTabele (
    user_id VARCHAR(255) PRIMARY KEY,
     ItemCode VARCHAR(255) NOT NULL,
    ItemDescription VARCHAR(255) NOT NULL,
     ItemSupplier VARCHAR(255) NOT NULL,
      ItemUnit VARCHAR(255) NOT NULL,
        ItemTax VARCHAR(255) NOT NULL,
        IteamDiscount VARCHAR(255) NOT NULL,
              IteamPrice VARCHAR(255) NOT NULL
    
  );
`;

  db.query(createProductsTable, (err, result) => {
    if (err) {
      console.error("Error creating products table:", err);
      return;
    }
    console.log("Products table created or already exists.");

    db.query(createSuppliersTable, (err, result) => {
      if (err) {
        console.error("Error creating suppliers table:", err);
        return;
      }
      console.log("Suppliers table created or already exists.");

      db.query(createUsersTable, (err, result) => {
        if (err) {
          console.error("Error creating users table:", err);
          return;
        }
        console.log("Users table created or already exists.");
        db.query(createIteamTable, (err, result) => {
          if (err) {
            console.error("Error creating users table:", err);
            return;
          }
          console.log("Users table created or already exists.");
        })
        
      });
    });
  });
};

module.exports = createTables;

createTables();
