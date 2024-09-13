const { resSuccess } = require("./authController");

const VariantProduct = require("../models/variantProduct");

const Product = require("../models/productModel");
const catchError = require("../utils/catchError");

const addVariantProduct = catchError(async (req, res, next) => {
  const variantProduct = await VariantProduct.create(req.body);

  const product = await Product.findById(req.body.productId);

  product.variantProducts.push(variantProduct._id);
  await product.save();
  resSuccess(res, 200, { status: "Success", message: "Update successfully" });
});

module.exports = { addVariantProduct };
