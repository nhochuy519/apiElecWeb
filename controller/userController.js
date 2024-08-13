const catchError = require("../utils/catchError");

const jwt = require("jsonwebtoken");

const { resSuccess } = require("./authController");

const Customer = require("../models/customerModel");

const filterObj = (obj, ...allowedFields) => {
  console.log("thực hiện hàm filter");
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) {
      newObj[key] = obj[key];
    }
  });

  return newObj;
};

const getProfile = catchError(async (req, res, next) => {
  resSuccess(res, 200, { data: req.user });
});

const updateProfile = catchError(async (req, res, next) => {
  const filteredBody = filterObj(
    req.body,
    "username",
    "address",
    "photo",
    "gender",
    "dateOfBirth",
    "numberPhone",
  );
  console.log("filter body là", filteredBody);
  const updateCustomer = await Customer.findByIdAndUpdate(
    req.user.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    },
  );
  resSuccess(res, 200, { status: "Success", data: updateCustomer });
});

module.exports = { getProfile, updateProfile };
