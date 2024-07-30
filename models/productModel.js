const mongoose = require("mongoose");

const classifySchema = mongoose.Schema({
  color: {
    type: String,
  },
  kind: [
    {
      size: {
        type: String,
      },
      quantity: {
        type: Number,
        default: 0,
      },
      configuration: String,
      price: {
        type: Number,
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
    },
  ],
});

const productSchema = mongoose.Schema({
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
  price: {
    type: Number,
    required: [true, "Product must have a price"],
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
  classify: [classifySchema],
  star: {
    type: Number,
    default: 4.5,
    min: [1, "rating must be above 1.0"],
    max: [5, "rating must be below 5.0"],
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
