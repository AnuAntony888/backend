const db = require("../utils/db");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

// Function to ensure the directory exists
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Path to store uploaded files
const uploadsDir = path.join(__dirname, "../uploads");
ensureDirectoryExists(uploadsDir);
console.log(uploadsDir, "uploadsDir");
// Set up storage engine for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureDirectoryExists(uploadsDir);
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage }).array("images", 10);

const uploadFiles = (req) => {
  return new Promise((resolve, reject) => {
    upload(req, {}, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(req.files);
      }
    });
  });
};

//insert into product

exports.createProduct = async (req, res) => {
  try {
    const files = await uploadFiles(req);

    console.log("Files Uploaded:", files);
    console.log("Request Body:", req.body);

    // Clean up field names by trimming whitespace
    const product = {
      name: req.body.name.trim(),
      description: req.body.description.trim(),
      unit_price: req.body.unit_price.trim(),
      product_id: uuidv4(),
      barcode: uuidv4(), // Generate unique barcode using uuidv4
      images: JSON.stringify(files.map((file) => file.path)),
    };

    // Explicitly list column names with correct field names
    const sql = `
      INSERT INTO products (name, description, unit_price, product_id,barcode,images)
      VALUES (?, ?, ?, ?, ?,?)
    `;

    const values = [
      product.name,
      product.description,
      product.unit_price,
      product.product_id,
      product.barcode,
      product.images,
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Database Error:", err);
        console.error("SQL Query:", sql);
        console.error("Product Data:", product);
        return res
          .status(500)
          .json({ error: "Failed to add product", details: err.message });
      }
      res.status(201).json({ message: "Product added successfully" });
    });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: "Failed to upload files" });
  }
};

// Get all products
exports.getAllProducts = (req, res) => {
  const sql = "SELECT * FROM products";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: "Failed to retrieve products" });
    }
    res.status(200).json(results);
  });
};

// Controller to get product by barcode
exports.getProductByBarcode = (req, res) => {
  // Log the request body to ensure it's being received
  console.log("Request Body:", req.body);
  // Extract the barcode from the JSON body
  const { barcode } = req.body;
  console.log("Barcode received:", barcode);
  if (!barcode) {
    return res.status(400).json({ error: "Barcode is required" });
  }
  const sql = "SELECT * FROM products WHERE barcode = ?";
  db.query(sql, [barcode], (err, results) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: "Failed to retrieve product" });
    }
    console.log("Query Results:", results);
    if (results.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    const product = results[0];
    product.images = JSON.parse(product.images); // Assuming images are stored as JSON
    res.status(200).json(product);
  });
};
