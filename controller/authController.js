const jwt = require("jsonwebtoken");

const catchError = require("../utils/catchError");

const Customer = require("../models/customerModel");

const AppError = require("../utils/appError");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPRIES_IN,
  });

const resSuccess = (res, statusCode, token) => {
  res.status(statusCode).json({
    status: "success",
    token,
  });
};
// đăng ký
const signup = catchError(async (req, res, next) => {
  const createCustomer = await Customer.create(req.body);
  const token = signToken(createCustomer._id);

  res.cookie("token", token, { signed: true, httpOnly: true });
  resSuccess(res, 201, token);
});

// đăng nhập
const login = catchError(async (req, res, next) => {
  // resSuccess(res, 200, req.signedCookies.token);
  console.log("thực hiện login");
  console.log(req.body);
  const { username, password } = req.body;
  if (!username || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  const customer = await Customer.findOne({ username: username }).select(
    "+password",
  );

  const correctPassword = await customer.correctPassword(
    password,
    customer.password,
  );

  if (!customer || !correctPassword) {
    return next(new AppError("Incorrect email or password", 401));
  }
  const token = signToken(customer._id);

  res.cookie("token", token, { signed: true, httpOnly: true });

  resSuccess(res, 200, token);
});

module.exports = { signup, login };
