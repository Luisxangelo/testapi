const catchAsync = require('../utils/catchAsync');
const Comment = require('../models/comment.model');

exports.findAllComment = catchAsync(async (req, res, next) => {
  const comments = await Comment.findAll({
    where: {
      status: true,
    },
  });
  return res.status(200).json({
    status: 'true',
    results: comments.length,
    comments,
  });
});
exports.createComment = catchAsync(async (req, res, next) => {
  const { text, postId } = req.body;
  const { id: userId } = req.sessionUser;

  const comment = await Comment.create({ text, postId, userId });

  return res.status(200).json({
    status: 'success',
    message: 'Comment created successfully',
    comment,
  });
});
exports.findOneComment = catchAsync(async (req, res, next) => {
  const { comment } = req;

  return res.status(201).json({
    status: 'success',
    comment,
  });
});
exports.updateComment = catchAsync(async (req, res, next) => {
  const { comment } = req;
  const { text } = req.body;

  await comment.update({ text });

  return res.status(200).json({
    status: true,
    message: 'comment update successfully',
  });
});
exports.deleteComment = catchAsync(async (req, res, next) => {
  const { comment } = req;

  await comment.update({ status: false });
  return res.status(200).json({
    status: 'success',
    message: 'the comment has been delete success',
  });
});
