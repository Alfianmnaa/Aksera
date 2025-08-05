const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

// user registrasi
router.post("/register", authController.userRegistrasi);

// user masuk
router.post("/login", authController.userMasuk);

// user logout
router.get("/logout", authController.userLogout);

// user refetch
router.get("/refetch", authController.userRefetch);

module.exports = router;
