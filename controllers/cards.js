const http2 = require('http2');
const { Error: MongooseError } = require('mongoose');
const Card = require('../models/card');

const HTTP2_STATUS = http2.constants;

let cards = [];

const getCards = async (req, res) => {
  try {
    cards = await Card.find({});

    return res.status(HTTP2_STATUS.HTTP_STATUS_OK).send(cards);
  } catch (error) {
    return res.status(HTTP2_STATUS.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера.' });
  }
};

const deleteCard = async (req, res) => {
  try {
    await Card.findByIdAndDelete(req.params.cardId).orFail(
      () => new Error('NotFoundError'),
    );

    return res.status(HTTP2_STATUS.HTTP_STATUS_OK).send({ message: 'Карточка успешно удалена.' });
  } catch (error) {
    if (error.message === 'NotFoundError') {
      return res.status(HTTP2_STATUS.HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' });
    }
    if (error instanceof MongooseError.CastError) {
      return res.status(HTTP2_STATUS.HTTP_STATUS_BAD_REQUEST).send({ message: 'Передан не валидный ID.' });
    }
    return res.status(HTTP2_STATUS.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера.' });
  }
};

const createCard = async (req, res) => {
  try {
    const newCard = await Card.create({ ...req.body, owner: req.user._id });
    return res.status(HTTP2_STATUS.HTTP_STATUS_CREATED).send(newCard);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return res.status(HTTP2_STATUS.HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки.', error: error.message });
    }
    return res.status(HTTP2_STATUS.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера.' });
  }
};

const likeCard = async (req, res) => {
  try {
    const likes = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ).orFail(() => new Error('NotFoundError'));

    return res.status(HTTP2_STATUS.HTTP_STATUS_OK).send(likes);
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      return res.status(HTTP2_STATUS.HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.', error: error.message });
    }
    if (error.message === 'NotFoundError') {
      return res.status(HTTP2_STATUS.HTTP_STATUS_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки.' });
    }
    return res.status(HTTP2_STATUS.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера.' });
  }
};

const dislikeCard = async (req, res) => {
  try {
    const likes = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    ).orFail(() => new Error('NotFoundError'));

    return res.status(HTTP2_STATUS.HTTP_STATUS_OK).send(likes);
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      return res.status(HTTP2_STATUS.HTTP_STATUS_BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.', error: error.message });
    }
    if (error.message === 'NotFoundError') {
      return res.status(HTTP2_STATUS.HTTP_STATUS_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки.' });
    }
    return res.status(HTTP2_STATUS.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера.' });
  }
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
};
