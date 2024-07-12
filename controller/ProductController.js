const { status } = require("express/lib/response");
const Product = require("../models/productModel");

const APIFeatures = require("../utils/apiFeatures");

const getProducts = async (req, res, next) => {
  try {
    const features = new APIFeatures(Product.find(), req.query);
    features.filter();
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
    const products = await Product.aggregate([
      {
        $match: {
          category: {
            $in: [
              "headphone",
              "cctv",
              "mouse",
              "monitor",
              "keyboard",
              "speaker",
              "phone",
              "laptop",
            ],
          },
        },
      },
      {
        $group: {
          _id: "$category",
          name: {
            $push: "$name",
          },
          price: {
            $push: "$price",
          },
          imgs: {
            $push: "$images",
          },
          stars: {
            $push: "$star",
          },
        },
      },
    ]);
    const limitedProducts = products.map((category) => ({
      _id: category._id,
      products: category.name.map((item, index) => {
        return {
          name: item,
          price: category.price[index],
          imgs: category.imgs[index],
          stars: category.stars[index],
        };
      }),
    }));
    res.status(200).json({
      status: "success",
      length: products.length,
      data: {
        limitedProducts,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

module.exports = { getProducts, createProduct, getHomePageProduct, tabContent };
