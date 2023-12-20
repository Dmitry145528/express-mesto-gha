const user = require('../models/user');

const getUsers = async (req, res) => {
  try {
    const users = await user.find({});
    return res.status(200).send(users);
  } catch (error) {
    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};

const getUserById = (req, res) => {
  res.status(200).send('Работает здесь будет возвращаться пользователь по _id');
};

const createUser = (req, res) => {
  const name = req.body;
  res.status(200).send(name);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
};
