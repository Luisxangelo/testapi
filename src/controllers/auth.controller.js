const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const generateJWT = require('../utils/jwt');
const AppError = require('../utils/app.error');
const storage = require('../utils/firebase');

const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

exports.signUp = catchAsync(async (req, res) => {
  const { name, email, password, description } = req.body;

  if (!req.file) {
    return next(new AppError('array undifine', 401));
  }

  const imgRef = ref(storage, `users/${Date.now()}-${req.file.originalname}`);

  const imgUpload = await uploadBytes(imgRef, req.file.buffer);

  const salt = await bcrypt.genSalt(12);
  const encryptedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name: name.toLowerCase().trim(),
    email: email.toLowerCase().trim(),
    password: encryptedPassword,
    description,
    profileImgUrl: imgUpload.metadata.fullPath,
  });

  const tokenPromise = generateJWT(user.id);

  const imgRefToDownload = ref(storage, user.profileImgUrl);
  const urlPromise = getDownloadURL(imgRefToDownload);

  const [token, url] = await Promise.all([tokenPromise, urlPromise]);

  user.profileImgUrl = url;

  res.status(200).json({
    status: 'succes',
    message: 'the user has been created',
    token,
    user: {
      id: user.id,
      name: user.name,
      description: user.description,
      profileImgUrl: user.profileImgUrl,
    },
  });
});
exports.signIn = catchAsync(async (req, res, next) => {
  // Toma los datos
  const { email, password } = req.body;
  // valida usaurio y reisa si existe
  const user = await User.findOne({
    where: {
      email: email.toLowerCase(),
      status: 'active',
    },
  });
  if (!user) {
    return next(new AppError(`user with email ${email} not found!`, 404));
  }
  // valida la contrasñea
  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  // genera el token
  const tokenPromise = generateJWT(user.id);

  const imgRef = ref(storage, user.profileImgUrl);
  const urlPromise = getDownloadURL(imgRef);

  const [token, url] = await Promise.all([tokenPromise, urlPromise]);

  user.profileImgUrl = url;

  res.status(200).json({
    status: 'succes',
    token,
    user: {
      id: user.id,
      name: user.name,
      description: user.description,
      profileImgUrl: user.profileImgUrl,
    },
  });
});

exports.updatePassword = catchAsync(async (res, req, next) => {
  //traer usaurio del midelware
  const { user } = req;
  // traer datos de la req.boy
  const { currentPassword, newPassword } = req.body;
  //validar si la contraseña actual y nueva son iguales enviar un error
  if ((currentPassword = newPassword)) {
    return next(new AppError('the password cannot be equals', 400));
  }

  // vaidar si la contraseña actual es iagual a la contrasñea Bd
  if (!(await bcrypt.compare(currentPassword, user.password))) {
    return next(new AppError('Incorrect password', 401));
  }
  // encriptar la nueva contraseña
  const salt = await bcrypt.genSalt(12);
  const encryptedPassword = await bcrypt.hash(newPassword, salt);
  //acutalizar el usuario que viene de la request
  await user.update({
    password: encryptedPassword,
    passwordChangedAt: new Date(),
  });
  // enviar el mensaje al cliente
  return res.status(200).json({
    status: 'success',
    message: 'the user password was updated successfully!',
  });
});
