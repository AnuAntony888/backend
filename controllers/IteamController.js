const { v4: uuidv4 } = require("uuid");
const db = require("../utils/db"); // Ensure you have a proper db connection setup


exports.createIteame = async (req, res) => {
  try {
    const {
      ItemCode,
      ItemDescription,
      ItemSupplier,
      ItemUnit,
      ItemTax,
      IteamDiscount,
      IteamPrice,
      Iteamstock,
      visibility = 1 // Default visibility to 1
    } = req.body;

    console.log("Received request body:", req.body);

    if (
      !ItemCode ||
      !ItemDescription ||
      !ItemSupplier ||
      !ItemUnit ||
      !ItemTax ||
      !IteamDiscount ||
      !IteamPrice ||
      !Iteamstock
    ) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    const getSupplierSql = `SELECT user_id FROM suppliers WHERE SupplierDescription = ?`;
    db.query(getSupplierSql, [ItemSupplier], (err, supplierRows) => {
      if (err) {
        console.error("Error:", err);
        return res.status(500).json({ error: "Database query failed", details: err.message });
      }

      if (supplierRows.length === 0) {
        return res.status(400).json({ error: "Supplier not found" });
      }

      const supplierID = supplierRows[0].user_id;

      const checkSql = `SELECT * FROM iteamTabele WHERE ItemCode = ? AND ItemSupplier = ?`;
      db.query(checkSql, [ItemCode, supplierID], (err, existingItems) => {
        if (err) {
          console.error("Error:", err);
          return res.status(500).json({ error: "Database query failed", details: err.message });
        }

        if (existingItems.length > 0) {
          return res.status(500).json({ error: "Item with the same ItemCode and Supplier already exists" });
        }

        const insertSql = `
          INSERT INTO iteamTabele (
            product_id,
            ItemCode,
            ItemDescription,
            ItemSupplier,
            ItemUnit,
            ItemTax,
            IteamDiscount,
            IteamPrice,
            Iteamstock,
            visibility
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const insertValues = [
          uuidv4(),
          ItemCode,
          ItemDescription,
          supplierID,
          ItemUnit,
          ItemTax,
          IteamDiscount,
          IteamPrice,
          Iteamstock,
          visibility // Include visibility in insert
        ];

        db.query(insertSql, insertValues, (err, result) => {
          if (err) {
            console.error("Error:", err);
            return res.status(500).json({ error: "Database insert failed", details: err.message });
          }

          res.status(201).json({ message: "Item created successfully" });
        });
      });
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to process item", details: err.message });
  }
};

{
  /*****************************************************************8 */
}

exports.getItemByItemcode = (req, res) => {
  // Log the request body to ensure it's being received
  console.log("Request Body:", req.body);

  // Extract the ItemCode from the JSON body
  const { ItemCode } = req.body;
  console.log("ItemCode received:", ItemCode);

  if (!ItemCode) {
    return res.status(400).json({ error: "ItemCode is required" });
  }

  // Query to get item details
  const getItemSql = "SELECT * FROM iteamtabele WHERE ItemCode = ? AND visibility = 1";
  db.query(getItemSql, [ItemCode], (err, itemResults) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: "Failed to retrieve product" });
    }

    if (itemResults.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Extract ItemSupplier ID from item results
    const items = itemResults;
    const supplierIds = [...new Set(items.map((item) => item.ItemSupplier))]; // Get unique supplier IDs

    // Query to get supplier descriptions
    const getSupplierSql =
      "SELECT user_id, SupplierDescription FROM suppliers WHERE user_id IN (?)";
    db.query(getSupplierSql, [supplierIds], (err, supplierResults) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ error: "Failed to retrieve suppliers" });
      }

      // Create a mapping of supplier IDs to descriptions
      const supplierMap = {};
      supplierResults.forEach((supplier) => {
        supplierMap[supplier.user_id] = supplier.SupplierDescription;
      });

      // Replace ItemSupplier ID with SupplierDescription
      const updatedItems = items.map((item) => ({
        ...item,
        ItemSupplier: supplierMap[item.ItemSupplier] || item.ItemSupplier, // Use description or keep ID if not found
      }));

      // Send combined result to the frontend
      res.status(200).json(updatedItems);
    });
  });
};

{
  /***************update supplier using userid**********************************/
}
exports.updateItem = (req, res) => {
  console.log("Request Body:", req.body);

  const {
    ItemCode,
    ItemDescription,

    ItemUnit,
    ItemTax,
    IteamDiscount,
    IteamPrice,
    Iteamstock,
    visibility 
  } = req.body;

  // Validate required fields for updating
  if (
    !ItemCode ||
    !ItemDescription ||
    !ItemUnit ||
    !ItemTax ||
    !IteamDiscount ||
    !IteamPrice ||
    !Iteamstock
  ) {
    return res
      .status(400)
      .json({ error: "All required fields must be provided" });
  }

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
      const updateSql = `
        UPDATE iteamTabele
        SET 
          ItemDescription = ?, 
          ItemUnit = ?, 
          ItemTax = ?, 
          IteamDiscount = ?, 
          IteamPrice = ?, 
          Iteamstock = ?,
          visibility = ? 
        WHERE ItemCode = ?
      `;
      const updateValues = [
        ItemDescription,
        // JSON.stringify(existingSuppliers), // Convert to JSON string
        ItemUnit,
        ItemTax,
        IteamDiscount,
        IteamPrice,
        Iteamstock, // Place Iteamstock before ItemCode
        visibility !== undefined ? visibility : 1,
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
      return res.status(404).json({ error: "Item not found" });
    }
  });
};

{
  /**********************delete supplier using userid*************************************88 */
}
exports.deleteItem = (req, res) => {
  console.log("Request Body:", req.body);

  const { ItemCode } = req.body;
  console.log("ItemCode received:", ItemCode);

  if (!ItemCode) {
    return res.status(400).json({ error: "ItemCode is required" });
  }

  // Instead of deleting, update visibility to 0
  const updateSql = "UPDATE iteamTabele SET visibility = 0 WHERE ItemCode = ?";
  db.query(updateSql, [ItemCode], (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: "Failed to update Item visibility" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(200).json({ message: "Item visibility updated to hidden" });
  });
};
