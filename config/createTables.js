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
  const createMasterTable = `
  CREATE TABLE IF NOT EXISTS mastertabele (
    master_id VARCHAR(255) PRIMARY KEY,
    entityName VARCHAR(255) NOT NULL,
    entityAddress VARCHAR(255) NOT NULL,
    tax VARCHAR(255) NOT NULL,
    discount VARCHAR(255) NOT NULL,
    itemTax TINYINT NOT NULL,
    itemDiscount TINYINT NOT NULL,
    visibility TINYINT DEFAULT 1
  );
`;
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      user_id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL ,
      employeeno VARCHAR(255) NOT NULL,
      employeecategory VARCHAR(255) NOT NULL,
      employeestatus VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      master_id VARCHAR(255),
      visibility TINYINT DEFAULT 1,
      FOREIGN KEY (master_id) REFERENCES mastertabele(master_id)
    );
  `;

  const createSuppliersTable = `
    CREATE TABLE IF NOT EXISTS suppliers (
      user_id VARCHAR(255) PRIMARY KEY,
      SupplierCode INT AUTO_INCREMENT UNIQUE,
      SupplierDescription VARCHAR(255) NOT NULL,
      SupplierAddress VARCHAR(255) NOT NULL ,
      visibility TINYINT DEFAULT 1,
     created_timestamp VARCHAR(255) DEFAULT NULL,
  created_by VARCHAR(255) DEFAULT 'unknown',
  updated_timestamp VARCHAR(255) DEFAULT NULL,
  updated_by VARCHAR(255) DEFAULT 'unknown',
  deleted_timestamp VARCHAR(255) DEFAULT NULL,
  deleted_by VARCHAR(255) DEFAULT 'unknown',
      master_id VARCHAR(255),
      FOREIGN KEY (master_id) REFERENCES mastertabele(master_id) 
        );    
  `;

  const addssuppliers = `
  ALTER TABLE suppliers
MODIFY COLUMN updated_timestamp  VARCHAR(255) DEFAULT NULL,
MODIFY COLUMN deleted_timestamp  VARCHAR(255) DEFAULT NULL;
  `;

  const createcategoryTable = `

    CREATE TABLE IF NOT EXISTS category (
      category_id VARCHAR(255) PRIMARY KEY,
      CategoryCode INT AUTO_INCREMENT UNIQUE,
      CategoryDescription VARCHAR(255) NOT NULL,
      visibility TINYINT DEFAULT 1,
     created_timestamp VARCHAR(255) NOT NULL,
  created_by VARCHAR(255) DEFAULT 'unknown',
  updated_timestamp VARCHAR(255) NOT NULL,
  updated_by VARCHAR(255) DEFAULT 'unknown',
  deleted_timestamp VARCHAR(255) NOT NULL,
  deleted_by VARCHAR(255) DEFAULT 'unknown',
        master_id VARCHAR(255),
    FOREIGN KEY (master_id) REFERENCES mastertabele(master_id)
        );
    
  `;
  const addUsersTableColumn = `
  ALTER TABLE category
MODIFY COLUMN updated_timestamp  VARCHAR(255) DEFAULT NULL,
MODIFY COLUMN deleted_timestamp  VARCHAR(255) DEFAULT NULL;
  `;
  const createIteamTable = `
  CREATE TABLE IF NOT EXISTS iteamtabele (
  product_id VARCHAR(255) PRIMARY KEY,
    ItemCode VARCHAR(255) NOT NULL,
    ItemDescription VARCHAR(255) NOT NULL,    
     ItemSupplier VARCHAR(255) NOT NULL,
     ItemCategory VARCHAR(255) NOT NULL,
    ItemUnit VARCHAR(255) NOT NULL,
    ItemTax DECIMAL(10, 2) NOT NULL,
    IteamDiscount DECIMAL(10, 2) NOT NULL,
    IteamPrice DECIMAL(10, 2) NOT NULL,
    Iteamstock DECIMAL(10, 2) NOT NULL,
    visibility TINYINT DEFAULT 1,
   created_timestamp VARCHAR(255) DEFAULT NULL,
  created_by VARCHAR(255) DEFAULT 'unknown',
  updated_timestamp VARCHAR(255) DEFAULT NULL,
  updated_by VARCHAR(255) DEFAULT 'unknown',
  deleted_timestamp VARCHAR(255) DEFAULT NULL,
  deleted_by VARCHAR(255) DEFAULT 'unknown',
        master_id VARCHAR(255),
    FOREIGN KEY (master_id) REFERENCES mastertabele(master_id),
    FOREIGN KEY (ItemSupplier) REFERENCES suppliers(user_id),
    FOREIGN KEY (ItemCategory) REFERENCES category(category_id)   
  );
`;
  // user_id VARCHAR(255),

  const createCustomerTable = `
CREATE TABLE IF NOT EXISTS customertabele (
  customer_id VARCHAR(255) PRIMARY KEY,
  customerName VARCHAR(255) NOT NULL,
customerContactNo VARCHAR(255) NOT NULL,
 customerTownCity VARCHAR(255) NOT NULL,
  customerPin VARCHAR(255) NOT NULL,
 customerGSTN VARCHAR(255) NOT NULL,
customerAddress VARCHAR(255) NOT NULL  ,
  master_id VARCHAR(255),
  visibility TINYINT DEFAULT 1,
    FOREIGN KEY (master_id) REFERENCES mastertabele(master_id)
);
`;

  const createInvoiceTable = `
  CREATE TABLE IF NOT EXISTS invoice (
    invoice_id VARCHAR(255) PRIMARY KEY,
    invoice_no VARCHAR(255) NOT NULL,
     invoice_date VARCHAR(255) NOT NULL,
    customer_id VARCHAR(255) NOT NULL,
    product_id VARCHAR(255) NOT NULL,
    product_actual_total DECIMAL(10, 2),
    product_discounted_total DECIMAL(10, 2),
    product_total DECIMAL(10, 2),    
    cartCount INT NOT NULL,
    paymentmethod VARCHAR(255) NOT NULL,
    orderstatus VARCHAR(255) NOT NULL,
    employee_id VARCHAR(255) NOT NULL,
   created_timestamp VARCHAR(255) DEFAULT NULL,
  created_by VARCHAR(255) DEFAULT 'unknown',
  updated_timestamp VARCHAR(255) DEFAULT NULL,
  updated_by VARCHAR(255) DEFAULT 'unknown',
  deleted_timestamp VARCHAR(255) DEFAULT NULL,
  deleted_by VARCHAR(255) DEFAULT 'unknown',
        master_id VARCHAR(255),
        visibility TINYINT DEFAULT 1,
tax DECIMAL(10, 2) DEFAULT NULL,
 totalWithTax DECIMAL(10, 2) DEFAULT NULL,
 roundAmount DECIMAL(10, 2) DEFAULT NULL,
    FOREIGN KEY (master_id) REFERENCES mastertabele(master_id),
    FOREIGN KEY (customer_id) REFERENCES customertabele(customer_id),
    FOREIGN KEY (product_id) REFERENCES iteamtabele(product_id),
    FOREIGN KEY (employee_id) REFERENCES users(user_id)
  );
  `;

  const additeamtabele = `
  ALTER TABLE iteamtabele
MODIFY COLUMN updated_timestamp  VARCHAR(255) DEFAULT NULL,
MODIFY COLUMN deleted_timestamp  VARCHAR(255) DEFAULT NULL;
  `;
  const addinvoicetaxroundamount = `

ALTER TABLE invoice
MODIFY COLUMN tax DECIMAL(10, 2) DEFAULT NULL,
MODIFY COLUMN totalWithTax DECIMAL(10, 2) DEFAULT NULL,
MODIFY COLUMN roundAmount DECIMAL(10, 2) DEFAULT NULL;
  `;

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
  runQuery(
    createProductsTable,
    "Products table created or already exists.",
    "Error creating products table."
  );
  runQuery(createMasterTable, "create MasterTable");
  runQuery(
    createSuppliersTable,
    "Suppliers table created or already exists.",
    "Error creating suppliers table.",
    () => {
      runQuery(
        createUsersTable,
        "Users table created or already exists.",
        "Error creating users table."
      );
      runQuery(
        createIteamTable,
        "Iteam table created or already exists.",
        "Error creating iteam table."
      );
      runQuery(
        createCustomerTable,
        "Customer table created or already exists.",
        "Error creating Customer table."
      );

      runQuery(createcategoryTable, "create category");

      runQuery(additeamtabele, "additeamtabele");
      runQuery(addssuppliers, "addssuppliers");
      runQuery(addUsersTableColumn, "usermastervisiblity");
      runQuery(
        createInvoiceTable,
        "invoice table created or already exists.",
        "Error creating invoice table."
      );
      runQuery(addinvoicetaxroundamount, "add in invoice tabe");
    }
  );
};

module.exports = createTables;

createTables();
