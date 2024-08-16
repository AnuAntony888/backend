const { v4: uuidv4 } = require("uuid");
const db = require("../utils/db");



exports.createinvoice = async (req, res) => {
  try {
    const {
      invoice_no,
      invoice_date,
      customer_id,
      product_id,
      
      paymentmethod,
      product_actual_total,
      product_discounted_total,
      product_total,
      cartCount,
      orderstatus,
      employee_id,
    } = req.body;

    // Ensure required fields are present
    if (
      !invoice_no ||
      !invoice_date ||
      !customer_id ||
      !product_id ||
      !product_actual_total ||
      !product_discounted_total ||
      !product_total ||
      !cartCount ||
      !orderstatus ||
      !paymentmethod ||
      !employee_id
    ) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided" });
    }

    // Parse JSON fields
    const productIdsArray = JSON.parse(product_id);
    const cartCountsArray = JSON.parse(cartCount);


    // Validate lengths of arrays
    if (
      productIdsArray.length !== cartCountsArray.length
      
    ) {
      return res
        .status(400)
        .json({
          error: "Mismatch in array lengths for products and their details",
        });
    }

    // Check if invoice_no already exists
    const checkInvoiceSql = `SELECT * FROM Invoice WHERE invoice_no = ?`;
    const existingInvoice = await new Promise((resolve, reject) => {
      db.query(checkInvoiceSql, [invoice_no], (err, result) => {
        if (err) {
          console.error("Error:", err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    if (existingInvoice.length > 0) {
      // Invoice exists, update the records
      const updateSql = `
        UPDATE Invoice SET
          invoice_date = ?,
          customer_id = ?,
          product_id = ?, 
          product_actual_total = ?,
          product_discounted_total = ?,
          product_total = ?,
          cartCount = ?,
          orderstatus = ?,
          paymentmethod = ?,
          employee_id = ?
        WHERE invoice_no = ?
          AND product_id = ?`;
      
      for (let i = 0; i < productIdsArray.length; i++) {
        const updateValues = [
          invoice_date,
          customer_id,
          productIdsArray[i],      
          product_actual_total,
          product_discounted_total,
          product_total,
          cartCountsArray[i],
          orderstatus,
          paymentmethod,
          employee_id,
          invoice_no,
           productIdsArray[i],
        ];

        await new Promise((resolve, reject) => {
          db.query(updateSql, updateValues, (err, result) => {
            if (err) {
              console.error("Error:", err);
              reject(err);
            } else {
              resolve(result);
            }
          });
        });
      }

      res.status(200).json({ message: "Invoice updated successfully" });
    } else {
      // Invoice does not exist, insert new records
      const insertSql = `
        INSERT INTO Invoice (
          invoice_id,
          invoice_no,
          invoice_date,
          customer_id,
          product_id,         
          product_actual_total,
          product_discounted_total,
          product_total,
          cartCount,
          orderstatus,
          paymentmethod,
          employee_id
        )
        VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;

      for (let i = 0; i < productIdsArray.length; i++) {
        const insertValues = [
          uuidv4(), // Generate a new UUID for invoice_id
          invoice_no,
          invoice_date,
          customer_id,
          productIdsArray[i],

          product_actual_total,
          product_discounted_total,
          product_total,
          cartCountsArray[i],
          orderstatus,
          paymentmethod,
          employee_id,
        ];

        await new Promise((resolve, reject) => {
          db.query(insertSql, insertValues, (err, result) => {
            if (err) {
              console.error("Error:", err);
              reject(err);
            } else {
              resolve(result);
            }
          });
        });
      }

      res.status(201).json({ message: "Invoice created successfully" });
    }
  } catch (err) {
    console.error("Error:", err);
    res
      .status(500)
      .json({ error: "Failed to process invoice", details: err.message });
  }
};

//find invoice

// exports.getInvoiceAndCustomerDetails = async (req, res) => {
//   try {
//     console.log("Request Body:", req.body);

//     const { invoice_no } = req.body;

//     if (!invoice_no) {
//       return res.status(400).json({ error: "Invoice number is required" });
//     }

//     // Query to fetch invoice details
//     const invoiceSql = `SELECT * FROM Invoice WHERE invoice_no = ?`;
//     const invoiceDetails = await new Promise((resolve, reject) => {
//       db.query(invoiceSql, [invoice_no], (err, result) => {
//         if (err) {
//           console.error("Error:", err);
//           reject(err);
//         } else {
//           resolve(result);
//         }
//       });
//     });

//     if (invoiceDetails.length === 0) {
//       return res.status(404).json({ error: "Invoice not found" });
//     }

//     // Extract customer_id from the fetched invoice details
//     const customer_id = invoiceDetails[0].customer_id;

//     // Query to fetch customer details
//     const customerSql = `SELECT * FROM customerTabele WHERE customer_id = ?`;
//     const customerDetails = await new Promise((resolve, reject) => {
//       db.query(customerSql, [customer_id], (err, result) => {
//         if (err) {
//           console.error("Error:", err);
//           reject(err);
//         } else {
//           resolve(result);
//         }
//       });
//     });

//     if (customerDetails.length === 0) {
//       return res.status(404).json({ error: "Customer not found" });
//     }

    
//     // Extract customer_id from the fetched invoice details
//     const product_id= invoiceDetails[0].product_id;

//     // Query to fetch customer details
//     const productSql = `SELECT * FROM iteamTabele  WHERE product_id = ?`;
//     const productDetails = await new Promise((resolve, reject) => {
//       db.query(productSql, [product_id], (err, result) => {
//         if (err) {
//           console.error("Error:", err);
//           reject(err);
//         } else {
//           resolve(result);
//         }
//       });
//     });

//     if (productDetails .length === 0) {
//       return res.status(404).json({ error: "Customer not found" });
//     }

//         // Extract customer_id from the fetched invoice details
//         const employee_id= invoiceDetails[0].employee_id;

//         // Query to fetch customer details
//         const employeeSql = `SELECT * FROM users  WHERE user_id = ?`;
//         const employeeDetails = await new Promise((resolve, reject) => {
//           db.query(employeeSql, [employee_id], (err, result) => {
//             if (err) {
//               console.error("Error:", err);
//               reject(err);
//             } else {
//               resolve(result);
//             }
//           });
//         });
    
//         if (employeeDetails.length === 0) {
//           return res.status(404).json({ error: "Customer not found" });
//         }
//     // Combine invoice and customer details
//     const response = {
//       invoiceDetails: invoiceDetails,
//       customerDetails: customerDetails,
//       employeeDetails: employeeDetails,
//       productDetails:productDetails
//     };

//     res.status(200).json(response);
//   } catch (err) {
//     console.error("Error:", err);
//     res
//       .status(500)
//       .json({
//         error: "Failed to retrieve invoice and customer details",
//         details: err.message,
//       });
//   }
// };


exports.getInvoiceAndCustomerDetails = async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    const { invoice_no } = req.body;

    if (!invoice_no) {
      return res.status(400).json({ error: "Invoice number is required" });
    }

    // Query to fetch invoice details and all associated product_ids
    const invoiceSql = `SELECT * FROM Invoice WHERE invoice_no = ?`;
    const invoiceDetails = await new Promise((resolve, reject) => {
      db.query(invoiceSql, [invoice_no], (err, result) => {
        if (err) {
          console.error("Error:", err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    if (invoiceDetails.length === 0) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    // Extract customer_id and employee_id from the fetched invoice details
    const customer_id = invoiceDetails[0].customer_id;
    const employee_id = invoiceDetails[0].employee_id;

    // Query to fetch customer details
    const customerSql = `SELECT * FROM customerTabele WHERE customer_id = ?`;
    const customerDetails = await new Promise((resolve, reject) => {
      db.query(customerSql, [customer_id], (err, result) => {
        if (err) {
          console.error("Error:", err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    if (customerDetails.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Query to fetch employee details
    const employeeSql = `SELECT * FROM users WHERE user_id = ?`;
    const employeeDetails = await new Promise((resolve, reject) => {
      db.query(employeeSql, [employee_id], (err, result) => {
        if (err) {
          console.error("Error:", err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    if (employeeDetails.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Extract all product_ids associated with the invoice
    const productIds = invoiceDetails.map(invoice => invoice.product_id);

    // Query to fetch product details for all product_ids
    const productSql = `SELECT * FROM iteamTabele WHERE product_id IN (?)`;
    const productDetails = await new Promise((resolve, reject) => {
      db.query(productSql, [productIds], (err, result) => {
        if (err) {
          console.error("Error:", err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    if (productDetails.length === 0) {
      return res.status(404).json({ error: "Products not found" });
    }

    // Combine all details into the response
    const response = {
      invoiceDetails: invoiceDetails,
      customerDetails: customerDetails,
      employeeDetails: employeeDetails,
      productDetails: productDetails
    };
    

    res.status(200).json(response);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      error: "Failed to retrieve invoice and customer details",
      details: err.message,
    });
  }
};

