const Cart = require("../models/cartModel");

const Product = require("../models/productModel");

const catchError = require("../utils/catchError");
const AppError = require("../utils/appError");

const { resSuccess } = require("./authController");
const mongoose = require("mongoose");
const { patch } = require("../routes/userRouters");
const getCart = catchError(async (req, res, next) => {});
const addToCart = catchError(async (req, res, next) => {
  /*
    check Id user tồn tại
      idProduct true và idVariantProduct true = > quantity +1
      idProduct true và idVariantProduct false => itemsProduct add thêm
      itemProduct false => itemsProduct add thêm
    Id user chưa tồn tại => Cart create
        
    
  */

  const findCart = await Cart.findOne({ idUser: req.user._id });

  if (!findCart) {
    const createCart = await Cart.create({
      idUser: req.user._id,
      itemsProduct: [
        {
          idProduct: new mongoose.Types.ObjectId(req.body.idProduct),
          idVariantProduct: new mongoose.Types.ObjectId(
            req.body.idVariantProduct,
          ),
          quantity: req.body.quantity,
          price: req.body.price,
        },
      ],
    });
  } else {
    const findIdProduct = await Cart.findOne({
      "itemsProduct.idProduct": req.body.idProduct,
      "itemsProduct.idVariantProduct": req.body.idVariantProduct,
    });

    if (findIdProduct) {
      const productIndex = findIdProduct.itemsProduct.findIndex(
        (item) =>
          item.idProduct.equals(req.body.idProduct) &&
          item.idVariantProduct.equals(req.body.idVariantProduct),
      );
      findIdProduct.itemsProduct[productIndex].quantity += req.body.quantity;
      await findIdProduct.save();
    } else {
      findCart.itemsProduct.push(req.body);
      await findCart.save();
    }
  }

  resSuccess(res, 200, { message: "Create cart succesfully" });
});

const removeClassifyFromAllDocuments = async (req, res, next) => {};

const getUserCart = catchError(async (req, res, next) => {
  const userCart = await Cart.findOne({ idUser: req.user._id })
    .populate({
      path: "itemsProduct.idProduct",
      select: "name description images",
    })
    .populate({
      path: "itemsProduct.idVariantProduct",
      select: "color configuration price  priceDiscount",
    });
  resSuccess(res, 200, { data: userCart });
});

const updateCart = catchError(async (req, res, next) => {
  // id cart and id itemProduct
  const cart = await Cart.findById(req.body.idCart);
  const productIndex = cart.itemsProduct.findIndex((item) =>
    item._id.equals(req.body.idItem),
  );
  if (req.body.quantity && req.body.quantity !== 0) {
    console.log("thực hiện update quantity");

    cart.itemsProduct[productIndex].quantity = req.body.quantity;
    await cart.save();
  }
  resSuccess(res, 200, {
    message: "Updated succesfully",
  });
});

module.exports = {
  removeClassifyFromAllDocuments,
  addToCart,
  getUserCart,
  updateCart,
};
