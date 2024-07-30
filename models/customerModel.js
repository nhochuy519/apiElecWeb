const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const validator = require("validator");

const bcrypt = require("bcrypt");

const customerSchema = mongoose.Schema({
  name: {
    type: String,
  },
  username: {
    type: String,
    require: [true, "Please tell us your name"],
    unique: true,
    lowercase: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    require: [true, "Please provide a password"],
    minlength: 8,
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

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
