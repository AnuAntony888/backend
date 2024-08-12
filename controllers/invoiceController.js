const { v4: uuidv4 } = require("uuid");
const db = require("../utils/db"); 










// exports.createinvoice = async (req, res) => {
//   try {
//     const {
//       invoice_no,
//       invoice_date,
//       customer_id,
//       product_id,
//       ItemCode,
//       ItemDescription,
//       ItemUnit,
//       ItemTax,
//       ItemDiscount,
//       ItemPrice,
//       Itemstock,
//       paymentmethod,
//       product_actual_total,
//       product_discounted_total,
//       cartCount,
//       orderstatus,
//       employee_id,
//     } = req.body;

//     // Ensure required fields are present
//     if (
//       !invoice_no ||
//       !invoice_date||
//       !customer_id ||
//       !product_id ||
//       !product_actual_total ||
//       !product_discounted_total ||
//       !cartCount ||
//       !orderstatus ||
//       !paymentmethod ||
//       !employee_id
      
//     ) {
//       return res.status(400).json({ error: "All required fields must be provided" });
//     }

//     // Parse JSON fields
//     const productIdsArray = JSON.parse(product_id);
//     const cartCountsArray = JSON.parse(cartCount);
//     const itemCodesArray = JSON.parse(ItemCode);
//     const itemDescriptionsArray = JSON.parse(ItemDescription);
//     const itemUnitsArray = JSON.parse(ItemUnit);
//     const itemTaxesArray = JSON.parse(ItemTax);
//     const itemDiscountsArray = JSON.parse(ItemDiscount);
//     const itemPricesArray = JSON.parse(ItemPrice);
//     const itemStocksArray = JSON.parse(Itemstock);

//     // Validate lengths of arrays
//     if (
//       productIdsArray.length !== cartCountsArray.length ||
//       productIdsArray.length !== itemCodesArray.length ||
//       productIdsArray.length !== itemDescriptionsArray.length ||
//       productIdsArray.length !== itemUnitsArray.length ||
//       productIdsArray.length !== itemTaxesArray.length ||
//       productIdsArray.length !== itemDiscountsArray.length ||
//       productIdsArray.length !== itemPricesArray.length ||
//       productIdsArray.length !== itemStocksArray.length
//     ) {
//       return res.status(400).json({ error: "Mismatch in array lengths for products and their details" });
//     }

//     // Insert invoice record
//     const insertSql = `
//       INSERT INTO Invoice (
//         invoice_id,
//         invoice_no,
//         invoice_date,
//         customer_id,
//         product_id,
//         ItemCode,
//         ItemDescription,
//         ItemUnit,
//         ItemTax,
//         ItemDiscount,
//         ItemPrice,
//         Itemstock,
//         product_actual_total,
//         product_discounted_total,
//         cartCount,
//         orderstatus,
//         paymentmethod,
//         employee_id
//       )
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
//     `;

//     for (let i = 0; i < productIdsArray.length; i++) {
//       const insertValues = [
//         uuidv4(), // Generate a new UUID for invoice_id
//         invoice_no,
//         invoice_date,
//         customer_id,
//         productIdsArray[i],
//         itemCodesArray[i],
//         itemDescriptionsArray[i],
//         itemUnitsArray[i],
//         itemTaxesArray[i],
//         itemDiscountsArray[i],
//         itemPricesArray[i],
//         itemStocksArray[i],
//         product_actual_total,
//         product_discounted_total,
//         cartCountsArray[i],
//         orderstatus,
//         paymentmethod,
//         employee_id
//       ];

//       await new Promise((resolve, reject) => {
//         db.query(insertSql, insertValues, (err, result) => {
//           if (err) {
//             console.error("Error:", err);
//             reject(err);
//           } else {
//             resolve(result);
//           }
//         });
//       });
//     }

//     res.status(201).json({ message: "Invoice created successfully" });
//   } catch (err) {
//     console.error("Error:", err);
//     res.status(500).json({ error: "Failed to process invoice", details: err.message });
//   }
// };

exports.createinvoice = async (req, res) => {
  try {
    const {
      invoice_no,
      invoice_date,
      customer_id,
      product_id,
      ItemCode,
      ItemDescription,
      ItemUnit,
      ItemTax,
      ItemDiscount,
      ItemPrice,
      Itemstock,
      paymentmethod,
      product_actual_total,
      product_discounted_total,
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
      !cartCount ||
      !orderstatus ||
      !paymentmethod ||
      !employee_id
    ) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    // Parse JSON fields
    const productIdsArray = JSON.parse(product_id);
    const cartCountsArray = JSON.parse(cartCount);
    const itemCodesArray = JSON.parse(ItemCode);
    const itemDescriptionsArray = JSON.parse(ItemDescription);
    const itemUnitsArray = JSON.parse(ItemUnit);
    const itemTaxesArray = JSON.parse(ItemTax);
    const itemDiscountsArray = JSON.parse(ItemDiscount);
    const itemPricesArray = JSON.parse(ItemPrice);
    const itemStocksArray = JSON.parse(Itemstock);

    // Validate lengths of arrays
    if (
      productIdsArray.length !== cartCountsArray.length ||
      productIdsArray.length !== itemCodesArray.length ||
      productIdsArray.length !== itemDescriptionsArray.length ||
      productIdsArray.length !== itemUnitsArray.length ||
      productIdsArray.length !== itemTaxesArray.length ||
      productIdsArray.length !== itemDiscountsArray.length ||
      productIdsArray.length !== itemPricesArray.length ||
      productIdsArray.length !== itemStocksArray.length
    ) {
      return res.status(400).json({ error: "Mismatch in array lengths for products and their details" });
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
          ItemCode = ?,
          ItemDescription = ?,
          ItemUnit = ?,
          ItemTax = ?,
          ItemDiscount = ?,
          ItemPrice = ?,
          Itemstock = ?,
          product_actual_total = ?,
          product_discounted_total = ?,
          cartCount = ?,
          orderstatus = ?,
          paymentmethod = ?,
          employee_id = ?
        WHERE invoice_no = ? AND product_id = ?`;

      for (let i = 0; i < productIdsArray.length; i++) {
        const updateValues = [
          invoice_date,
          customer_id,
          productIdsArray[i],
          itemCodesArray[i],
          itemDescriptionsArray[i],
          itemUnitsArray[i],
          itemTaxesArray[i],
          itemDiscountsArray[i],
          itemPricesArray[i],
          itemStocksArray[i],
          product_actual_total,
          product_discounted_total,
          cartCountsArray[i],
          orderstatus,
          paymentmethod,
          employee_id,
          invoice_no,
          productIdsArray[i]
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
          ItemCode,
          ItemDescription,
          ItemUnit,
          ItemTax,
          ItemDiscount,
          ItemPrice,
          Itemstock,
          product_actual_total,
          product_discounted_total,
          cartCount,
          orderstatus,
          paymentmethod,
          employee_id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      for (let i = 0; i < productIdsArray.length; i++) {
        const insertValues = [
          uuidv4(), // Generate a new UUID for invoice_id
          invoice_no,
          invoice_date,
          customer_id,
          productIdsArray[i],
          itemCodesArray[i],
          itemDescriptionsArray[i],
          itemUnitsArray[i],
          itemTaxesArray[i],
          itemDiscountsArray[i],
          itemPricesArray[i],
          itemStocksArray[i],
          product_actual_total,
          product_discounted_total,
          cartCountsArray[i],
          orderstatus,
          paymentmethod,
          employee_id
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

//find invoice

exports.getInvoiceAndCustomerDetails = async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    const { invoice_no} = req.body;

    if (!invoice_no) {
      return res.status(400).json({ error: "Invoice number is required" });
    }

    // Query to fetch invoice details
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

    // Extract customer_id from the fetched invoice details
    const customer_id = invoiceDetails[0].customer_id;

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

    // Combine invoice and customer details
    const response = {
      invoiceDetails: invoiceDetails,
      customerDetails: customerDetails,
    };

    res.status(200).json(response);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to retrieve invoice and customer details", details: err.message });
  }
};

