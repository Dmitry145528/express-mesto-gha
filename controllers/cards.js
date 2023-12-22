const Card = require('../models/card');

let cards = [];

const getCards = async (req, res) => {
  try {
    cards = await Card.find({}).orFail(
      () => new Error('NotFoundError'),
    );
    return res.status(200).send(cards);
  } catch (error) {
    if (error.message === 'NotFoundError') {
      return res.status(404).send({ message: 'Список карточек пуст.' });
    }
    return res.status(500).send({ message: 'Ошибка на стороне сервера.' });
  }
};

const deleteCard = async (req, res) => {
  try {
    await Card.findByIdAndDelete(req.params.cardId).orFail(
      () => new Error('NotFoundError'),
    );

    return res.status(200).send();
  } catch (error) {
    if (error.message === 'NotFoundError') {
      return res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
    }
    if (error.name === 'CastError') {
      return res.status(400).send({ message: 'Передан не валидный ID.' });
    }
    return res.status(500).send({ message: 'Ошибка на стороне сервера.' });
  }
};

const createCard = async (req, res) => {
  try {
    const newCard = await Card.create({ ...req.body, owner: req.user._id });
    return res.status(201).send(newCard);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.', error: error.message });
    }
    return res.status(500).send({ message: 'Ошибка на стороне сервера.' });
  }
};

const likeCard = async (req, res) => {
  try {
    const likes = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ).orFail(() => new Error('NotFoundError'));

    return res.status(200).send(likes);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.', error: error.message });
    }
    if (error.message === 'NotFoundError') {
      return res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
    }
    return res.status(500).send({ message: 'Ошибка на стороне сервера.' });
  }
};

const dislikeCard = async (req, res) => {
  try {
    const likes = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    ).orFail(() => new Error('NotFoundError'));

    return res.status(200).send(likes);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.', error: error.message });
    }
    if (error.message === 'NotFoundError') {
      return res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
    }
    return res.status(500).send({ message: 'Ошибка на стороне сервера.' });
  }
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
};
