const express = require("express");

const router = express.Router();

const handleAuth = require("../controller/authController");

const handleCustomer = require("../controller/userController");

const handleCart = require("../controller/cartController");

const handleOrder = require("../controller/orderController");

router.post("/signup", handleAuth.signup);

router.post("/login", handleAuth.login);

router.get("/getUserProfile", handleAuth.protect, handleCustomer.getProfile);

router.post("/logOut", handleAuth.logOut);

router.post("/updateProfile", handleAuth.protect, handleCustomer.updateProfile); // chỉnh sửa lại patch

// thêm vào giỏ hàng
router.post("/addToCart", handleAuth.protect, handleCart.addToCart);

router.get("/userCart", handleAuth.protect, handleCart.getUserCart);

router.patch("/updateCart", handleAuth.protect, handleCart.updateCart);

// xử lý order

router
  .route("/userOrder")
  .get(handleAuth.protect, handleOrder.getOrder)
  .post(handleAuth.protect, handleOrder.createOrder);

module.exports = router;
