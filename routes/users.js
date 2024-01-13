const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getMyProfile,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/me', getMyProfile);
userRouter.get('/:userId', getUserById);
userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);
userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(
      /^https?:\/\/(?:www\.)?[a-zA-Z0-9-._~:/?#[\]@!$&`()*+,;=]+#?/,
    ),
  }),
}), updateAvatar);

module.exports = userRouter;
