const mongoose = require("mongoose");
const orderSchema = mongoose.Schema(
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
    shippingAddress: {
      name: { type: String, required: true },
      address: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "Bank Transfer"],
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // Thêm thời gian tạo và cập nhật
  },
);

orderSchema.pre("save", function (next) {
  console.log("thực hiện middleware order");
  const newDate = new Date(this.createdAt);
  newDate.setDate(newDate.getDate() + 3);
  this.deliveredAt = newDate;
  next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
