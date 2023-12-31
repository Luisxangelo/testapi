const commentController = require('../controllers/comment.controller');
const express = require('express');

const authMiddleware = require('../middlewares/auth.middleware');
const commentMiddleware = require('../middlewares/comment.middleware');
const validationMiddleware = require('../middlewares/validation.middleware');

const router = express.Router();

router.use(authMiddleware.protect);
router
  .route('/')
  .get(commentController.findAllComment)
  .post(
    validationMiddleware.createCommentValidation,
    commentController.createComment
  );

router
  .use('/:id', commentMiddleware.validComment)
  .route('/:id')
  .get(commentController.findOneComment)
  .patch(
    validationMiddleware.updateCommentValidation,
    commentController.updateComment
  )
  .delete(commentController.deleteComment);
module.exports = router;
