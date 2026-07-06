const express = require("express");
const router = express.Router();
const authcontroller = require("../controller/authcontroller");
const { authProtectMiddleware } = require("../middleware/authMiddleware");

// Register route
router.post("/register", authcontroller.registerUser);

// Login route
router.post("/login", authcontroller.loginUser);

//all users route
router.get("/Allusers", authcontroller.users);

module.exports = router;

