const express = require("express");

const handleProduct = require("../controller/ProductController");

const router = express.Router();

router
  .route("/")
  .get(handleProduct.getProducts)
  .post(handleProduct.createProduct);

router.route("/mainPage").get(handleProduct.getHomePageProduct);

module.exports = router;
