const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const router = require('./routes/routes');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { errorHandler } = require('./errors/errorHandler');

const { PORT, MONGO_URL } = process.env;

const app = express();

mongoose.connect(MONGO_URL);

app.use(express.json());
app.use(cookieParser());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(
      /^https?:\/\/(?:www\.)?[a-zA-Z0-9-._~:/?#[\]@!$&`()*+,;=]+#?/,
    ),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.use(auth);
app.use('/', router);

app.use(errors());
app.use(errorHandler);

app.listen(PORT);
