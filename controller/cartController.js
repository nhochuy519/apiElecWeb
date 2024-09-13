const Cart = require("../models/cartModel");

const Product = require("../models/productModel");

const catchError = require("../utils/catchError");
const AppError = require("../utils/appError");

const { resSuccess } = require("./authController");

const addToCart = catchError(async (req, res, next) => {});

const removeClassifyFromAllDocuments = async (req, res, next) => {};

const getUserCart = catchError(async (req, res, next) => {});

module.exports = { removeClassifyFromAllDocuments };
