const classify = require("./variantProduct");

const mongoose = require("mongoose");
const cartSchema = mongoose.Schema({
  idUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  itemsProduct: [
    {
      idProduct: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      idVariantProduct: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "VariantProduct",
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  total: {
    type: Number,
  },
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
