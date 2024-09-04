const { v4: uuidv4 } = require("uuid");
const db = require("../utils/db"); // Ensure you have a proper db connection setup

// Create category
// exports.createcategory = async (req, res) => {
//   try {
//     console.log("Received request with body:", req.body); // Log the request body

//     const category = {
//       category_id: uuidv4(), // Correctly named as category_id
//       CategoryDescription: req.body.CategoryDescription.trim(),
//       visibility: 1, // Set visibility to 1 for newly created category
//       created_timestamp: req.body.created_timestamp.trim(), // Add created_timestamp
//       created_by: req.body.created_by.trim(), // Add created_by
//       master_id: req.body.master_id.trim(),
//     };

//     // Get the maximum CategoryCode from the database
//     const getMaxCodeSql = `SELECT MAX(CategoryCode) AS maxCode FROM category`;

//     const maxCodeResult = await new Promise((resolve, reject) => {
//       db.query(getMaxCodeSql, (err, result) => {
//         if (err) {
//           console.error("Database Error:", err);
//           return reject(err);
//         }
//         resolve(result[0].maxCode);
//       });
//     });

//     // Generate the new CategoryCode
//     let newCategoryCode = "000001"; // Default starting code
//     if (maxCodeResult) {
//       const maxCode = parseInt(maxCodeResult, 10);
//       newCategoryCode = (maxCode + 1).toString().padStart(6, "0");
//     }

//     console.log("New CategoryCode:", newCategoryCode); // Log for debugging

//     // Insert the new category into the database
//     const sql = `
//       INSERT INTO category (category_id, CategoryCode, CategoryDescription, visibility,
//       created_timestamp, created_by,master_id)
//       VALUES (?, ?, ?, ?,?,?,?)
//     `;

//     const values = [
//       category.category_id,
//       newCategoryCode,
//       category.CategoryDescription,
//       category.visibility,
//       category.created_timestamp,
//       category.created_by,
//       category.master_id
//     ];

//     console.log("Executing SQL:", sql, "with values:", values); // Log SQL execution

//     await new Promise((resolve, reject) => {
//       db.query(sql, values, (err, result) => {
//         if (err) {
//           console.error("Database Error:", err);
//           console.error("SQL Query:", sql);
//           console.error("Category Data:", category);
//           return reject(err); // Reject the promise on error
//         }
//         resolve(result); // Resolve the promise on success
//       });
//     });

//     res.status(201).json({ message: "Category added successfully" });
//   } catch (err) {
//     console.error("Error:", err);
//     res
//       .status(500)
//       .json({ error: "Failed to add category", details: err.message });
//   }
// };


exports.createcategory = async (req, res) => {
  try {
    // Extract and clean up field values from req.body
    const {
      CategoryDescription,
      created_timestamp = new Date().toISOString(), // Default to current timestamp if not provided
      created_by = 'unknown', // Default to 'unknown' if not provided
      master_id
    } = req.body;

    // Validate required fields
    if (!CategoryDescription || !master_id) {
      return res.status(400).json({ error: "CategoryDescription and master_id are required" });
    }

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
      INSERT INTO category (category_id, CategoryCode, CategoryDescription, visibility,
      created_timestamp, created_by, master_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      uuidv4(), // Generate a new UUID for category_id
      newCategoryCode,
      CategoryDescription,
      1, // Set visibility to 1 for newly created category
      created_timestamp,
      created_by,
      master_id
    ];

    console.log("Executing SQL:", sql, "with values:", values); // Log SQL execution

    await new Promise((resolve, reject) => {
      db.query(sql, values, (err, result) => {
        if (err) {
          console.error("Database Error:", err);
          console.error("SQL Query:", sql);
          console.error("Category Data:", values);
          return reject(err); // Reject the promise on error
        }
        resolve(result); // Resolve the promise on success
      });
    });

    res.status(201).json({ message: "Category added successfully" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to add category", details: err.message });
  }
};

{
  /********************get supplier using userid**********************************/
}

exports.getCategoryById = (req, res) => {
  console.log("Request Body:", req.body);

  const { CategoryCode , master_id} = req.body;

  console.log("CategoryCode received:", CategoryCode);

  if (!CategoryCode || !master_id) {
    return res.status(400).json({ error: "CategoryCode and master_id is required" });
  }
  const sql =
    "SELECT * FROM category WHERE CategoryCode = ? AND master_id = ? AND visibility = 1";

  db.query(sql, [CategoryCode,master_id ] ,(err, results) => {
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
  const { CategoryCode,
    deleted_timestamp, deleted_by 
  } = req.body;
  if (!CategoryCode) {
    return res.status(400).json({ error: "CategoryCode is required" });
  }

  const sql = "UPDATE category SET visibility = ? ,deleted_timestamp =?,deleted_by =?  WHERE CategoryCode = ?";
  const values = [
    (visibility = 0),
    deleted_timestamp,
    deleted_by,
   CategoryCode,
  ];
  db.query(sql,values,  (err, result) => {
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
  const { CategoryCode, CategoryDescription, visibility,
    updated_timestamp,
    updated_by,
    master_id,
  } = req.body;
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
    SET CategoryDescription = ?, visibility = ?  ,   updated_timestamp=?,
    updated_by =? ,master_id = ?
    WHERE CategoryCode = ?
  `;

  // Prepare values for the SQL query
  const values = [
    // CategoryDescription.trim(),
    // visibility !== undefined ? visibility : 1,
    // updated_timestamp ? updated_timestamp.trim() : null,
    // updated_by ? updated_by.trim() : null,
    // master_id ? master_id.trim() : null,
    // CategoryCode
      CategoryDescription||'',
    visibility !== undefined ? visibility : 1,
    updated_timestamp || new Date().toISOString(),
    updated_by || null,
    master_id || '',
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


//get all category

exports.getAllCategory = (req, res) => {
  const { master_id } = req.body;

  if (!master_id) {
    return res.status(400).json({ error: "master_id is required" });
  }
  const sql = "SELECT * FROM category  WHERE master_id = ? AND visibility = 1";

  db.query(sql,[master_id], (err, results) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: "Failed to retrieve products" });
    }
    res.status(200).json(results);
  });
};

