const { status } = require("express/lib/response");
const Product = require("../models/productModel");

const APIFeatures = require("../utils/apiFeatures");

const catchError = require("../utils/catchError");

const { resSuccess } = require("./authController");

const mongoose = require("mongoose");

const getProducts = async (req, res, next) => {
  try {
    const features = new APIFeatures(Product.find(), req.query);
    features.filter().paginate();
    const products = await features.query;
    res.status(200).json({
      status: "success",
      length: products.length,
      data: {
        products,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

const getProduct = async (req, res, next) => {
  try {
    console.log("Request ID:", req.params.id);

    const newId = new mongoose.Types.ObjectId(req.params.id);

    const grouptVariant = await Product.aggregate([
      {
        $match: { _id: newId },
      },
      {
        $lookup: {
          from: "variantproducts", // Đảm bảo tên collection là đúng
          localField: "_id", // Trường _id trong Product
          foreignField: "productId", // Trường productId trong VariantProduct (cần là ObjectId)
          as: "variantProducts",
        },
      },
      {
        // Tách variantProducts ra khỏi mảng để xử lý
        $unwind: "$variantProducts",
      },
      {
        // Nhóm các variantProducts dựa trên trường 'color'
        $group: {
          _id: "$variantProducts.color",
          variants: {
            $push: {
              idVariant: "$variantProducts._id",
              idProduct: "$variantProducts.productId",
              configuration: "$variantProducts.configuration",
              stock: "$variantProducts.stock",
              price: "$variantProducts.price",
              priceDiscount: "$variantProducts.priceDiscount",
            },
          },
        },
      },
    ]);

    const product = await Product.findById(req.params.id);
    const newObjProduct = { ...product._doc };
    newObjProduct.variantProducts = grouptVariant;
    console.log("obj la", newObjProduct.variantProducts);
    res.status(200).json({
      status: "success",
      data: { newObjProduct },
    });
  } catch (error) {
    console.error("Error:", error); // Ghi lại lỗi để dễ debug
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

const createProduct = async (req, res, next) => {
  try {
    const newProduct = await Product.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        newProduct,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: error.status,
      message: error,
    });
  }
};

const getHomePageProduct = async (req, res, next) => {
  try {
    const [lastest, headphoneBanner, mostSelling, phoneBanner] =
      await Promise.all([
        Product.aggregate([
          {
            $match: {},
          },
          {
            $sample: { size: 4 },
          },
        ]),
        Product.aggregate([
          {
            $match: { category: "headphone" },
          },
          {
            $sample: { size: 2 },
          },
        ]),
        Product.aggregate([
          {
            $match: { star: { $gt: 4.5 } },
          },
          {
            $sample: { size: 4 },
          },
        ]),
        Product.aggregate([
          {
            $match: { category: "phone" },
          },
          {
            $sample: { size: 4 },
          },
        ]),
      ]);
    res.status(200).json({
      status: "success",
      data: {
        lastest,
        headphoneBanner,
        mostSelling,
        phoneBanner,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: error.status,
      message: error,
    });
  }
};

const tabContent = async (req, res, next) => {
  try {
    const tabList = [
      "headphone",
      "cctv",
      "mouse",
      "monitor",
      "keyboard",
      "speaker",
      "phone",
      "laptop",
    ];

    const products = await Product.aggregate([
      {
        $match: {
          category: {
            $in: tabList,
          },
        },
      },
      {
        $group: {
          _id: "$category",
          products: {
            $push: {
              _id: "$_id",
              name: "$name",
              price: "$price",
              images: "$images",
            },
          },
        },
      },
      {
        $addFields: {
          products: {
            $slice: ["$products", 4], // Giới hạn số lượng sản phẩm trong mỗi danh mục là 4
          },
          sortIndex: { $indexOfArray: [tabList, "$_id"] },
        },
      },
      {
        $sort: {
          sortIndex: 1,
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      length: products.length,
      data: {
        limitedProducts: products,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

module.exports = {
  getProducts,
  createProduct,
  getHomePageProduct,
  tabContent,
  getProduct,
};
