const express = require('express');
const authController = require('./../controllers/auth.controller');
const validationMiddleware = require('./../middlewares/validation.middleware');
const userMiddleware = require('./../middlewares/user.middleware');
const authmiddleware = require('./../middlewares/auth.middleware');

const { upload } = require('../utils/multer');

const router = express.Router();

router.post(
  '/singup',
  upload.single('profileImgUrl'),
  validationMiddleware.createUserVAlidation,
  authController.signUp
);
//ruta post signUp
router.post(
  '/singin',
  validationMiddleware.loginUserValidation,
  authController.signIn
);

router.use(authmiddleware.protect);

router.patch(
  '/password/:id',
  validationMiddleware.updatePasswordValidation,
  userMiddleware.validUser,
  authmiddleware.protectAccountOwner,
  authController.updatePassword
);
module.exports = router;
