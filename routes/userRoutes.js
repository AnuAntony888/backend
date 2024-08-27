const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController"); // Use userController
const authenticateToken = require('../middleware/authenticateToken');

// Define routes
router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post('/logout',authenticateToken,userController.logout); // Use userController
// router.get('/allusers', authenticateToken, userController.getAllUsers); // Use userController
router.post('/getuserbyemail', authenticateToken, userController.getUserByEmail); // Use userController
router.put('/updateuser', authenticateToken, userController.updateUser); // Use userController
router.post('/deleteuser', authenticateToken, userController.deleteuser);
router.get('/getallemployee', authenticateToken, userController.getAllVisibleEmployees); 
router.post('/generate-employee-number', userController.generateemployeeNumber);
module.exports = router;

