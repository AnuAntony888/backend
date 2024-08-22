const { v4: uuidv4 } = require("uuid");
const db = require("../utils/db"); // Ensure you have a proper db connection setup

exports.createIteame = async (req, res) => {
  try {
    const {
      ItemCode,
      ItemDescription,
      ItemSupplier,
      ItemCategory,
      ItemUnit,
      ItemTax,
      IteamDiscount,
      IteamPrice,
      Iteamstock,
      visibility = 1, // Default visibility to 1
      created_timestamp,
      created_by,
    } = req.body;

    console.log("Received request body:", req.body);

    if (
      !ItemCode ||
      !ItemDescription ||
      !ItemSupplier ||
      !ItemCategory ||
      !ItemUnit ||
      !ItemTax ||
      !IteamDiscount ||
      !IteamPrice ||
      !Iteamstock ||
      !created_timestamp ||
      !created_by
    ) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided" });
    }

    const getSupplierSql = `SELECT user_id FROM suppliers WHERE SupplierDescription = ?`;
    db.query(getSupplierSql, [ItemSupplier], (err, supplierRows) => {
      if (err) {
        console.error("Error:", err);
        return res
          .status(500)
          .json({ error: "Database query failed", details: err.message });
      }

      if (supplierRows.length === 0) {
        return res.status(400).json({ error: "Supplier not found" });
      }

      const supplierID = supplierRows[0].user_id;

      const getCategorySql = `SELECT category_id FROM category WHERE CategoryDescription = ?`;
      db.query(getCategorySql, [ItemCategory], (err, categoryRows) => {
        if (err) {
          console.error("Error:", err);
          return res
            .status(500)
            .json({ error: "Database query failed", details: err.message });
        }

        if (categoryRows.length === 0) {
          return res.status(400).json({ error: "Category not found" });
        }

        const categoryID = categoryRows[0].category_id;

        const checkSql = `SELECT * FROM iteamTabele WHERE ItemCode = ? AND ItemSupplier = ?`;
        db.query(
          checkSql,
          [ItemCode, supplierID, categoryID],
          (err, existingItems) => {
            if (err) {
              console.error("Error:", err);
              return res
                .status(500)
                .json({ error: "Database query failed", details: err.message });
            }

            if (existingItems.length > 0) {
              return res.status(500).json({
                error:
                  "Item with the same ItemCode and Supplier already exists",
              });
            }

            const insertSql = `
          INSERT INTO iteamTabele (
            product_id,
            ItemCode,
            ItemDescription,
            ItemSupplier,
            ItemCategory,
            ItemUnit,
            ItemTax,
            IteamDiscount,
            IteamPrice,
            Iteamstock,
            visibility,
         created_timestamp,
      created_by
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)
        `;
            const insertValues = [
              uuidv4(),
              ItemCode,
              ItemDescription,
              supplierID,
              categoryID,
              ItemUnit,
              ItemTax,
              IteamDiscount,
              IteamPrice,
              Iteamstock,
              visibility,
              created_timestamp,
              created_by,
            ];

            db.query(insertSql, insertValues, (err, result) => {
              if (err) {
                console.error("Error:", err);
                return res.status(500).json({
                  error: "Database insert failed",
                  details: err.message,
                });
              }

              res.status(201).json({ message: "Item created successfully" });
            });
          }
        );
      });
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

  // Extract the ItemCode from the JSON body
  const { ItemCode } = req.body;
  console.log("ItemCode received:", ItemCode);

  if (!ItemCode) {
    return res.status(400).json({ error: "ItemCode is required" });
  }

  // Query to get item details
  const getItemSql =
    "SELECT * FROM iteamtabele WHERE ItemCode = ? AND visibility = 1";
  db.query(getItemSql, [ItemCode], (err, itemResults) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: "Failed to retrieve product" });
    }

    if (itemResults.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Extract ItemSupplier ID and ItemCategory ID from item results
    const items = itemResults;
    const supplierIds = [...new Set(items.map((item) => item.ItemSupplier))]; // Get unique supplier IDs
    const categoryIds = [...new Set(items.map((item) => item.ItemCategory))]; // Get unique category IDs

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

      // Query to get category descriptions
      const getCategorysSql =
        "SELECT category_id, CategoryDescription FROM category WHERE category_id IN (?)";
      db.query(getCategorysSql, [categoryIds], (err, categoryResults) => {
        if (err) {
          console.error("Database Error:", err);
          return res
            .status(500)
            .json({ error: "Failed to retrieve categories" });
        }

        // Create a mapping of category IDs to descriptions
        const categoryMap = {};
        categoryResults.forEach((category) => {
          categoryMap[category.category_id] = category.CategoryDescription;
        });

        // Replace ItemSupplier ID and ItemCategory ID with their descriptions
        const updatedItems = items.map((item) => ({
          ...item,
          ItemSupplier: supplierMap[item.ItemSupplier] || item.ItemSupplier,
          ItemCategory: categoryMap[item.ItemCategory] || item.ItemCategory,
        }));

        // Send combined result to the frontend
        res.status(200).json(updatedItems);
      });
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
    visibility,
    updated_timestamp,
    updated_by,
  } = req.body;

  // Validate required fields for updating
  if (
    !ItemCode ||
    !ItemDescription ||
    !ItemUnit ||
    !ItemTax ||
    !IteamDiscount ||
    !IteamPrice ||
    !Iteamstock ||
    !updated_timestamp ||
    !updated_by
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
          visibility = ?,
          updated_timestamp = ?,
          updated_by = ? 
        WHERE ItemCode = ?
      `;
      const updateValues = [
        ItemDescription,
        ItemUnit,
        ItemTax,
        IteamDiscount,
        IteamPrice,
        Iteamstock,
        visibility !== undefined ? visibility : 1,
        updated_timestamp ? updated_timestamp : null,
        updated_by ? updated_by : null,
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

  const { ItemCode, deleted_timestamp, deleted_by } = req.body;
  console.log("ItemCode received:", ItemCode);

  if (!ItemCode) {
    return res.status(400).json({ error: "ItemCode is required" });
  }

  // Instead of deleting, update visibility to 0
  const updateSql =
    "UPDATE iteamTabele SET visibility = ?,deleted_timestamp =?,deleted_by =? WHERE ItemCode = ?";
  const values = [(visibility = 0), deleted_timestamp, deleted_by, ItemCode];
  db.query(updateSql, values, (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      return res
        .status(500)
        .json({ error: "Failed to update Item visibility" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(200).json({ message: "Item visibility updated to hidden" });
  });
};


//get all iteam details
exports.getAllItems = (req, res) => {
  // Query to get all item details where visibility is 1
  const getItemSql = "SELECT * FROM iteamtabele WHERE visibility = 1";

  db.query(getItemSql, (err, itemResults) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: "Failed to retrieve items" });
    }

    if (itemResults.length === 0) {
      return res.status(404).json({ error: "No items found" });
    }

    // Extract unique ItemSupplier IDs and ItemCategory IDs from item results
    const supplierIds = [...new Set(itemResults.map((item) => item.ItemSupplier))];
    const categoryIds = [...new Set(itemResults.map((item) => item.ItemCategory))];

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

      // Query to get category descriptions
      const getCategorysSql =
        "SELECT category_id, CategoryDescription FROM category WHERE category_id IN (?)";
      db.query(getCategorysSql, [categoryIds], (err, categoryResults) => {
        if (err) {
          console.error("Database Error:", err);
          return res.status(500).json({ error: "Failed to retrieve categories" });
        }

        // Create a mapping of category IDs to descriptions
        const categoryMap = {};
        categoryResults.forEach((category) => {
          categoryMap[category.category_id] = category.CategoryDescription;
        });

        // Replace ItemSupplier ID and ItemCategory ID with their descriptions
        const updatedItems = itemResults.map((item) => ({
          ...item,
          ItemSupplier: supplierMap[item.ItemSupplier] || item.ItemSupplier,
          ItemCategory: categoryMap[item.ItemCategory] || item.ItemCategory,
        }));

        // Send combined result to the frontend
        res.status(200).json(updatedItems);
      });
    });
  });
};



// Function to get items by supplier name

exports.getItemsBySupplierName = (req, res) => {
  console.log("Request Body:", req.body);

  const { SupplierDescription } = req.body;
  if (!SupplierDescription) {
    return res.status(400).json({ error: "SupplierDescription is required" });
  }

  // Step 1: Get supplier ID from the suppliers table
  const getSupplierIdSql = `SELECT user_id FROM suppliers WHERE SupplierDescription = ?`;
  db.query(getSupplierIdSql, [SupplierDescription], (err, supplierRows) => {
    if (err) {
      console.error("Database Error while fetching supplier ID:", err);
      return res.status(500).json({ error: "Failed to retrieve supplier ID" });
    }

    if (supplierRows.length === 0) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    const supplierID = supplierRows[0].user_id;
    console.log("Supplier ID:", supplierID);

    // Step 2: Get items by supplier ID
    const getItemsSql = `SELECT * FROM iteamTabele WHERE ItemSupplier = ? AND visibility = 1`;
    db.query(getItemsSql, [supplierID], (err, itemResults) => {
      if (err) {
        console.error("Database Error while fetching items:", err);
        return res.status(500).json({ error: "Failed to retrieve items" });
      }

      if (itemResults.length === 0) {
        return res.status(404).json({ error: "No items found for this supplier" });
      }

      // Step 3: Fetch all suppliers to create a mapping of IDs to descriptions
      const getAllSuppliersSql = `SELECT user_id, SupplierDescription FROM suppliers`;
      db.query(getAllSuppliersSql, (err, supplierResults) => {
        if (err) {
          console.error("Database Error while fetching suppliers:", err);
          return res.status(500).json({ error: "Failed to retrieve suppliers" });
        }

        // Create a mapping of supplier IDs to descriptions
        const supplierMap = {};
        supplierResults.forEach((supplier) => {
          supplierMap[supplier.user_id] = supplier.SupplierDescription;
        });

        // Step 4: Fetch all categories to create a mapping of IDs to descriptions
        const categoryIds = itemResults.map(item => item.ItemCategory);
        const getCategoriesSql = "SELECT category_id, CategoryDescription FROM category WHERE category_id IN (?)";
        db.query(getCategoriesSql, [categoryIds], (err, categoryResults) => {
          if (err) {
            console.error("Database Error while fetching categories:", err);
            return res.status(500).json({ error: "Failed to retrieve categories" });
          }

          // Create a mapping of category IDs to descriptions
          const categoryMap = {};
          categoryResults.forEach((category) => {
            categoryMap[category.category_id] = category.CategoryDescription;
          });

          // Replace ItemSupplier ID and ItemCategory ID with their descriptions
          const updatedItems = itemResults.map((item) => ({
            ...item,
            ItemSupplier: supplierMap[item.ItemSupplier] || item.ItemSupplier,
            ItemCategory: categoryMap[item.ItemCategory] || item.ItemCategory,
          }));

          // Send the results to the frontend
          res.status(200).json(updatedItems);
        });
      });
    });
  });
};

