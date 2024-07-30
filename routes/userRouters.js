const express = require("express");

const router = express.Router();

const handleCustomer = require("../controller/authController");

router.post("/signup", handleCustomer.signup);

router.post("/login", handleCustomer.login);
module.exports = router;
