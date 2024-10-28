const { resSuccess } = require("./authController");

const Comment = require("../models/commentModel");

const catchError = require("../utils/catchError");
const AppError = require("../utils/appError");
const { patch } = require("../routes/userRouters");

const getComment = catchError(async (req, res, next) => {
  const productComment = await Comment.findOne({
    idProduct: req.query.idProduct,
  }).populate({
    path: "comments.idUser",
    select: "username email photo",
  });
  if (!productComment) {
    return next(new AppError("comments not found", 404));
  }
  resSuccess(res, 200, { data: productComment });
});

const createComment = catchError(async (req, res, next) => {
  const findCmt = await Comment.findOne({ idProduct: req.body.idProduct });

  // Nếu chưa có comment cho sản phẩm, tạo mới comment
  if (!findCmt) {
    const createFirstCmt = await Comment.create({
      idProduct: req.body.idProduct,
      comments: [
        {
          idUser: req.body.idUser,
          text: req.body.text, // Chú ý rằng bạn cần truyền đúng giá trị text
          star: req.body.star,
        },
      ],
    });
  } else {
    // Nếu đã có comment, thêm bình luận mới vào mảng comments
    findCmt.comments.push({
      idUser: req.body.idUser,
      text: req.body.text,
      star: req.body.star,
    });

    await findCmt.save();
  }

  // Trả về phản hồi thành công
  resSuccess(res, 200, { message: "Created comment successfully" });
});

const upDateComment = catchError(async (req, res, next) => {
  // cần id comment và id item của comments và newText
  const findCmt = await Comment.findById(req.body.idComment);

  //   update

  if (findCmt) {
    const findIndex = findCmt.comments.findIndex((item) =>
      item._id.equals(req.body.idItemCmt),
    );
    findCmt.comments[findIndex].text = req.body.newText;
    if (req.body.newStar) {
      findCmt.comments[findIndex].star = req.body.newStar;
    }
    await findCmt.save();
  } else {
    return next(new AppError("Comment not found", 404));
  }

  resSuccess(res, 200, { message: "Update comment successful" });
});

module.exports = { createComment, upDateComment, getComment };
