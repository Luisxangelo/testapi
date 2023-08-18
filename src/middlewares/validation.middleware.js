const { body, validationResult } = require('express-validator');
const validFields = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(404).json({
      status: 'error',
      errors: errors.mapped(),
    });
  }
  next();
};

exports.updateUserValidation = [
  body('name').notEmpty().withMessage('name is requered'),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characers long'),
  validFields,
];

exports.createUserVAlidation = [
  body('name').notEmpty().withMessage('name is requered'),
  body('email')
    .notEmpty()
    .withMessage('Email is requered')
    .isEmail()
    .withMessage('email must be a correct format'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('password must have a least 8 characteres')
    .matches(/[a-zA-Z]/)
    .withMessage('password must have contain a least one letter'),
  validFields,
];
exports.loginUserValidation = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a correct format'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must have a least 8 characters')
    .matches(/[a-zA-Z]/)
    .withMessage('Password must have cotain a least one letter'),
  validFields,
];

exports.updatePasswordValidation = [
  body('currentPassword')
    .isLength({ min: 8 })
    .withMessage('Password must have a least 8 characters')
    .matches(/[a-zA-Z]/)
    .withMessage('Password must have cotain a least one letter'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must have a least 8 characters')
    .matches(/[a-zA-Z]/)
    .withMessage('Password must have cotain a least one letter'),
  validFields,
];
exports.createPostValidation = [
  body('tittle').notEmpty().withMessage('tittle is required'),
  body('content').notEmpty().withMessage('Content is required'),
  validFields,
];
exports.createCommentValidation = [
  body('text').notEmpty().withMessage('Text is required'),
  body('postId').notEmpty().withMessage('PostId is required'),
  validFields,
];
exports.updateCommentValidation = [
  body('text').notEmpty().withMessage('Text is required'),
  validFields,
];
