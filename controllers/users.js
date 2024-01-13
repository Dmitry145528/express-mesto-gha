const http2 = require('http2');
const { Error: MongooseError } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { BadRequestError } = require('../errors/BadRequestError');
const { ConflictError } = require('../errors/ConflictError');
const { NotFoundError } = require('../errors/NotFoundError');
const { UnauthorizedError } = require('../errors/UnauthorizedError');

const { SECRET_KEY } = process.env;
const MONGO_ERROR_CODE_DUPLICATE = 11000;
const HTTP2_STATUS = http2.constants;

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});

    return res.status(HTTP2_STATUS.HTTP_STATUS_OK).send(users);
  } catch (error) {
    return next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(
      () => new Error('NotFoundError'),
    );

    return res.status(HTTP2_STATUS.HTTP_STATUS_OK).send(user);
  } catch (error) {
    if (error.message === 'NotFoundError') {
      return next(new NotFoundError('Пользователь по указанному ID не найден.'));
    }
    if (error instanceof MongooseError.CastError) {
      return next(new BadRequestError('Передан не валидный ID.'));
    }
    return next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    // Хеширование пароля перед созданием пользователя
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Создание пользователя с хешированным паролем
    const user = await User.create({
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    });
    return res.status(HTTP2_STATUS.HTTP_STATUS_CREATED).send(user);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
    }
    if (error.code === MONGO_ERROR_CODE_DUPLICATE) {
      return next(new ConflictError('Пользователь с таким email уже существует'));
    }
    return next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const userUpdate = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: req.body.name,
        about: req.body.about,
      },
      { new: true, runValidators: true },
    ).orFail(() => new Error('NotFoundError'));

    return res.status(HTTP2_STATUS.HTTP_STATUS_OK).send(userUpdate);
  } catch (error) {
    if (error.message === 'NotFoundError') {
      return next(new NotFoundError('Пользователь по указанному ID не найден.'));
    }
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
    }
    return next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const avatarUpdate = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: req.body.avatar },
      { new: true, runValidators: true },
    ).orFail(
      () => new Error('NotFoundError'),
    );

    return res.status(HTTP2_STATUS.HTTP_STATUS_OK).send(avatarUpdate);
  } catch (error) {
    if (error.message === 'NotFoundError') {
      return next(new NotFoundError('Пользователь по указанному ID не найден.'));
    }
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError('Переданы некорректные данные при обновлении аватара.'));
    }
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new UnauthorizedError('Неправильные почта или пароль'));
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      return next(new UnauthorizedError('Неправильные почта или пароль'));
    }

    const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '7d' });
    res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 * 24 * 7 });

    return res.status(HTTP2_STATUS.HTTP_STATUS_OK).send({ token });
  } catch (error) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
};

const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return next(new NotFoundError('Текущий пользователь не найден.'));
    }
    return res.status(HTTP2_STATUS.HTTP_STATUS_OK).send(user);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getMyProfile,
};
