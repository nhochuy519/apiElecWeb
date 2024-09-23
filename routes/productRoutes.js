const express = require("express");

const auth = require("../controller/authController");

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

// thêm các thêm sử xoá sản phẩm dành cho admin
router
  .route("/variantProduct")
  .post(
    auth.protect,
    auth.restrictTo("admin", "customer"),
    handleVariant.addVariantProduct,
  )
  .patch(
    auth.protect,
    auth.restrictTo("admin", "customer"),
    handleVariant.upDateVrProduct,
  )
  .delete(
    auth.protect,
    auth.restrictTo("admin", "customer"),
    handleVariant.deleteVrProduct,
  );

module.exports = router;
