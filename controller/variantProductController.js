const { resSuccess } = require("./authController");

const VariantProduct = require("../models/variantProduct");

const Product = require("../models/productModel");
const Variant = require("../models/variantProduct");
const catchError = require("../utils/catchError");
const mongoose = require("mongoose");

const addVariantProduct = catchError(async (req, res, next) => {
  const variantProduct = await VariantProduct.create(req.body);

  const product = await Product.findById(req.body.productId);

  product.variantProducts.push(variantProduct._id);
  await product.save();
  resSuccess(res, 200, { status: "Success", message: "Update successfully" });
});

const upDateVrProduct = catchError(async (req, res, next) => {
  await Variant.findByIdAndUpdate(req.body.idVrProduct, req.body, {
    new: true,
    runValidators: true, // do thiết lập true nên trình xác nhận được chạy
  });

  resSuccess(res, 200, { status: "Success", message: "Update successfully" });
});
const deleteVrProduct = catchError(async (req, res, next) => {
  await Variant.findByIdAndDelete(req.body.idVrProduct);

  const product = await Product.updateOne(
    {
      _id: req.body.idProduct,
    },
    {
      $pull: {
        variantProducts: new mongoose.Types.ObjectId(req.body.idVrProduct),
      },
    },
  );

  resSuccess(res, 200, { status: "Success", message: "Update successfully" });
});

module.exports = { addVariantProduct, upDateVrProduct, deleteVrProduct };
