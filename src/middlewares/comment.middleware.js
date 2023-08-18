const catchAsync = require('../utils/catchAsync');
const Comment = require('../models/comment.model');
const AppError = require('../utils/app.error');

exports.validComment = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const comment = await Comment.findAll({
    where: {
      status: 'true',
      id,
    },
  });

  if (!comment) {
    return next(new AppError('Comment not found', 404));
  }
  req.comment = comment;
  next();
});
