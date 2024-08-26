const express = require("express");
const router = express.Router();
const masterController = require("../controllers/masterController");
const authenticateToken = require('../middleware/authenticateToken');

router.post('/createmaster', authenticateToken, masterController.createmaster);
router.post('/getmasterbyname', authenticateToken, masterController.getmasterByname);
router.get('/getAllMaster', authenticateToken, masterController.getAllMaster);
console.log(authenticateToken, "authenticateToken");
module.exports = router;

