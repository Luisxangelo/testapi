const jwt = require('jsonwebtoken');
const AppError = require('../utils/app.error');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user.model');
const { promisify } = require('util');

exports.protect = catchAsync(async (req, res, next) => {
  // extraer el token que viene del header
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // validar si existe
  if (!token) {
    return next(
      new AppError('you ar not loggeg in! please login to get acces', 401)
    );
  }
  // decodificar el token jwt
  const decode = await promisify(jwt.verify)(
    token,
    process.env.SECRET_JWT_SEED
  );
  // buscar el usuario y validar si existe
  const user = await User.findOne({
    where: {
      id: decode.id,
      status: 'active',
    },
  });
  if (!user) {
    return next(
      new AppError('the owner of this token is nor longer avaible', 401)
    );
  }
  if (user.passwordChangedAt) {
    const changedTimeStam = parseInt(
      user.passwordChangedAt.getTime() / 1000,
      10
    );
    if (decode.iat < changedTimeStam) {
      return next(
        new AppError('use recently changed password! please login new')
      );
    }
  }
  req.sessionUser = user;
  next();
});

exports.protectAccountOwner = (req, res, next) => {
  const { user, sessionUser } = req;

  if (user.id !== sessionUser.id) {
    return next(new AppError('you do not own this account', 401));
  }
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.sessionUser.role)) {
      return next(
        new AppError('you dont have permission to perform this action', 403)
      );
    }
    next();
  };
};
