const express = require('express');
const userController = require('./../controllers/user.controller');
const useMiddleware = require('./../middlewares/user.middleware');
const validationMiddelware = require('./../middlewares/validation.middleware');
const authMiddleware = require('./../middlewares/auth.middleware');
const { route } = require('./auth.route');

const router = express.Router();

//buscar todo, buscar por id, actualizar, eliminar
router.use(authMiddleware.protect);

router.get('/', userController.findAllUser);

router.use(authMiddleware.restrictTo('admin'));

router
  .use('/:id', useMiddleware.validUser)
  .route('/:id')
  .get(userController.findUser)
  .patch(validationMiddelware.updateUserValidation, userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
