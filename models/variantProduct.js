const mongoose = require("mongoose");

const variantProductSchema = mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  color: {
    type: String,
  },
  configuration: {
    type: String,
  },
  stock: {
    type: String,
  },
  price: {
    type: Number,
    required: [true, "Product must have a name"],
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function (value) {
        return value < this.price;
      },
      message: "Discount price ({VALUE}) should be below regular price",
    },
  },
});

const VariantProduct = mongoose.model("VariantProduct", variantProductSchema);

module.exports = VariantProduct;
