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

//   db.query(createProductsTable, (err, result) => {
//     if (err) {
//       console.error("Error creating products table:", err);
//       return;
//     }
//     console.log("Products table created or already exists.");
//     // Properly close the connection if you need to
//     db.getConnection().end((err) => {
//       if (err) {
//         console.error("Error closing the database connection:", err);
//       } else {
//         console.log("Database connection closed.");
//       }
//     });
//   });
  // };
  db.query(createProductsTable, (err, result) => {
    if (err) {
      console.error("Error creating products table:", err);
      return;
    }
    console.log("Products table created or already exists.");

    db.query(createUsersTable, (err, result) => {
      if (err) {
        console.error("Error creating users table:", err);
        return;
      }
      console.log("Users table created or already exists.");

      // Properly close the connection if you need to
      db.getConnection().end((err) => {
        if (err) {
          console.error("Error closing the database connection:", err);
        } else {
          console.log("Database connection closed.");
        }
      });
    });
  });
};

// createTables();

createTables();


