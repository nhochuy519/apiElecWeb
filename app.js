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

// const corsOptions = {
//   origin: "http://localhost:3000",
//   credentials: true, //access-control-allow-credentials:true
//   optionSuccessStatus: 200,
// };

app.use(cors());
app.use(express.json());
app.use(cookieParser("ronaldoIsTheGoat"));
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,Cache-Control,Accept,X-Access-Token ,X-Requested-With, Content-Type, Access-Control-Request-Method",
  );
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

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
