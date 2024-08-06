const catchError = require("../utils/catchError");

const jwt = require("jsonwebtoken");

const resSuccess = require("./authController");

const getProfile = catchError(async (req, res, next) => {
  resSuccess.resSuccess(res, 200, (data = req.user));
});

module.exports = { getProfile };
