const express = require("express");
const router = express.Router();
const CustomerController = require("../controllers/customerConroller");
const authenticateToken = require('../middleware/authenticateToken');

router.post('/createcustomer',authenticateToken, CustomerController.createCustomer);
router.post('/getcustomerbycontact_no',authenticateToken, CustomerController.getCustomerById); // Endpoint to get supplier details by user_id
// router.put('/updateitem', IteamController.updateItem);
// router.delete('/deleteitem', IteamController.deleteItem);
module.exports = router;