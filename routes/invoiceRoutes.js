const express = require("express");
const router = express.Router();
const InvoiceController = require("../controllers/invoiceController");
const authenticateToken = require('../middleware/authenticateToken');

router.post('/insertinvoice',authenticateToken, InvoiceController.createinvoice);
router.post('/getinvoice', InvoiceController.getInvoiceAndCustomerDetails);
router.post('/generate-invoice-number', InvoiceController.generateInvoiceNumber);
router.post('/deleteinvoice', authenticateToken, InvoiceController.deleteInvoice); 
router.post('/updateinvoice',authenticateToken, InvoiceController.updateInvoice);
module.exports = router;