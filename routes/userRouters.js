const express = require("express");

const router = express.Router();

const handleAuth = require("../controller/authController");

const handleCustomer = require("../controller/userController");

router.post("/signup", handleAuth.signup);

router.post("/login", handleAuth.login);

router.get("/getUserProfile", handleAuth.protect, handleCustomer.getProfile);

router.post("/logOut", handleAuth.logOut);

router.post("/updateProfile", handleAuth.protect, handleCustomer.updateProfile);
module.exports = router;
