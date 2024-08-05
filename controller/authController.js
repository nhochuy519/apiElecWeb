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
  console.log(req.body.username);
  const createCustomer = await Customer.create({
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    email: req.body.email,
  });

  const token = signToken(createCustomer._id);

  res.cookie("token", token, {
    signed: true,
    httpOnly: true,
    secure: process.env.NODE_ENV === "development", // Đảm bảo thiết lập secure chỉ khi trong môi trường production
    // sameSite: "None", // Nếu bạn đang gửi cookie từ một miền khác, hãy đặt sameSite thành "None"
  });
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

const protect = catchError(async (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    return next(
      new AppError("Your are not logged in! Please log in to get access", 401),
    );
  }

  const decodedJwt = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const customer = await Customer.findById(decodedJwt.id);

  if (!customer) {
    return next(
      new AppError("The user belonging to this token does no longer", 401),
    );
  }

  if (customer.changedPasswordAfter(decodedJwt.iat)) {
    return new AppError(
      "User recently changed password! Please log in again",
      401,
    );
  }

  req.user = customer;
  next();
});

const getProfile = catchError(async (req, res, next) => {});
module.exports = { signup, login };
