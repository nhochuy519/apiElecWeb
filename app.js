const express = require("express");
const morgan = require("morgan");

const cors = require("cors");

const app = express();

const productRouter = require("./routes/productRoutes");

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log("xử lý middleware");
  next();
});

app.use("/api/v1/product", productRouter);

// app.get("/api", (req, res) => {
//   res.status(200).json({
//     data: "success",
//   });
// });

// const port = 8000
// const server = app.listen(port,()=>{
//     console.log("app dang duoc chay")
// })

module.exports = app;
