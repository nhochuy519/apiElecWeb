const classify = require("./variantProduct");

const mongoose = require("mongoose");
const cartSchema = mongoose.Schema(
  {
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
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    total: {
      type: Number,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

cartSchema.virtual("productLength").get(function () {
  return this.itemsProduct.length;
});
cartSchema.pre("save", async function (next) {
  this.total = this.itemsProduct.reduce((prev, currentValue) => {
    return prev + currentValue.quantity * currentValue.price;
  }, 0);

  next();
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
