const express = require("express");
const morgan = require("morgan");

const cors = require("cors");

const app = express();
const cookieParser = require("cookie-parser");

const productRouter = require("./routes/productRoutes");
const customerRouter = require("./routes/userRouters");

const AppError = require("./utils/appError");

const globalHanleError = require("./controller/errorController");

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cors());
app.use(express.json());
app.use(cookieParser("ronaldoIsTheGoat"));

app.use((req, res, next) => {
  console.log("xử lý middleware");
  next();
});

app.use("/api/v1/product", productRouter);
app.use("/api/v1/customer", customerRouter);

app.get("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalHanleError);

module.exports = app;
