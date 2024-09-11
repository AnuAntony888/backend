const { v4: uuidv4 } = require("uuid");
const db = require("../utils/db");

// exports.createinvoice = async (req, res) => {
//   try {
//     const {
//       invoice_no,
//       invoice_date,
//       customer_id,
//       product_id,
//       paymentmethod,
//       product_actual_total,
//       product_discounted_total,
//       product_total,
//       cartCount,
//       orderstatus,
//       employee_id,
//       created_by,
//       updated_by,
//       master_id,
//       visibility = 1,
//       tax,
//       totalWithTax,
//       roundAmount
      
//     } = req.body;

//     // Ensure required fields are present
//     if (
//       !invoice_no ||
//       !invoice_date ||
//       !customer_id ||
//       !product_id ||
//       !product_actual_total ||
//       !product_discounted_total ||
//       !product_total ||
//       !cartCount ||
//       !orderstatus ||
//       !paymentmethod ||
//       !employee_id
//     ) {
//       return res
//         .status(400)
//         .json({ error: "All required fields must be provided" });
//     }

//     // Parse JSON fields
//     const productIdsArray = JSON.parse(product_id);
//     const cartCountsArray = JSON.parse(cartCount);

//     // Validate lengths of arrays
//     if (productIdsArray.length !== cartCountsArray.length) {
//       return res.status(400).json({
//         error: "Mismatch in array lengths for products and their details",
//       });
//     }

//     // Check if invoice_no already exists
//     const checkInvoiceSql = `SELECT * FROM invoice WHERE invoice_no = ?`;
//     const existinginvoice = await new Promise((resolve, reject) => {
//       db.query(checkInvoiceSql, [invoice_no], (err, result) => {
//         if (err) {
//           console.error("Error:", err);
//           reject(err);
//         } else {
//           resolve(result);
//         }
//       });
//     });
//     console.log(existinginvoice.length, "leng");
//     if (existinginvoice.length > 0) {
//       // Invoice exists, update the records
//       const updateSql = `
//         UPDATE invoice SET
//           invoice_date = ?,
//           customer_id = ?,
//           product_id = ?,
//           product_actual_total = ?,
//           product_discounted_total = ?,
//           product_total = ?,
//           cartCount = ?,
//           orderstatus = ?,
//           paymentmethod = ?,
//           employee_id = ?,
//           updated_timestamp = CURRENT_TIMESTAMP,
//            updated_by = ?,
//               master_id = ? ,
//               visibility = ?,
//                  tax= ?,
//       totalWithTax = ?,
//       roundAmount = ?
//         WHERE invoice_no = ?
//           AND product_id = ?`;
//       // console.log(productIdsArray.length,"productIdsArray.length")
//       for (let i = 0; i < productIdsArray.length; i++) {
//         const updateValues = [
//           invoice_date,
//           customer_id,
//           productIdsArray[i],
//           product_actual_total,
//           product_discounted_total,
//           product_total,
//           cartCountsArray[i],
//           orderstatus,
//           paymentmethod,
//           employee_id,
//           updated_by,
//           master_id,
//           visibility,
//           tax,
//           totalWithTax,
//           roundAmount,
//           invoice_no,
//           productIdsArray[i],
//         ];
//         // console.log("updateValues invoice:", updateSql, updateValues);
//         // console.log(invoice_no, productIdsArray[i], "invoice");
//         console.log(updateValues, "updatevalue");
//         await new Promise((resolve, reject) => {
//           db.query(updateSql, updateValues, (err, result) => {
//             if (err) {
//               console.error("Error:", err);
//               reject(err);
//             } else {
//               // console.log(result,"result")
//               resolve(result);
//             }
//           });
//         });
//       }

//       res.status(200).json({ message: "Invoice updated successfully" });
//     } else {
//       // Invoice does not exist, insert new records
//       const insertSql = `
//         INSERT INTO invoice (
//           invoice_id,
//           invoice_no,
//           invoice_date,
//           customer_id,
//           product_id,
//           product_actual_total,
//           product_discounted_total,
//           product_total,
//           cartCount,
//           orderstatus,
//           paymentmethod,
//           employee_id,
//           created_timestamp,
//           created_by ,
//           master_id ,
//           visibility,
//              tax,
//       totalWithTax,
//       roundAmount
          
//         )
//         VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,CURRENT_TIMESTAMP, ?,?,?,?,?,?)`;

//       for (let i = 0; i < productIdsArray.length; i++) {
//         const insertValues = [
//           uuidv4(), // Generate a new UUID for invoice_id
//           invoice_no,
//           invoice_date,
//           customer_id,
//           productIdsArray[i],

//           product_actual_total,
//           product_discounted_total,
//           product_total,
//           cartCountsArray[i],
//           orderstatus,
//           paymentmethod,
//           employee_id,
//           created_by,
//           master_id,
//           visibility,
//           tax,
//           totalWithTax,
//           roundAmount


//         ];
//         console.log("insertValues invoice:", insertValues);
//         await new Promise((resolve, reject) => {
//           db.query(insertSql, insertValues, (err, result) => {
//             if (err) {
//               console.error("Error:", err);
//               reject(err);
//             } else {
//               resolve(result);
//             }
//           });
//         });
//       }

//       res.status(201).json({ message: "Invoice created successfully" });
//     }
//   } catch (err) {
//     console.error("Error:", err);
//     res
//       .status(500)
//       .json({ error: "Failed to process invoice", details: err.message });
//   }
// };






// const { v4: uuidv4 } = require("uuid");

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
      created_by,
      updated_by,
      master_id,
      visibility = 1,
      tax,
      totalWithTax,
      roundAmount
    } = req.body;

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

    const productIdsArray = JSON.parse(product_id);
    const cartCountsArray = JSON.parse(cartCount);

    if (productIdsArray.length !== cartCountsArray.length) {
      return res.status(400).json({
        error: "Mismatch in array lengths for products and their details",
      });
    }

    const checkInvoiceSql = `SELECT * FROM invoice WHERE invoice_no = ?`;
    const existinginvoice = await new Promise((resolve, reject) => {
      db.query(checkInvoiceSql, [invoice_no], (err, result) => {
        if (err) {
          console.error("Error:", err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    if (existinginvoice.length > 0) {
      // Invoice exists, update the records
      const updateSql = `
        UPDATE invoice SET
          invoice_date = ?,
          customer_id = ?,
          product_id = ?, 
          product_actual_total = ?,
          product_discounted_total = ?,
          product_total = ?,
          cartCount = ?,
          orderstatus = ?,
          paymentmethod = ?,
          employee_id = ?,
          updated_timestamp = CURRENT_TIMESTAMP,
          updated_by = ?,
          master_id = ?,
          visibility = ?,
          tax = ?,
          totalWithTax = ?,
          roundAmount = ?
        WHERE invoice_no = ? AND product_id = ?`;

      for (let i = 0; i < productIdsArray.length; i++) {
        const productId = productIdsArray[i];
        const newCartCount = cartCountsArray[i];

        // Fetch existing cartCount for the product in the current invoice
        const fetchCartCountSql = `SELECT cartCount FROM invoice WHERE invoice_no = ? AND product_id = ?`;
        const existingCartCountResult = await new Promise((resolve, reject) => {
          db.query(fetchCartCountSql, [invoice_no, productId], (err, result) => {
            if (err) {
              console.error("Error:", err);
              reject(err);
            } else {
              resolve(result);
            }
          });
        });

        const existingCartCount = existingCartCountResult.length > 0 ? existingCartCountResult[0].cartCount : 0;

        // Update item stock based on cartCount difference
        if (existingCartCount !== newCartCount) {
          const stockDifference = existingCartCount - newCartCount;
          const updateStockSql = `
            UPDATE iteamTabele SET Iteamstock = Iteamstock + ?
            WHERE product_id = ?`;

          await new Promise((resolve, reject) => {
            db.query(updateStockSql, [stockDifference, productId], (err, result) => {
              if (err) {
                console.error("Error updating stock:", err);
                reject(err);
              } else {
                resolve(result);
              }
            });
          });
        }

        const updateValues = [
          invoice_date,
          customer_id,
          productId,
          product_actual_total,
          product_discounted_total,
          product_total,
          newCartCount,
          orderstatus,
          paymentmethod,
          employee_id,
          updated_by,
          master_id,
          visibility,
          tax,
          totalWithTax,
          roundAmount,
          invoice_no,
          productId,
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
        INSERT INTO invoice (
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
          employee_id,
          created_timestamp,
          created_by,
          master_id,
          visibility,
          tax,
          totalWithTax,
          roundAmount
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?, ?, ?, ?, ?)`;

      for (let i = 0; i < productIdsArray.length; i++) {
        const productId = productIdsArray[i];
        const cartCount = cartCountsArray[i];

        // Decrease stock in iteamTabele
        const updateStockSql = `
          UPDATE iteamTabele SET Iteamstock = Iteamstock - ?
          WHERE product_id = ?`;

        await new Promise((resolve, reject) => {
          db.query(updateStockSql, [cartCount, productId], (err, result) => {
            if (err) {
              console.error("Error updating stock:", err);
              reject(err);
            } else {
              resolve(result);
            }
          });
        });

        const insertValues = [
          uuidv4(),
          invoice_no,
          invoice_date,
          customer_id,
          productId,
          product_actual_total,
          product_discounted_total,
          product_total,
          cartCount,
          orderstatus,
          paymentmethod,
          employee_id,
          created_by,
          master_id,
          visibility,
          tax,
          totalWithTax,
          roundAmount,
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
    res.status(500).json({ error: "Failed to process invoice", details: err.message });
  }
};

exports.getInvoiceAndCustomerDetails = async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    const { invoice_no, master_id } = req.body;

    if (!invoice_no || !master_id) {
      return res
        .status(400)
        .json({ error: "invoice number and master_id is required" });
    }

    // const invoiceSql = `SELECT * FROM Invoice WHERE master_id = ? AND invoice_no = ?`;
    const invoiceSql = `SELECT * FROM invoice WHERE master_id = ? AND invoice_no = ? AND visibility= 1`;
    const invoiceDetails = await new Promise((resolve, reject) => {
      db.query(invoiceSql, [master_id, invoice_no], (err, result) => {
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
    const customerSql = `SELECT * FROM customertabele WHERE customer_id = ?`;
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
    const productIds = invoiceDetails.map((invoice) => invoice.product_id);

    // Query to fetch product details for all product_ids
    const productSql = `SELECT * FROM iteamtabele WHERE product_id IN (?)`;
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
      productDetails: productDetails,
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

//invoice genrate
exports.generateInvoiceNumber = async (req, res) => {
  try {
    const { date } = req.query; // Expecting date in 'YYYY-MM-DD' format from the client

    const today = date ? new Date(date) : new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const datePart = `${year}${month}${day}`;

    // Query to find the last invoice number for the given date
    const lastInvoiceSql = `SELECT invoice_no FROM invoice WHERE invoice_no LIKE ? ORDER BY invoice_no DESC LIMIT 1`;
    const lastInvoiceNumber = await new Promise((resolve, reject) => {
      db.query(lastInvoiceSql, [`INV-${datePart}%`], (err, result) => {
        if (err) {
          console.error("Error fetching last invoice number:", err);
          reject(err);
        } else {
          resolve(result.length > 0 ? result[0].invoice_no : null);
        }
      });
    });

    let sequentialPart = 1;

    if (lastInvoiceNumber) {
      // Extract the sequential part from the last invoice number
      const lastSequentialPart = parseInt(lastInvoiceNumber.split("-")[2], 10);
      sequentialPart = lastSequentialPart + 1;
    }

    const sequentialPartStr = String(sequentialPart).padStart(4, "0");
    const newInvoiceNumber = `INV-${datePart}-${sequentialPartStr}`;

    // Send the generated invoice number as a response
    res.status(200).json({ invoiceNumber: newInvoiceNumber });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate invoice number" });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    const { invoice_no, deleted_by, orderstatus } = req.body;

    // Ensure the invoice_no is provided
    if (!invoice_no) {
      return res.status(400).json({ error: "Invoice number is required" });
    }

    // Set the current timestamp as the deleted timestamp
    const deleted_timestamp = new Date().toISOString();

    // Ensure `deleted_by` and `orderstatus` are provided
    if (!deleted_by) {
      return res.status(400).json({ error: "Deleted by is required" });
    }

    if (!orderstatus) {
      return res.status(400).json({ error: "Order status is required" });
    }

    // Update visibility of the invoice to 0 (hidden)
    const updateVisibilitySql = `
      UPDATE invoice
      SET visibility = ?, deleted_timestamp = ?, deleted_by = ?, orderstatus = ?
      WHERE invoice_no = ?
    `;
    const values = [0, deleted_timestamp, deleted_by, orderstatus, invoice_no];

    const result = await new Promise((resolve, reject) => {
      db.query(updateVisibilitySql, values, (err, result) => {
        if (err) {
          console.error("Error:", err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    // Check if any rows were affected
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Invoice not found or already deleted" });
    }

    res.status(200).json({ message: "Invoice visibility updated to hidden" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      error: "Failed to update invoice visibility",
      details: err.message,
    });
  }
};



// exports.updateInvoice = async (req, res) => {
//   try {
//     const {
//       invoice_id,
//       invoice_no,
//       invoice_date,
//       customer_id,
//       product_id,
//       paymentmethod,
//       product_actual_total,
//       product_discounted_total,
//       product_total,
//       cartCount,
//       orderstatus,
//       employee_id,
//       updated_by,
//       master_id,
//       visibility = 1,
//       tax,
//       totalWithTax,
//       roundAmount
//     } = req.body;

//     // Ensure required fields are present
//     if (
//       !invoice_no ||
//       !invoice_date ||
//       !customer_id ||
//       !product_id ||
//       !product_actual_total ||
//       !product_discounted_total ||
//       !product_total ||
//       !cartCount ||
//       !orderstatus ||
//       !paymentmethod ||
//       !employee_id
//     ) {
//       return res
//         .status(400)
//         .json({ error: "All required fields must be provided" });
//     }

//     // Parse JSON fields
//     const productIdsArray = JSON.parse(product_id);
//     const cartCountsArray = JSON.parse(cartCount);

//     // Validate lengths of arrays
//     if (productIdsArray.length !== cartCountsArray.length) {
//       return res.status(400).json({
//         error: "Mismatch in array lengths for products and their details",
//       });
//     }

//     // Fetch existing invoice records for the given invoice_no
//     const existingInvoices = await new Promise((resolve, reject) => {
//       const selectSql = `SELECT product_id FROM invoice WHERE invoice_no = ?`;
//       db.query(selectSql, [invoice_no], (err, result) => {
//         if (err) {
//           console.error("Error:", err);
//           reject(err);
//         } else {
//           resolve(result);
//         }
//       });
//     });

//     const existingProductIds = existingInvoices.map(
//       (invoice) => invoice.product_id
//     );

//     // Update existing records or insert new ones
//     for (let i = 0; i < productIdsArray.length; i++) {
//       if (existingProductIds.includes(productIdsArray[i])) {
//         // Update existing record
//         const updateSql = `
//           UPDATE invoice SET
//             invoice_date = ?,
//             customer_id = ?,
//             product_actual_total = ?,
//             product_discounted_total = ?,
//             product_total = ?,
//             cartCount = ?,
//             orderstatus = ?,
//             paymentmethod = ?,
//             employee_id = ?,
//             updated_timestamp = CURRENT_TIMESTAMP,
//             updated_by = ?,
//             master_id = ?,
//             visibility = ?,
//                tax = ?,
//       totalWithTax = ?,
//       roundAmount = ?
//           WHERE invoice_no = ?
//             AND product_id = ?`;

//         const updateValues = [
//           invoice_date,
//           customer_id,
//           product_actual_total,
//           product_discounted_total,
//           product_total,
//           cartCountsArray[i],
//           orderstatus,
//           paymentmethod,
//           employee_id,
//           updated_by,
//           master_id,
//           visibility,
//           tax,
//           totalWithTax,
//           roundAmount,
//           invoice_no,
//           productIdsArray[i],
//         ];

//         await new Promise((resolve, reject) => {
//           db.query(updateSql, updateValues, (err, result) => {
//             if (err) {
//               console.error("Error:", err);
//               reject(err);
//             } else {
//               resolve(result);
//             }
//           });
//         });
//       } else {
//         // Insert new record
//         const insertSql = `
//           INSERT INTO invoice (
//           invoice_id,
//             invoice_no,
//             invoice_date,
//             customer_id,
//             product_id,
//             paymentmethod,
//             product_actual_total,
//             product_discounted_total,
//             product_total,
//             cartCount,
//             orderstatus,
//             employee_id,
//             updated_by,
//             master_id,
//             visibility ,
//             tax ,
//             totalWithTax ,
//             roundAmount 
//           ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)`;

//         const insertValues = [
//           uuidv4(),
//           invoice_no,
//           invoice_date,
//           customer_id,
//           productIdsArray[i],
//           paymentmethod,
//           product_actual_total,
//           product_discounted_total,
//           product_total,
//           cartCountsArray[i],
//           orderstatus,
//           employee_id,
//           updated_by,
//           master_id,
//           visibility,
//           tax,
//           totalWithTax,
//           roundAmount
//         ];

//         await new Promise((resolve, reject) => {
//           db.query(insertSql, insertValues, (err, result) => {
//             if (err) {
//               console.error("Error:", err);
//               reject(err);
//             } else {
//               resolve(result);
//             }
//           });
//         });
//       }
//     }

//     // Set visibility to zero for products no longer in the updated list
//     for (let existingProductId of existingProductIds) {
//       if (!productIdsArray.includes(existingProductId)) {
//         const updateVisibilitySql = `
//           UPDATE invoice SET
//             visibility = 0,
//             updated_timestamp = CURRENT_TIMESTAMP
//           WHERE invoice_no = ?
//             AND product_id = ?`;

//         const updateVisibilityValues = [invoice_no, existingProductId];

//         await new Promise((resolve, reject) => {
//           db.query(
//             updateVisibilitySql,
//             updateVisibilityValues,
//             (err, result) => {
//               if (err) {
//                 console.error("Error:", err);
//                 reject(err);
//               } else {
//                 resolve(result);
//               }
//             }
//           );
//         });
//       }
//     }

//     res.status(200).json({ message: "Invoice updated successfully" });
//   } catch (err) {
//     console.error("Error:", err);
//     res
//       .status(500)
//       .json({ error: "Failed to update invoice", details: err.message });
//   }
// };
exports.updateInvoice = async (req, res) => {
  try {
    const {
      invoice_id,
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
      updated_by,
      master_id,
      visibility = 1,
      tax,
      totalWithTax,
      roundAmount
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
    if (productIdsArray.length !== cartCountsArray.length) {
      return res.status(400).json({
        error: "Mismatch in array lengths for products and their details",
      });
    }

    // Fetch existing invoice records for the given invoice_no
    const existingInvoices = await new Promise((resolve, reject) => {
      const selectSql = `SELECT product_id, cartCount FROM invoice WHERE invoice_no = ?`;
      db.query(selectSql, [invoice_no], (err, result) => {
        if (err) {
          console.error("Error:", err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    const existingProductIds = existingInvoices.map(
      (invoice) => invoice.product_id
    );

    // Update existing records or insert new ones
    for (let i = 0; i < productIdsArray.length; i++) {
      const productId = productIdsArray[i];
      const newCartCount = cartCountsArray[i];

      // Check if the product exists in the invoice
      const existingInvoice = existingInvoices.find(
        (invoice) => invoice.product_id === productId
      );

      if (existingInvoice) {
        // Fetch existing cart count and adjust stock
        const existingCartCount = existingInvoice.cartCount;

        // If cart count has changed, update stock accordingly
        if (existingCartCount !== newCartCount) {
          const stockDifference = existingCartCount - newCartCount;

          // Update stock in iteamTabele
          const updateStockSql = `
            UPDATE iteamTabele 
            SET Iteamstock = Iteamstock + ? 
            WHERE product_id = ?`;
          await new Promise((resolve, reject) => {
            db.query(
              updateStockSql,
              [stockDifference, productId],
              (err, result) => {
                if (err) {
                  console.error("Error updating stock:", err);
                  reject(err);
                } else {
                  resolve(result);
                }
              }
            );
          });
        }

        // Update the existing invoice record
        const updateInvoiceSql = `
          UPDATE invoice SET
            invoice_date = ?,
            customer_id = ?,
            product_actual_total = ?,
            product_discounted_total = ?,
            product_total = ?,
            cartCount = ?,
            orderstatus = ?,
            paymentmethod = ?,
            employee_id = ?,
            updated_timestamp = CURRENT_TIMESTAMP,
            updated_by = ?,
            master_id = ?,
            visibility = ?,
            tax = ?,
            totalWithTax = ?,
            roundAmount = ?
          WHERE invoice_no = ? AND product_id = ?`;

        const updateValues = [
          invoice_date,
          customer_id,
          product_actual_total,
          product_discounted_total,
          product_total,
          newCartCount,
          orderstatus,
          paymentmethod,
          employee_id,
          updated_by,
          master_id,
          visibility,
          tax,
          totalWithTax,
          roundAmount,
          invoice_no,
          productId
        ];

        await new Promise((resolve, reject) => {
          db.query(updateInvoiceSql, updateValues, (err, result) => {
            if (err) {
              console.error("Error updating invoice:", err);
              reject(err);
            } else {
              resolve(result);
            }
          });
        });
      } else {
        // Insert new invoice record and reduce stock accordingly
        const insertSql = `
          INSERT INTO invoice (
            invoice_id,
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
            updated_by,
            master_id,
            visibility,
            tax,
            totalWithTax,
            roundAmount
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const insertValues = [
          uuidv4(),
          invoice_no,
          invoice_date,
          customer_id,
          productId,
          paymentmethod,
          product_actual_total,
          product_discounted_total,
          product_total,
          newCartCount,
          orderstatus,
          employee_id,
          updated_by,
          master_id,
          visibility,
          tax,
          totalWithTax,
          roundAmount
        ];

        await new Promise((resolve, reject) => {
          db.query(insertSql, insertValues, (err, result) => {
            if (err) {
              console.error("Error inserting invoice:", err);
              reject(err);
            } else {
              resolve(result);
            }
          });
        });

        // Reduce stock in iteamTabele
        const reduceStockSql = `
          UPDATE iteamTabele 
          SET Iteamstock = Iteamstock - ? 
          WHERE product_id = ?`;
        await new Promise((resolve, reject) => {
          db.query(reduceStockSql, [newCartCount, productId], (err, result) => {
            if (err) {
              console.error("Error reducing stock:", err);
              reject(err);
            } else {
              resolve(result);
            }
          });
        });
      }
    }

    // Set visibility to zero for products no longer in the updated list
    for (let existingProductId of existingProductIds) {
      if (!productIdsArray.includes(existingProductId)) {
        const updateVisibilitySql = `
          UPDATE invoice SET
            visibility = 0,
            updated_timestamp = CURRENT_TIMESTAMP
          WHERE invoice_no = ? AND product_id = ?`;

        const updateVisibilityValues = [invoice_no, existingProductId];

        await new Promise((resolve, reject) => {
          db.query(
            updateVisibilitySql,
            updateVisibilityValues,
            (err, result) => {
              if (err) {
                console.error("Error:", err);
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        });
      }
    }

    res.status(200).json({ message: "Invoice updated successfully" });
  } catch (err) {
    console.error("Error:", err);
    res
      .status(500)
      .json({ error: "Failed to update invoice", details: err.message });
  }
};
