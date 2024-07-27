const express = require("express");
const router = express.Router();
const IteamController = require("../controllers/IteamController");


router.post('/createiteam', IteamController.createIteame);
router.post('/getitembyitemcode', IteamController.getItemByItemcode); // Endpoint to get supplier details by user_id
module.exports = router;
