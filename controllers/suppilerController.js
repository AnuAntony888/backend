const { v4: uuidv4 } = require("uuid");
const db = require("../utils/db"); // Ensure you have a proper db connection setup

//creat supplier
exports.createSupplier = async (req, res) => {
  try {
    // Clean up field names by trimming whitespace
    const supplier = {
      user_id: uuidv4(), 
    SupplierDescription : req.body.SupplierDescription ? req.body.SupplierDescription.trim() : '',
      SupplierAddress: req.body.SupplierAddress ? req.body.SupplierAddress.trim() : '',
      visibility: 1,
 created_timestamp : req.body.created_timestamp ? req.body.created_timestamp.trim() : new Date().toISOString(),
 created_by : req.body.created_by ? req.body.created_by.trim() : 'unknown',
 master_id : req.body.master_id ? req.body.master_id.trim() : '',
      // SupplierDescription: req.body.SupplierDescription.trim(),
      // SupplierAddress: req.body.SupplierAddress.trim(),
      // visibility: 1, 
      // created_timestamp: req.body.created_timestamp.trim(), 
      // created_by: req.body.created_by.trim(), 
      // master_id: req.body.master_id.trim(),
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
    let newSupplierCode = "000001"; // Default starting code
    if (maxCodeResult) {
      const maxCode = parseInt(maxCodeResult, 10);
      newSupplierCode = (maxCode + 1).toString().padStart(6, "0");
    }

    console.log("New SupplierCode:", newSupplierCode); // Log for debugging

    // Explicitly list column names with correct field names
    const sql = `
      INSERT INTO suppliers (user_id, SupplierCode, SupplierDescription, SupplierAddress,visibility,created_timestamp,created_by,
      master_id)
      VALUES (?, ?, ?, ?,?,?,?,?)
    `;

    const values = [
      supplier.user_id,
      newSupplierCode,
      supplier.SupplierDescription,
      supplier.SupplierAddress,
      supplier.visibility,
      supplier.created_timestamp,
      supplier.created_by,
      supplier.master_id,
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

  const { SupplierCode, master_id } = req.body;
  console.log("SupplierCode received:", SupplierCode);
  if (!SupplierCode || !master_id) {
    return res
      .status(400)
      .json({ error: "SupplierCode and master_id are required" });
  }

  const sql =
    "SELECT * FROM suppliers WHERE SupplierCode = ? AND master_id = ? AND visibility = 1";

  db.query(sql, [SupplierCode, master_id], (err, results) => {
    if (err) {
      console.error("Database Error:", err);
      return res
        .status(500)
        .json({ error: "Failed to retrieve supplier details" });
    }
    console.log("Query Results:", results);
    if (results.length === 0) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    const supplier = results[0];
    res.status(200).json({
      message: "Supplier details retrieved successfully",
      supplier: supplier,
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
  const {
    SupplierCode,
    SupplierDescription,
    SupplierAddress,
    visibility,
    updated_timestamp,
    updated_by,
    master_id,
  } = req.body;
  console.log("SupplierCode received:", SupplierCode);
  console.log("Supplier Description received:", SupplierDescription);
  console.log("Supplier Address received:", SupplierAddress);

  if (!SupplierCode || !SupplierDescription || !SupplierAddress) {
    return res.status(400).json({
      error:
        "SupplierCode, Supplier Description, and Supplier Address are required",
    });
  }

  const sql = `
      UPDATE suppliers 
      SET SupplierDescription = ?, SupplierAddress = ? ,visibility = ? ,updated_timestamp =?,updated_by=?,
      master_id = ? 
      WHERE SupplierCode = ?
    `;

  const values = [
    SupplierDescription.trim(),
    SupplierAddress.trim(),
    visibility !== undefined ? visibility : 1,
    updated_timestamp ? updated_timestamp.trim() : null,
    updated_by ? updated_by.trim() : null,
    master_id.trim(),
    SupplierCode,
  ];

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
  const { SupplierCode, deleted_timestamp, deleted_by } = req.body;
  if (!SupplierCode) {
    return res.status(400).json({ error: "SupplierCode is required" });
  }

  const sql =
    "UPDATE suppliers SET visibility = ?,  deleted_timestamp =?,deleted_by =? WHERE SupplierCode = ?";
  const values = [
    (visibility = 0),
    deleted_timestamp,
    deleted_by,
    SupplierCode,
  ];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      return res
        .status(500)
        .json({ error: "Failed to update supplier visibility" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    res.status(200).json({ message: "Supplier delete successfully" });
  });
};

// Get all Supplier
exports.getAllSupplier = (req, res) => {
  const { master_id } = req.body;

  if (!master_id) {
    return res.status(400).json({ error: "master_id is required" });
  }

  const sql = "SELECT * FROM suppliers WHERE master_id = ? AND visibility = 1";

  db.query(sql, [master_id], (err, results) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: "Failed to retrieve suppliers" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    res.status(200).json(results);
  });
};

// Check supplier exist
exports.checkSupplier = (req, res) => {
  const { SupplierDescription } = req.body;

  if (!SupplierDescription) {
    return res.status(400).json({ error: "Supplier description is required" });
  }

  const query =
    "SELECT * FROM suppliers WHERE SupplierDescription = ? AND visibility = 1";
  db.query(query, [SupplierDescription], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res
        .status(500)
        .json({ error: "Database query failed", details: err.message });
    }

    if (results.length > 0) {
      res.status(200).json({ exists: true });
    } else {
      res.status(200).json({ exists: false });
    }
  });
};
