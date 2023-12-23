const http2 = require('http2');
const { Error: MongooseError } = require('mongoose');
const User = require('../models/user');

const HTTP2_STATUS = http2.constants;

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});

    return res.status(HTTP2_STATUS.HTTP_STATUS_OK).send(users);
  } catch (error) {
    return res.status(HTTP2_STATUS.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера.' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(
      () => new Error('NotFoundError'),
    );

    return res.status(HTTP2_STATUS.HTTP_STATUS_OK).send(user);
  } catch (error) {
    if (error.message === 'NotFoundError') {
      return res.status(HTTP2_STATUS.HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь по указанному ID не найден.' });
    }
    if (error instanceof MongooseError.CastError) {
      return res.status(HTTP2_STATUS.HTTP_STATUS_BAD_REQUEST).send({ message: 'Передан не валидный ID.' });
    }
    return res.status(HTTP2_STATUS.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера.' });
  }
};

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    return res.status(HTTP2_STATUS.HTTP_STATUS_CREATED).send(user);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return res.status(HTTP2_STATUS.HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя.', error: error.message });
    }
    return res.status(HTTP2_STATUS.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера.' });
  }
};

const updateUser = async (req, res) => {
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
      return res.status(HTTP2_STATUS.HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь по указанному ID не найден.' });
    }
    if (error instanceof MongooseError.ValidationError) {
      return res.status(HTTP2_STATUS.HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля.', error: error.message });
    }
    return res.status(HTTP2_STATUS.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера.' });
  }
};

const updateAvatar = async (req, res) => {
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
      return res.status(HTTP2_STATUS.HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь по указанному ID не найден' });
    }
    if (error instanceof MongooseError.ValidationError) {
      return res.status(HTTP2_STATUS.HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара.', error: error.message });
    }
    return res.status(HTTP2_STATUS.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
