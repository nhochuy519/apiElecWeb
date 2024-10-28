const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    idProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    comments: [
      {
        idUser: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Customer",
          required: true,
        },
        text: String,
        date: {
          type: Date,
          default: Date.now,
        },
        star: {
          type: Number,
          min: [1, "Rating must be at least 1"], // Thiết lập giá trị nhỏ nhất
          max: [5, "Rating must be at most 5"], // Thiết lập giá trị lớn nhất
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
