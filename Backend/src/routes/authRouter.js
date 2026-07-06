const express = require("express");
const router = express.Router();
const authcontroller = require("../controller/authcontroller");
const { authProtectMiddleware } = require("../middleware/authMiddleware");

// Register route
router.post("/api/register", authcontroller.registerUser);

// Login route
router.post("/api/login", authcontroller.loginUser);

//all users route
router.get("/api/Allusers", authcontroller.users);

module.exports = router;

