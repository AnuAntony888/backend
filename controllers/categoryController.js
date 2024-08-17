const { v4: uuidv4 } = require("uuid");
const db = require("../utils/db"); // Ensure you have a proper db connection setup

// Create category
exports.createcategory = async (req, res) => {
  try {
    console.log("Received request with body:", req.body); // Log the request body

    const category = {
      category_id: uuidv4(), // Correctly named as category_id
      CategoryDescription: req.body.CategoryDescription.trim(),
      visibility: 1, // Set visibility to 1 for newly created category
    };

    // Get the maximum CategoryCode from the database
    const getMaxCodeSql = `SELECT MAX(CategoryCode) AS maxCode FROM category`;

    const maxCodeResult = await new Promise((resolve, reject) => {
      db.query(getMaxCodeSql, (err, result) => {
        if (err) {
          console.error("Database Error:", err);
          return reject(err);
        }
        resolve(result[0].maxCode);
      });
    });

    // Generate the new CategoryCode
    let newCategoryCode = "000001"; // Default starting code
    if (maxCodeResult) {
      const maxCode = parseInt(maxCodeResult, 10);
      newCategoryCode = (maxCode + 1).toString().padStart(6, "0");
    }

    console.log("New CategoryCode:", newCategoryCode); // Log for debugging

    // Insert the new category into the database
    const sql = `
      INSERT INTO category (category_id, CategoryCode, CategoryDescription, visibility)
      VALUES (?, ?, ?, ?)
    `;

    const values = [
      category.category_id,
      newCategoryCode,
      category.CategoryDescription,
      category.visibility,
    ];

    console.log("Executing SQL:", sql, "with values:", values); // Log SQL execution

    await new Promise((resolve, reject) => {
      db.query(sql, values, (err, result) => {
        if (err) {
          console.error("Database Error:", err);
          console.error("SQL Query:", sql);
          console.error("Category Data:", category);
          return reject(err); // Reject the promise on error
        }
        resolve(result); // Resolve the promise on success
      });
    });

    res.status(201).json({ message: "Category added successfully" });
  } catch (err) {
    console.error("Error:", err);
    res
      .status(500)
      .json({ error: "Failed to add category", details: err.message });
  }
};

{
  /********************get supplier using userid**********************************/
}

exports.getCategoryById = (req, res) => {
  console.log("Request Body:", req.body);

  const { CategoryCode } = req.body;

  console.log("CategoryCode received:", CategoryCode);

  if (!CategoryCode) {
    return res.status(400).json({ error: "CategoryCode is required" });
  }
  const sql =
    "SELECT * FROM category WHERE CategoryCode = ? AND visibility = 1";

  db.query(sql, [CategoryCode], (err, results) => {
    if (err) {
      console.error("Database Error:", err);
      return res
        .status(500)
        .json({ error: "Failed to retrieve supplier details" });
    }
    console.log("Query Results:", results);
    if (results.length === 0) {
      return res.status(404).json({ error: "category not found" });
    }
    const category = results[0];

    res.status(200).json({
      message: "category details retrieved successfully",
      category: category,
    });
  });
};

{
  /***************update supplier using userid**********************************/
}
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
exports.checkCategory = (req, res) => {
  const { CategoryDescription } = req.body;

  if (!CategoryDescription) {
    return res.status(400).json({ error: "category description is required" });
  }

  const query =
    "SELECT * FROM category WHERE CategoryDescription = ? AND visibility = 1";
  db.query(query, [CategoryDescription], (err, results) => {
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

{
  /**********************delete supplier using userid*************************************88 */
}

exports.deleteCategory = (req, res) => {
  const { CategoryCode } = req.body;
  if (!CategoryCode) {
    return res.status(400).json({ error: "CategoryCode is required" });
  }

  const sql = "UPDATE category SET visibility = 0 WHERE CategoryCode = ?";
  db.query(sql, [CategoryCode], (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      return res
        .status(500)
        .json({ error: "Failed to update supplier visibility" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json({ message: "Category delete successfully" });
  });
};

{
  /***************update supplier using userid**********************************/
}
exports.updateCategory = (req, res) => {
  // Log the request body to ensure it's being received
  console.log("Request Body:", req.body);

  // Extract the CategoryCode, CategoryDescription, and visibility from the request body
  const { CategoryCode, CategoryDescription, visibility } = req.body;
  console.log("CategoryCode received:", CategoryCode);
  console.log("CategoryDescription received:", CategoryDescription);

  // Validate input
  if (!CategoryCode || !CategoryDescription) {
    return res.status(400).json({
      error: "CategoryCode and CategoryDescription are required",
    });
  }

  // SQL query to update the category
  const sql = `
    UPDATE category 
    SET CategoryDescription = ?, visibility = ? 
    WHERE CategoryCode = ?
  `;

  // Prepare values for the SQL query
  const values = [
    CategoryDescription.trim(),
    visibility !== undefined ? visibility : 1, // Default visibility to 1 if not provided
    CategoryCode
  ];

  // Execute the SQL query
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: "Failed to update category" });
    }

    // Check if any rows were affected
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json({ message: "Category updated successfully" });
  });
};
