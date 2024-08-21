const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const authenticateToken = require('../middleware/authenticateToken');

router.post('/createcategory',authenticateToken, categoryController.createcategory);
router.post('/getcategorybyid', authenticateToken, categoryController.getCategoryById);
router.post('/checkcategory', authenticateToken, categoryController.checkCategory);
router.post('/deletecategory', authenticateToken, categoryController.deleteCategory);
router.put('/updatecategory', authenticateToken, categoryController.updateCategory);
router.get('/getAllcategory',authenticateToken, categoryController.getAllCategory);
module.exports = router;
