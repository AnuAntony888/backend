const express = require("express");
const router = express.Router();
const CustomerController = require("../controllers/customerConroller");


router.post('/createcustomer', CustomerController.createCustomer);
//  router.post('/getitembyitemcode', IteamController.getItemByItemcode); // Endpoint to get supplier details by user_id
// router.put('/updateitem', IteamController.updateItem);
// router.delete('/deleteitem', IteamController.deleteItem);
module.exports = router;