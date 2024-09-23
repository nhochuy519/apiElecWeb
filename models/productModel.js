const mongoose = require("mongoose");

const classify = require("./variantProduct");
const { type } = require("express/lib/response");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product must have name"],
      unique: true,
      trim: true, // loại bỏ khoảng trắng đầu  với cuối
    },
    description: {
      type: String,
      required: [true, "Product must have a description"],
    },
    category: {
      type: String,
    },
    images: {
      type: [String],
      validate: {
        validator: function (value) {
          return value.length >= 4;
        },
        message: "Image requirements must have at least 4 photos",
      },
    },

    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          return value < this.price;
        },
        message: "Discount price ({VALUE})should be below regular price",
      },
    },
    variantProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "VariantProduct",
      },
    ],
    star: {
      type: Number,
      default: 4.5,
      min: [1, "rating must be above 1.0"],
      max: [5, "rating must be below 5.0"],
    },
  },
  {
    timestamps: true,
  },
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
