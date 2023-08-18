const { where } = require('sequelize');
const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const { ref, getDownloadURL } = require('firebase/storage');
const storage = require('../utils/firebase');

exports.findAllUser = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    where: {
      status: 'active',
    },
  });

  const userPromises = users.map(async (user) => {
    const imgRef = ref(storage, user.profileImgUrl);
    const url = await getDownloadURL(imgRef);

    user.profileImgUrl = url;

    return user;
  });

  await Promise.all(userPromises);

  res.status(200).json({
    status: 'success',
    users,
  });
});

exports.findUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  const imgRef = ref(storage, user.profileImgUrl);
  const url = await getDownloadURL(imgRef);

  return res.status(200).json({
    status: 'success',
    user: {
      name: user.name,
      email: user.email,
      description: user.description,
      profileImgUrl: url,
      role: user.role,
    },
    messagge: 'user retrieved successfully',
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { name, description } = req.body;

  await user.update({ name, description });

  const userUpdate = await user.update({});
  return res.status(200).json({
    status: 'success',
    messagge: 'user update successfully',
    userUpdate,
  });
});
exports.deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  await user.update({ status: 'inactive' });

  return res.status(200).json({
    status: 'success',
    messagge: 'user delete successfully',
  });
});
