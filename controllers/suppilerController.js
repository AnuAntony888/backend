const { v4: uuidv4 } = require("uuid");
const db = require("../utils/db"); // Ensure you have a proper db connection setup


//creat supplier
exports.createSupplier = async (req, res) => {
  try {
    // Clean up field names by trimming whitespace
    const supplier = {
      user_id: uuidv4(), // Generate unique user_id using uuidv4
      SupplierDescription: req.body.SupplierDescription.trim(),
      SupplierAddress: req.body.SupplierAddress.trim(),
    };

    // Fetch the current maximum SupplierCode to determine the next code
    const getMaxCodeSql = `SELECT MAX(SupplierCode) AS maxCode FROM suppliers`;

    const maxCodeResult = await new Promise((resolve, reject) => {
      db.query(getMaxCodeSql, (err, result) => {
        if (err) {
          console.error("Database Error:", err);
          return reject(err);
        }
        resolve(result[0].maxCode);
      });
    });



     // Calculate the new SupplierCode
     let newSupplierCode = '000001'; // Default starting code
     if (maxCodeResult) {
       const maxCode = parseInt(maxCodeResult, 10);
       newSupplierCode = (maxCode + 1).toString().padStart(6, '0');
     }
 
     console.log("New SupplierCode:", newSupplierCode); // Log for debugging

    // Explicitly list column names with correct field names
    const sql = `
      INSERT INTO suppliers (user_id, SupplierCode, SupplierDescription, SupplierAddress)
      VALUES (?, ?, ?, ?)
    `;

    const values = [
      supplier.user_id,
      newSupplierCode,
      supplier.SupplierDescription,
      supplier.SupplierAddress,
    ];

    // Use a Promise to handle the query asynchronously
    await new Promise((resolve, reject) => {
      db.query(sql, values, (err, result) => {
        if (err) {
          console.error("Database Error:", err);
          console.error("SQL Query:", sql);
          console.error("Supplier Data:", supplier);
          return reject(err); // Reject the promise on error
        }
        resolve(result); // Resolve the promise on success
      });
    });

    res.status(201).json({ message: "Supplier added successfully" });
  } catch (err) {
    console.error("Error:", err);
    res
      .status(500)
      .json({ error: "Failed to add supplier", details: err.message });
  }
};

{
  /********************get supplier using userid**********************************/
}

exports.getSupplierById = (req, res) => {

  console.log("Request Body:", req.body);

  const { SupplierCode } = req.body;
  console.log("SupplierCode received:", SupplierCode);
  if (!SupplierCode) {
    return res.status(400).json({ error: "SupplierCode is required" });
  }
  const sql = "SELECT * FROM suppliers WHERE SupplierCode = ?";
  db.query(sql, [SupplierCode], (err, results) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: "Failed to retrieve supplier details" });
    }
    console.log("Query Results:", results);
    if (results.length === 0) {
      return res.status(404).json({ error: "Supplier not found" });
    }
    const supplier = results[0];
    // res.status(200).json(supplier);
    res.status(200).json({
      message: "Supplier details retrieved successfully",
      supplier: supplier
    });
  });
};

{
  /***************update supplier using userid**********************************/
}
exports.updateSupplier = (req, res) => {
  // Log the request body to ensure it's being received
  console.log("Request Body:", req.body);

  // Extract the user_id, SupplierDescription, and SupplierAddress from the JSON body
  const { SupplierCode, SupplierDescription, SupplierAddress } = req.body;
  console.log("SupplierCode received:", SupplierCode);
  console.log("Supplier Description received:", SupplierDescription);
  console.log("Supplier Address received:", SupplierAddress);

  if (!SupplierCode || !SupplierDescription || !SupplierAddress) {
    return res
      .status(400)
      .json({
        error:
          "SupplierCode, Supplier Description, and Supplier Address are required",
      });
  }

  const sql = `
      UPDATE suppliers 
      SET SupplierDescription = ?, SupplierAddress = ? 
      WHERE SupplierCode = ?
    `;

  const values = [SupplierDescription.trim(), SupplierAddress.trim(), SupplierCode];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: "Failed to update supplier" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    res.status(200).json({ message: "Supplier updated successfully" });
  });
};

{
  /**********************delete supplier using userid*************************************88 */
}
exports.deleteSupplier = (req, res) => {
  // Log the request body to ensure it's being received
  console.log("Request Body:", req.body);

  // Extract the user_id from the JSON body
  const { SupplierCode} = req.body;
  console.log("SupplierCode received:", SupplierCode);

  if (!SupplierCode) {
    return res.status(400).json({ error: "SupplierCode is required" });
  }

  const sql = "DELETE FROM suppliers WHERE SupplierCode = ?";

  db.query(sql, [SupplierCode], (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: "Failed to delete supplier" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    res.status(200).json({ message: "Supplier deleted successfully" });
  });
};

// Get all Supplier
exports.getAllSupplier = (req, res) => {
  const sql = "SELECT * FROM suppliers";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: "Failed to retrieve products" });
    }
    res.status(200).json(results);
  });
};
