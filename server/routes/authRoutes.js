const express = require("express");
const router = express.Router();

const { register, login, logout, isAuthenticated } = require("../controllers/authController");
const { authenticateUser } = require("../middleware/authentication");
router.post("/register", register);
router.post("/login", login);
router.get("/logout", authenticateUser, logout);
router.get("/isAuthenticated", isAuthenticated);

module.exports = router;
