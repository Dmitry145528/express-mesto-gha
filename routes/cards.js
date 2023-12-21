const cardRouter = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  like,
  dislike,
} = require('../controllers/cards');

cardRouter.get('/', getCards);
cardRouter.delete('/:cardId', deleteCard);
cardRouter.post('/', createCard);
cardRouter.put('/:cardId/likes', like);
cardRouter.delete('/:cardId/likes', dislike);

module.exports = cardRouter;
