const { v4: uuidv4 } = require("uuid");
const db = require("../utils/db"); // Ensure you have a proper DB connection setup

exports.createmaster = async (req, res) => {
  try {
    const {
      entityName,
      entityAddress,
      tax,
      discount,
      itemTax,
      itemDiscount,
    } = req.body;

    // Ensure required fields are present
    if (
      !entityName ||
      !entityAddress ||
      !tax ||
      !discount ||
      !itemTax ||
      !itemDiscount
    ) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided" });
    }

    // Check if entityName already exists
    const checkMasterSql = `SELECT * FROM masterTabele WHERE entityName = ?`;
    const existingMaster = await new Promise((resolve, reject) => {
      db.query(checkMasterSql, [entityName], (err, result) => {
        if (err) {
          console.error("Error:", err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    if (existingMaster.length > 0) {
      // Record exists, update the record
      const updateSql = `
        UPDATE masterTabele SET
        entityName = ?,
        entityAddress = ?,
        tax = ?,
        discount = ?,
        itemTax = ?,
        itemDiscount = ?,
        visibility = 1
        WHERE entityName = ?
      `;

      const updateValues = [
        entityName,
        entityAddress,
        tax,
        discount,
        itemTax,
        itemDiscount,
        entityName, // This is the condition for the WHERE clause
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

      return res.status(200).json({ message: "Record updated successfully" });
    } else {
      // Record does not exist, insert a new record
      const insertSql = `
        INSERT INTO masterTabele (
          master_id,
          entityName,
          entityAddress,
          tax,
          discount,
          itemTax,
          itemDiscount,
          visibility
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, 1)`;

      const insertValues = [
        uuidv4(), // Generate a new UUID for master_id
        entityName,
        entityAddress,
        tax,
        discount,
        itemTax,
        itemDiscount,
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

      return res.status(201).json({ message: "Record created successfully" });
    }
  } catch (err) {
    console.error("Error:", err);
    res
      .status(500)
      .json({ error: "Failed to process record", details: err.message });
  }
};

  
// {
//   /********************get supplier using userid**********************************/
// }

exports.getmasterByname = (req, res) => {

  console.log("Request Body:", req.body);

  const { entityName } = req.body;
  console.log("EntityName received:", entityName );
  if (!entityName ) {
    return res.status(400).json({ error: "EntityName is required" });
  }
const sql = "SELECT * FROM masterTabele WHERE entityName = ? AND visibility = 1";
    
  db.query(sql, [entityName], (err, results) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: "Failed to retrieve entityName details" });
    }
    console.log("Query Results:", results);
    if (results.length === 0) {
      return res.status(404).json({ error: "master not found" });
    }
    const masterTabele = results[0];
    // res.status(200).json(supplier);
    res.status(200).json({
      message: "master details retrieved successfully",
      masterTabele: masterTabele
    });
  });
};

// {
//   /***************update supplier using userid**********************************/
// }
// exports.updateSupplier = (req, res) => {
//   // Log the request body to ensure it's being received
//   console.log("Request Body:", req.body);

//   // Extract the user_id, SupplierDescription, and SupplierAddress from the JSON body
//   const { SupplierCode, SupplierDescription, SupplierAddress,visibility } = req.body;
//   console.log("SupplierCode received:", SupplierCode);
//   console.log("Supplier Description received:", SupplierDescription);
//   console.log("Supplier Address received:", SupplierAddress);

//   if (!SupplierCode || !SupplierDescription || !SupplierAddress) {
//     return res
//       .status(400)
//       .json({
//         error:
//           "SupplierCode, Supplier Description, and Supplier Address are required",
//       });
//   }

//   const sql = `
//       UPDATE suppliers 
//       SET SupplierDescription = ?, SupplierAddress = ? ,visibility = ? 
//       WHERE SupplierCode = ?
//     `;

//   const values = [SupplierDescription.trim(), SupplierAddress.trim(),  visibility !== undefined ? visibility : 1,  SupplierCode];

//   db.query(sql, values, (err, result) => {
//     if (err) {
//       console.error("Database Error:", err);
//       return res.status(500).json({ error: "Failed to update supplier" });
//     }

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: "Supplier not found" });
//     }

//     res.status(200).json({ message: "Supplier updated successfully" });
//   });
// };

// {
//   /**********************delete supplier using userid*************************************88 */
// }


// exports.deleteSupplier = (req, res) => {
//   const { SupplierCode } = req.body;
//   if (!SupplierCode) {
//     return res.status(400).json({ error: "SupplierCode is required" });
//   }

//   const sql = "UPDATE suppliers SET visibility = 0 WHERE SupplierCode = ?";
//   db.query(sql, [SupplierCode], (err, result) => {
//     if (err) {
//       console.error("Database Error:", err);
//       return res.status(500).json({ error: "Failed to update supplier visibility" });
//     }

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: "Supplier not found" });
//     }

//     res.status(200).json({ message: "Supplier delete successfully" });
//   });
// };



// // Get all Supplier
// exports.getAllSupplier = (req, res) => {
//   const sql = "SELECT * FROM suppliers WHERE visibility = 1";

//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error("Database Error:", err);
//       return res.status(500).json({ error: "Failed to retrieve products" });
//     }
//     res.status(200).json(results);
//   });
// };


// // Check supplier exist
// exports.checkSupplier = (req, res) => {
//   const { SupplierDescription} = req.body;

//   if (!SupplierDescription) {
//     return res.status(400).json({ error: 'Supplier description is required' });
//   }

//   const query = 'SELECT * FROM suppliers WHERE SupplierDescription = ? AND visibility = 1';
//   db.query(query, [SupplierDescription], (err, results) => {
//     if (err) {
//       console.error('Error executing query:', err);
//       return res.status(500).json({ error: 'Database query failed', details: err.message });
//     }

//     if (results.length > 0) {
//       res.status(200).json({ exists: true });
//     } else {
//       res.status(200).json({ exists: false });
//     }
//   });
// };


