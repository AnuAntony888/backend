const express = require("express");
const router = express.Router();
const InvoiceController = require("../controllers/invoiceController");
const authenticateToken = require('../middleware/authenticateToken');

router.post('/insertinvoice',authenticateToken, InvoiceController.createinvoice);
router.post('/getinvoice', InvoiceController.getInvoiceAndCustomerDetails);
module.exports = router;