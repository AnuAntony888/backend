const express = require("express");
const router = express.Router();
const suppilerController = require("../controllers/suppilerController");


router.post('/createsuplier', suppilerController.createSupplier);
router.post('/getsuplier', suppilerController.getSupplierById); // Endpoint to get supplier details by user_id
router.put('/updatesuplier', suppilerController.updateSupplier); // Endpoint to update supplier details by user_id
router.delete('/deletesuplier', suppilerController.deleteSupplier); // Endpoint to delete supplier details by user_id
router.get('/getAllsuplier', suppilerController.getAllSupplier);
module.exports = router;
