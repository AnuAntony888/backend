const { v4: uuidv4 } = require("uuid");
const db = require("../utils/db"); // Ensure you have a proper db connection setup

exports.createCustomer = async (req, res) => {
  try {
    // Extract the data from the request body
    const {
      customerName,
      customerContactNo,
      customerTownCity,
      customerPin,
      customerGSTN,
      customerAddress,
    } = req.body;

    // Validate required fields for inserting
    if (
      !customerName ||
      !customerContactNo ||
      !customerTownCity ||
      !customerPin ||
      !customerGSTN ||
      !customerAddress
    ) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided" });
    }

    const checkSql = `SELECT * FROM customerTabele WHERE customerContactNo = ?`;
    db.query(checkSql, [customerContactNo], (err, rows) => {
      if (err) {
        console.error("Error:", err);
        return res
          .status(500)
          .json({ error: "Database query failed", details: err.message });
      }

      if (rows.length > 0) {
        const updateSql = `
          UPDATE customerTabele
          SET
            customerName = ?,
            customerTownCity = ?,
            customerPin = ?,
            customerGSTN = ?,
            customerAddress = ?
          WHERE customerContactNo = ?
        `;
        const updateValues = [
          customerName,
          customerTownCity,
          customerPin,
          customerGSTN,
          customerAddress,
          customerContactNo
        ];

        db.query(updateSql, updateValues, (err, result) => {
          if (err) {
            console.error("Error:", err);
            return res
              .status(500)
              .json({ error: "Database update failed", details: err.message });
          }

          res.status(200).json({
            message: "Customer Details updated successfully",
            customer_id: rows[0].customer_id
           });
        });
      } else {
        const insertSql = `
          INSERT INTO customerTabele (
            customer_id,
            customerName,
            customerContactNo,
            customerTownCity,
            customerPin,
            customerGSTN,
            customerAddress
          )
          VALUES (?,?,?,?,?,?,?)
        `;
        const insertValues = [
          uuidv4(), // Generate a new UUID for customer_id
          customerName,
          customerContactNo,
          customerTownCity,
          customerPin,
          customerGSTN,
          customerAddress
        ];

        db.query(insertSql, insertValues, (err, result) => {
          if (err) {
            console.error("Error:", err);
            return res
              .status(500)
              .json({ error: "Database insert failed", details: err.message });
          }

          res.status(201).json({
            message: "New Customer created successfully",
            
            customer_id: insertValues[0]
           });
        });
      }
    });
  } catch (err) {
    console.error("Error:", err);
    res
      .status(500)
      .json({ error: "Failed to process item", details: err.message });
  }
};