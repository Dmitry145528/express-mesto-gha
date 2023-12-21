const User = require('../models/user');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).orFail(
      () => new Error('NotFoundError'),
    );
    return res.status(200).send(users);
  } catch (error) {
    if (error.message === 'NotFoundError') {
      return res.status(404).send({ message: 'Список пользователей пуст.' });
    }
    return res.status(500).send({ message: 'Ошибка на стороне сервера.' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(
      () => new Error('NotFoundError'),
    );

    return res.status(200).send(user);
  } catch (error) {
    if (error.message === 'NotFoundError') {
      return res.status(404).send({ message: 'Пользователь по указанному ID не найден.' });
    }
    if (error.name === 'CastError') {
      return res.status(400).send({ message: 'Передан не валидный ID.' });
    }
    return res.status(500).send({ message: 'Ошибка на стороне сервера.' });
  }
};

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    return res.status(201).send(user);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.', error: error.message });
    }
    return res.status(500).send({ message: 'Ошибка на стороне сервера.' });
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

    return res.status(200).send(userUpdate);
  } catch (error) {
    if (error.message === 'NotFoundError') {
      return res.status(404).send({ message: 'Пользователь по указанному ID не найден.' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.', error: error.message });
    }
    return res.status(500).send({ message: 'Ошибка на стороне сервера.' });
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

    return res.status(200).send(avatarUpdate);
  } catch (error) {
    if (error.message === 'NotFoundError') {
      return res.status(404).send({ message: 'Пользователь по указанному ID не найден' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара.', error: error.message });
    }
    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
