const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, 'Минимальная длина 2 символа'],
      maxlength: [30, 'Максимальная длина 30 символов'],
      required: [true, 'Поле name является обязательным'],
    },
    link: {
      type: String,
      required: [true, 'Поле link является обязательным'],
      validate: {
        validator: (value) => validator.isURL(value, { protocols: ['http', 'https'], require_protocol: true }),
        message: 'Неверный формат ссылки',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: [true, 'Поле owner является обязательным'],
    },
    likes: {
      type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      }],
      default: [],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

module.exports = mongoose.model('card', cardSchema);
