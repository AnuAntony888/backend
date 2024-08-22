const express = require("express");
const router = express.Router();
const IteamController = require("../controllers/IteamController");
const authenticateToken = require('../middleware/authenticateToken');

router.post('/createiteam',authenticateToken, IteamController.createIteame);
 router.post('/getitembyitemcode',authenticateToken, IteamController.getItemByItemcode); // Endpoint to get supplier details by user_id
router.put('/updateitem',authenticateToken, IteamController.updateItem);
router.post('/deleteitem', authenticateToken, IteamController.deleteItem);
router.get('/getAllItems', authenticateToken, IteamController.getAllItems);
router.post('/getItemsBySupplierName',authenticateToken,IteamController.getItemsBySupplierName);
module.exports = router;
