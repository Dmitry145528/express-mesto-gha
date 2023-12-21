const Card = require('../models/card');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({}).orFail(
      () => new Error('NotFoundError'),
    );
    return res.status(200).send(cards);
  } catch (error) {
    if (error.message === 'NotFoundError') {
      return res.status(404).send({ message: 'Список карточек пуст' });
    }
    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};

const deleteCard = async (req, res) => {
  try {
    await Card.findByIdAndDelete(req.params.cardId).orFail(
      () => new Error('NotFoundError'),
    );

    return res.status(200).send({ message: 'Карточка была успешно удалена' });
  } catch (error) {
    if (error.message === 'NotFoundError') {
      return res.status(404).send({ message: 'Карточка не найдена' });
    }
    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};

const createCard = async (req, res) => {
  try {
    const newCard = await Card.create({ ...req.body, owner: req.user._id });
    return res.status(201).send(newCard);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы не валидные данные', error: error.message });
    }
    return res.status(500).send({ message: 'Ошибка на стороне сервера' });
  }
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
};
