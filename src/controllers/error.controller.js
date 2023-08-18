const Error = require('../models/error.model');
const AppError = require('../utils/app.error');

const handleCastError22001 = () =>
  new AppError('the number of characters is greater than expected', 400);
const handleJWTError = () =>
  new AppError('invalid token please login try again!', 401);
const handleJWTExpired = () => new AppError('your token is a expiraded', 401);
const handleCastError220P02 = () =>
  new AppError('invalid data type data base', 401);

const sendErrorDev = async (err, res) => {
  await Error.create({
    status: err.status,
    message: err.message,
    stack: err.stack,
    err: err,
  });

  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    err: err,
  });
};
const sendErrorPro = (err, res) => {
  console.log(err);
  //operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    //programming or other unknown error: don't leak error detail
    return res.status(500).json({
      status: 'fail',
      message: 'Something went very wrong!',
    });
  }
};

const globalErrorHander = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }
  if (process.env.NODE_ENV === 'production') {
    let error = err;
    if (err.parent?.code === '22001') error = handleCastError22001();
    if (err.parent?.code === '220P02') error = handleCastError220P02();
    if ((err.name = 'JsonWebTokerError')) error = handleJWTError();
    if ((err.name = 'TokenExpiredError')) error = handleJWTExpired();

    sendErrorPro(error, res);
  }
};

module.exports = globalErrorHander;
