const express = require("express");
const router = express.Router();
const InvoiceController = require("../controllers/invoiceController");


router.post('/insertinvoice', InvoiceController.createinvoice);

module.exports = router;