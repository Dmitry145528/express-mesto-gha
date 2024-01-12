const http2 = require('http2');
const { Error: MongooseError } = require('mongoose');
const Card = require('../models/card');
const { NotFoundError } = require('../errors/NotFoundError');
const { BadRequestError } = require('../errors/BadRequestError');

const HTTP2_STATUS = http2.constants;

let cards = [];

const getCards = async (req, res, next) => {
  try {
    cards = await Card.find({});

    return res.status(HTTP2_STATUS.HTTP_STATUS_OK).send(cards);
  } catch (error) {
    return next(error);
  }
};

const deleteCard = async (req, res, next) => {
  try {
    await Card.findOneAndDelete({ _id: req.params.cardId, owner: req.user._id }).orFail(
      () => new Error('NotFoundError'),
    );

    return res.status(HTTP2_STATUS.HTTP_STATUS_OK).send({ message: 'Карточка успешно удалена.' });
  } catch (error) {
    if (error.message === 'NotFoundError') {
      return next(new NotFoundError('Карточка с указанным _id не найдена или у вас нет прав на удаление.'));
    }
    if (error instanceof MongooseError.CastError) {
      return next(new BadRequestError('Передан не валидный ID.'));
    }
    return next(error);
  }
};

const createCard = async (req, res, next) => {
  try {
    const newCard = await Card.create({ ...req.body, owner: req.user._id });
    return res.status(HTTP2_STATUS.HTTP_STATUS_CREATED).send(newCard);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
    }
    return next(error);
  }
};

const likeCard = async (req, res, next) => {
  try {
    const likes = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ).orFail(() => new Error('NotFoundError'));

    return res.status(HTTP2_STATUS.HTTP_STATUS_OK).send(likes);
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      return next(new BadRequestError('Переданы некорректные данные для постановки/снятии лайка.'));
    }
    if (error.message === 'NotFoundError') {
      return next(new NotFoundError('Передан несуществующий _id карточки.'));
    }
    return next(error);
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const likes = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    ).orFail(() => new Error('NotFoundError'));

    return res.status(HTTP2_STATUS.HTTP_STATUS_OK).send(likes);
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      return next(new BadRequestError('Переданы некорректные данные для постановки/снятии лайка.'));
    }
    if (error.message === 'NotFoundError') {
      return next(new NotFoundError('Передан несуществующий _id карточки.'));
    }
    return next(error);
  }
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
};
