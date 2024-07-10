require("dotenv").config({ path: ".env" });
const app = require("./app");
const mongoose = require("mongoose");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then((con) => {
  console.log("Ket noi thanh cong");
});
const port = process.env.PORT || 3000;
app.listen(port, (res, req) => {
  console.log("Đang chạy trên cổng 8000");
});
