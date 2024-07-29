const { v4: uuidv4 } = require("uuid");
const db = require("../utils/db"); // Ensure you have a proper db connection setup

exports.createIteame = async (req, res) => {
  try {
    // Extract the data from the request body
    const {
      ItemCode,
      ItemDescription,
      ItemSupplier,
      ItemUnit,
      ItemTax,
      IteamDiscount,
      IteamPrice,
    } = req.body;

    // Validate required fields for inserting
    if (
      !ItemCode ||
      !ItemDescription ||
      !ItemUnit ||
      !ItemTax ||
      !IteamDiscount ||
      !IteamPrice
    ) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided" });
    }

    // Ensure ItemSupplier is an array
    const newSuppliers = Array.isArray(ItemSupplier)
      ? ItemSupplier
      : [ItemSupplier];

    // Check if ItemCode exists
    const checkSql = `SELECT * FROM iteamTabele WHERE ItemCode = ?`;
    db.query(checkSql, [ItemCode], async (err, rows) => {
      if (err) {
        console.error("Error:", err);
        return res
          .status(500)
          .json({ error: "Database query failed", details: err.message });
      }

      if (rows.length > 0) {
        // If ItemCode exists, update the existing record
        const existingItem = rows[0];
        const existingSuppliers = JSON.parse(existingItem.ItemSupplier || "[]"); // Parse existing suppliers

        // Merge and deduplicate suppliers
        const updatedSuppliers = [
          ...new Set([...existingSuppliers, ...newSuppliers]),
        ]; // Merge and deduplicate

        const updateSql = `
          UPDATE iteamTabele
          SET 
            ItemDescription = ?, 
            ItemSupplier = ?, 
            ItemUnit = ?, 
            ItemTax = ?, 
            IteamDiscount = ?, 
            IteamPrice = ?
          WHERE ItemCode = ?
        `;
        const updateValues = [
          ItemDescription,
          JSON.stringify(updatedSuppliers), // Convert to JSON string
          ItemUnit,
          ItemTax,
          IteamDiscount,
          IteamPrice,
          ItemCode,
        ];

        db.query(updateSql, updateValues, (err, result) => {
          if (err) {
            console.error("Error:", err);
            return res
              .status(500)
              .json({ error: "Database update failed", details: err.message });
          }

          res.status(200).json({ message: "Item updated successfully" });
        });
      } else {
        // If ItemCode does not exist, insert a new record
        const insertSql = `
          INSERT INTO iteamTabele (
            user_id,
            ItemCode,
            ItemDescription,
            ItemSupplier,
            ItemUnit,
            ItemTax,
            IteamDiscount,
            IteamPrice
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const insertValues = [
          uuidv4(), // Generate a new UUID for user_id or get from req.body if provided
          ItemCode,
          ItemDescription,
          JSON.stringify(newSuppliers), // Convert to JSON string
          ItemUnit,
          ItemTax,
          IteamDiscount,
          IteamPrice,
        ];

        db.query(insertSql, insertValues, (err, result) => {
          if (err) {
            console.error("Error:", err);
            return res
              .status(500)
              .json({ error: "Database insert failed", details: err.message });
          }

          res.status(201).json({ message: "Item created successfully" });
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
{
  /*****************************************************************8 */
}
exports.getItemByItemcode = (req, res) => {
  // Log the request body to ensure it's being received
  console.log("Request Body:", req.body);
  // Extract the barcode from the JSON body
  const { ItemCode } = req.body;
  console.log("ItemCode received:", ItemCode);
  if (!ItemCode) {
    return res.status(400).json({ error: "ItemCode is required" });
  }
  const sql = "SELECT * FROM iteamtabele WHERE ItemCode = ?";
  db.query(sql, [ItemCode], (err, results) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: "Failed to retrieve product" });
    }
    console.log("Query Results:", results);
    if (results.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    // const supplier = results[0];
    res.status(200).json(results);
  });
};

{
  /***************update supplier using userid**********************************/
}
//   exports.updateSupplier = (req, res) => {
//     // Log the request body to ensure it's being received
//     console.log("Request Body:", req.body);

//     // Extract the user_id, SupplierDescription, and SupplierAddress from the JSON body
//     const { user_id, SupplierDescription, SupplierAddress } = req.body;
//     console.log("User ID received:", user_id);
//     console.log("Supplier Description received:", SupplierDescription);
//     console.log("Supplier Address received:", SupplierAddress);

//     if (!user_id || !SupplierDescription || !SupplierAddress) {
//       return res.status(400).json({ error: "User ID, Supplier Description, and Supplier Address are required" });
//     }

//     const sql = `
//       UPDATE suppliers
//       SET SupplierDescription = ?, SupplierAddress = ?
//       WHERE user_id = ?
//     `;

//     const values = [SupplierDescription.trim(), SupplierAddress.trim(), user_id];

//     db.query(sql, values, (err, result) => {
//       if (err) {
//         console.error("Database Error:", err);
//         return res.status(500).json({ error: "Failed to update supplier" });
//       }

//       if (result.affectedRows === 0) {
//         return res.status(404).json({ error: "Supplier not found" });
//       }

//       res.status(200).json({ message: "Supplier updated successfully" });
//     });
//   };

{
  /**********************delete supplier using userid*************************************88 */
}
//   exports.deleteSupplier = (req, res) => {
//     // Log the request body to ensure it's being received
//     console.log("Request Body:", req.body);

//     // Extract the user_id from the JSON body
//     const { user_id } = req.body;
//     console.log("User ID received:", user_id);

//     if (!user_id) {
//       return res.status(400).json({ error: "User ID is required" });
//     }

//     const sql = "DELETE FROM suppliers WHERE user_id = ?";

//     db.query(sql, [user_id], (err, result) => {
//       if (err) {
//         console.error("Database Error:", err);
//         return res.status(500).json({ error: "Failed to delete supplier" });
//       }

//       if (result.affectedRows === 0) {
//         return res.status(404).json({ error: "Supplier not found" });
//       }

//       res.status(200).json({ message: "Supplier deleted successfully" });
//     });
//   };

// Get all Supplier
// exports.getAllSupplier = (req, res) => {
//   const sql = "SELECT * FROM suppliers";

//   db.query(sql, (err, results) => {
//     if (err) {
//       console.error("Database Error:", err);
//       return res.status(500).json({ error: "Failed to retrieve products" });
//     }
//     res.status(200).json(results);
//   });
// };
