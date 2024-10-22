const catchError = require("../utils/catchError");
const { resSuccess } = require("./authController");
const Order = require("../models/orderModel");
const VariantProduct = require("../models/variantProduct");
const cart = require("../models/cartModel");
const AppError = require("../utils/appError");
const Cart = require("../models/cartModel");

const createOrder = catchError(async (req, res, next) => {
  // Tạo đơn hàng
  const createOrder = await Order.create({
    idUser: req.user._id,
    itemsProduct: [...req.body.itemsOrder],
    total: req.body.total,
    shippingAddress: {
      name: req.body.username,
      address: req.body.address,
    },
    paymentMethod: req.body.paymentMethod,
    numberPhone: req.body.numberPhone,
  });

  // Lấy danh sách idVariantProduct từ itemsOrder
  const idVariants = req.body.itemsOrder.map((item) => item.idVariantProduct);

  // Tìm các sản phẩm variant theo id
  const variants = await VariantProduct.find({
    _id: { $in: idVariants },
  });

  // Tạo mảng các thao tác cập nhật để dùng với bulkWrite
  const bulkOps = variants.map((variant, index, next) => {
    const orderedItem = req.body.itemsOrder[index];

    // Kiểm tra tồn kho trước khi cập nhật
    if (variant.stock < orderedItem.quantity) {
      return next(
        new AppError(`Insufficient stock for variant: ${variant._id}`),
      );
    }

    return {
      updateOne: {
        filter: { _id: variant._id },
        update: { $inc: { stock: -orderedItem.quantity } },
      },
    };
  });

  // Thực hiện cập nhật stock của tất cả các variants cùng lúc
  await VariantProduct.bulkWrite(bulkOps);

  // xoá user cart sau khi thêm vào ordered

  const userCart = await Cart.findByIdAndDelete(req.body.idCart);

  // Trả về kết quả thành công
  resSuccess(res, 200, { message: "Order created successfully" });
});

const getOrder = catchError(async (req, res, next) => {
  const order = await Order.find({ idUser: req.user._id })
    .populate({
      path: "itemsProduct.idProduct",
      select: "name description images",
    })
    .populate({
      path: "itemsProduct.idVariantProduct",
      select: "color configuration price  priceDiscount",
    });
  resSuccess(res, 200, { message: "Order created successfully", data: order });
});
module.exports = { createOrder, getOrder };
