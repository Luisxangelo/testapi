const catchAsync = require('../utils/catchAsync');
const { db } = require('../database/config');
const { Post, postStatus } = require('../models/post.model');
const crypto = require('bcryptjs');
const User = require('../models/user.model');
const Comment = require('../models/comment.model');
const postImg = require('../models/postImg.model');

const storage = require('../utils/firebase');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

exports.findAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.findAll({
    where: {
      status: postStatus.active,
    },
    attributes: {
      exclude: ['status', 'userId'],
    },
    include: [
      {
        model: User,
        attributes: ['id', 'name', 'profileImgUrl', 'description'],
      },
      {
        model: Comment,
        attributes: {
          exclude: ['status', 'postId', 'userId'],
        },
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'profileImgUrl', 'description'],
          },
        ],
      },
      {
        model: postImg,
      },
    ],
    order: [['createdAt', 'DESC']],
    limit: 10,
  });

  const postPromises = posts.map(async (post) => {
    const imgRefUser = ref(storage, post.user.profileImgUrl);
    const urlUser = await getDownloadURL(imgRefUser);

    post.user.profileImgUrl = urlUser;

    const postImgsPromises = post.postImgs.map(async (postImg) => {
      const imgRef = ref(storage, postImg.postImgUrl);
      const url = await getDownloadURL(imgRef);

      postImg.postImgUrl = url;
      return postImg;
    });

    const postImgResolved = await Promise.all(postImgsPromises);
    post.postImgs = postImgResolved;

    return post;
  });

  await Promise.all(postPromises);

  return res.status(200).json({
    status: 'success',
    results: posts.length,
    posts,
  });
});

exports.findMyPosts = catchAsync(async (req, res, next) => {
  const { id } = req.sessionUser;

  const posts = await Post.findAll({
    where: {
      status: postStatus.active,
      userId: id,
    },
    include: [
      {
        model: postImg,
      },
    ],
  });

  if (posts.length > 0) {
    const postPromise = posts.map(async (post) => {
      const postImgPromises = post.postImgs.map(async (postImg) => {
        const imgRef = ref(storage, postImg.postImgUrl);
        const url = getDownloadURL(imgRef);

        postImg.postImgUrl = url;
        return postImg;
      });

      const postImgREsolved = await Promise.all(postImgPromises);
      post.postImgs = postImgREsolved;

      return post;
    });
    await Promise.all(postPromise);
  }

  return res.status(200).json({
    status: 'success',
    results: posts.length,
    posts,
  });
});

exports.findUserPosts = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.query;

  const [rows, fields] = await db.query(query, {
    replacements: { iduser: id, status: status },
  });
  return res.status(200).json({
    status: 'success',
    results: fields.rowCount,
    post: rows,
  });
});

exports.createPost = catchAsync(async (req, res, next) => {
  const { tittle, content } = req.body;
  const { id } = req.sessionUser;

  const post = await Post.create({ tittle, content, userId: id });

  const postImgPromises = req.files.map(async (file) => {
    const imgRef = ref(
      storage,
      `posts/${crypto.randomUUID()}-${file.originalname}`
    );
    const imgUploaded = await uploadBytes(imgRef, file.buffer);

    return await postImg.create({
      postId: post.id,
      postImgUrl: imgUploaded.metadata.fullPath,
    });
  });

  await Promise.all(postImgPromises);

  return res.status(201).json({
    status: 'success',
    message: 'the post has been created!',
    post,
  });
});
exports.findOnePost = catchAsync(async (req, res, next) => {
  const { post } = req;
  let postImgPromises = [];
  let userImgComment = [];

  const imgRefUser = ref(storage, post.user.postImgUrl);
  const urlUserProfile = await getDownloadURL(imgRefUser);

  post.user.postImgUrl = urlUserProfile;

  if (post.postImgs?.length > 0) {
    const postImgPromises = post.postImgs.map(async (postImg) => {
      const imgRef = ref(storage, postImg.postImgUrl);
      const url = await getDownloadURL(imgRef);

      postImg.postImgUrl = url;
      return postImg;
    });
  }

  if (post.comments?.length > 0) {
    const userImgComment = post.comments.map(async (comment) => {
      const imgRef = ref(storage, comment.user.postImgUrl);
      const url = await getDownloadURL(imgRef);

      comment.user.postImgUrl = url;
      return comment;
    });
  }

  const arrPromises = [...postImgPromises, ...userImgComment];

  await Promise.all(arrPromises);

  return res.status(200).json({
    status: 'Success',
    post,
  });
});
exports.updatePost = catchAsync(async (req, res, next) => {
  const { post } = req;
  const { tittle, content } = req.body;
  await post.update({ tittle, content });

  return res.status(200).json({
    status: 'success',
    message: 'the post has been update success',
  });
});
exports.deletePost = catchAsync(async (req, res, next) => {
  const { post } = req;

  await post.update({ status: postStatus.disabled });
  return res.status(200).json({
    status: 'success',
    message: 'the post has been delete success',
  });
});
