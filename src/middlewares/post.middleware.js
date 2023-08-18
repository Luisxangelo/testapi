const AppError = require('../utils/app.error');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user.model');
const { Post, postStatus } = require('../models/post.model');
const postImg = require('../models/postImg.model');
const Comment = require('../models/comment.model');

exports.validPost = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const post = await Post.findOne({
    where: {
      status: postStatus.active,
      id,
    },
    include: [
      {
        model: User,
        attributes: ['id', 'name', 'profileImgUrl', 'description'],
      },
    ],
  });

  if (!post) {
    return next(new AppError(`post with id:${id} not found`, 404));
  }

  req.user = post.user;
  req.post = post;
  next();
});

exports.validPostFindOne = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const post = await Post.findOne({
    where: {
      status: postStatus.active,
      id,
    },
    include: [
      {
        model: User,
        attributes: ['id', 'name', 'profileImgUrl', 'description'],
      },
      {
        model: postImg,
      },
      {
        model: Comment,
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'profileImgUrl', 'description'],
          },
        ],
      },
    ],
  });

  if (!post) {
    return next(new AppError(`post with id:${id} not found`, 404));
  }

  req.user = post.user;
  req.post = post;
  next();
});
