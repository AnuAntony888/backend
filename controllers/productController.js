

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
console.log(uploadsDir,"uploadsDir")
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
      images: JSON.stringify(files.map((file) => file.path))
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
      product.images
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Database Error:", err);
        console.error("SQL Query:", sql);
        console.error("Product Data:", product);
        return res.status(500).json({ error: "Failed to add product", details: err.message });
      }
      res.status(201).json({ message: "Product added successfully" });
    });

  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: "Failed to upload files" });
  }
};