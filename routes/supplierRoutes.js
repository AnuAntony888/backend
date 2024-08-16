const express = require("express");
const router = express.Router();
const suppilerController = require("../controllers/suppilerController");
const authenticateToken = require('../middleware/authenticateToken');

router.post('/createsuplier',authenticateToken, suppilerController.createSupplier);
router.post('/getsuplier',authenticateToken, suppilerController.getSupplierById); // Endpoint to get supplier details by user_id
router.put('/updatesuplier',authenticateToken, suppilerController.updateSupplier); // Endpoint to update supplier details by user_id
router.post('/deletesuplier',authenticateToken, suppilerController.deleteSupplier); // Endpoint to delete supplier details by user_id
router.get('/getAllsuplier',authenticateToken, suppilerController.getAllSupplier);
router.post('/check-supplier',authenticateToken, suppilerController.checkSupplier);
module.exports = router;
