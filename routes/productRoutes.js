const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authenticateToken = require('../middleware/authenticateToken');

// Define routes
router.post("/addproduct",  productController.createProduct);


module.exports = router;
