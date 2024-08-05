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
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser("ronaldoIsTheGoat"));

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "https://your-frontend.com");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE",
//   );
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers",
//   );
//   res.setHeader("Access-Control-Allow-Credentials", true);
//   res.setHeader("Access-Control-Allow-Private-Network", true);
//   //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
//   res.setHeader("Access-Control-Max-Age", 7200);

//   next();
// });

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
