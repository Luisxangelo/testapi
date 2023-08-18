const postController = require('../controllers/post.controller');
const express = require('express');

const authMiddleware = require('../middlewares/auth.middleware');
const validationMiddleware = require('../middlewares/validation.middleware');
const postMiddleware = require('../middlewares/post.middleware');
const userMiddleware = require('../middlewares/user.middleware');
const { upload } = require('./../utils/multer');

const router = express.Router();

router
  .route('/')
  .get(postController.findAllPosts)
  .post(
    upload.array('postImg', 3),
    authMiddleware.protect,
    validationMiddleware.createPostValidation,
    postController.createPost
  );

router.use(authMiddleware.protect);
router.get('/me', postController.findMyPosts);

router.get(
  '/profile/:id',
  userMiddleware.validUser,
  postController.findUserPosts
);

router
  //.use('/:id', )
  .route('/:id')
  .get(postMiddleware.validPostFindOne, postController.findOnePost)
  .patch(
    postMiddleware.validPost,
    validationMiddleware.createCommentValidation,
    authMiddleware.protectAccountOwner,
    postController.updatePost
  )
  .delete(
    postMiddleware.validPost,
    authMiddleware.protectAccountOwner,
    postController.deletePost
  );

module.exports = router;
