const express = require("express");

const handleProduct = require("../controller/ProductController");

const router = express.Router();

const handleVariant = require("../controller/variantProductController");

router
  .route("/")
  .get(handleProduct.getProducts)
  .post(handleProduct.createProduct);

router.route("/tabContent").get(handleProduct.tabContent);
router.route("/mainPage").get(handleProduct.getHomePageProduct);

router.route("/:id").get(handleProduct.getProduct);

// thêm các tuỳ chọn sản phẩm
router.route("/addVariantProduct").post(handleVariant.addVariantProduct);

module.exports = router;
