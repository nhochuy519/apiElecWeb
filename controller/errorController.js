const AppError = require("../utils/appError");

const handleErr11000 = (err) => {
  const value = err.keyValue.username;
  const message = `Duplicate field value ${value} Please use another vallue`;
  return new AppError(message, 400);
};

const sendErrDev = (err, res) => {
  console.log("thực hiện sendErrDev");
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
  });
};

sendErrProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      error: err,
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

const globalHanleError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrDev(err, res);
  }
  if (process.env.NODE_ENV === "production") {
    if (err.code === 11000) {
      err = handleErr11000(err);
    }
    sendErrProd(err, res);
  }
};

module.exports = globalHanleError;
