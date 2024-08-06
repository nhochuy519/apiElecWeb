const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const validator = require("validator");

const bcrypt = require("bcrypt");

const customerSchema = mongoose.Schema({
  username: {
    type: String,

    // match: [
    //   /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
    //   "Username invalid, it should contain 8-20 alphanumeric letters and be unique!",
    // ], // kiểm tra tính hợp lệ của trường user name
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: "Passwords are not the same",
    },
  },
  address: {
    type: String,
  },
  role: {
    type: "String",
    enum: ["admin", "customer"],
    default: "customer",
  },
  photo: {
    type: String,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  dateOfBirth: {
    type: Date,
  },
  address: {
    type: String,
  },
  numberPhone: {
    type: Number,
  },

  passwordChangeAt: {
    type: Date,
  },
});

customerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 12); // lặp 2^12 4096 vòng lặp để băm mật khẩu

  this.passwordConfirm = undefined;
});

customerSchema.methods.correctPassword = async function (
  candidatePassword,
  userPasword,
) {
  return await bcrypt.compare(candidatePassword, userPasword);
};

customerSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangeAt) {
    const changedTimestamp = parseInt(
      this.passwordChangeAt.getTime() / 1000,
      10,
    );
    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

const Customer = mongoose.model("Customer", customerSchema);

// The "models" object is provided by the Mongoose Library and stores all the registered models.
// If a model named "User" already exists in the "models" object, it assigns that existing model to the "User" variable.
// This prevents redefining the model and ensures that the existing model is reused.
// If a model named "User" does not exist in the "models" object, the "model" function from Mongoose is called to create a new model
// The newly created model is then assigned to the "User" variable.

// Đối tượng "models" được cung cấp bởi Thư viện Mongoose và lưu trữ tất cả các model đã đăng ký.
// Nếu một mô hình có tên "Người dùng" đã tồn tại trong đối tượng "mô hình", nó sẽ gán mô hình hiện có đó cho biến "Người dùng".
// Điều này ngăn việc xác định lại mô hình và đảm bảo rằng mô hình hiện có được sử dụng lại.
// Nếu model có tên "User" không tồn tại trong đối tượng "models", hàm "model" từ Mongoose sẽ được gọi để tạo model mới
// Model mới tạo sau đó được gán cho biến "User".

module.exports = Customer;
