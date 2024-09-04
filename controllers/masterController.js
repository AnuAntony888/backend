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
    const checkMasterSql = `SELECT * FROM mastertabele WHERE entityName = ?`;
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
        UPDATE mastertabele SET
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
        INSERT INTO mastertabele (
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
const sql = "SELECT * FROM mastertabele WHERE entityName = ? AND visibility = 1";
    
  db.query(sql, [entityName], (err, results) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: "Failed to retrieve entityName details" });
    }
    console.log("Query Results:", results);
    if (results.length === 0) {
      return res.status(404).json({ error: "master not found" });
    }
    const mastertabele = results[0];
    // res.status(200).json(supplier);
    res.status(200).json({
      message: "master details retrieved successfully",
      masterTabele: mastertabele
    });
  });
};

// Get all Supplier
// exports.getAllMaster = (req, res) => {
//   const sql = "SELECT * FROM masterTabele WHERE visibility = 1";

//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error("Database Error:", err);
//       return res.status(500).json({ error: "Failed to retrieve products" });
//     }
//     res.status(200).json(results);
//   });
// };
exports.getAllMaster = async (req, res) => {
  const sql = "SELECT * FROM mastertabele WHERE visibility = 1";

  try {
    const results = await new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });

    res.status(200).json(results);
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).json({ error: "Failed to retrieve products" });
  }
};
