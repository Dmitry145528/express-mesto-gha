const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, 'Минимальная длина 2 символа'],
      maxlength: [30, 'Максимальная длина 30 символов'],
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: [2, 'Минимальная длина 2 символа'],
      maxlength: [30, 'Максимальная длина 30 символов'],
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
    email: {
      type: String,
      required: {
        value: true,
        message: 'Поле email является обязательным',
      },
      unique: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: 'Некорректный формат email',
      },
    },
    password: {
      type: String,
      required: {
        value: true,
        message: 'Поле password является обязательным',
      },
      minlength: [8, 'Минимальная длина 8 символов'],
      select: false,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('user', userSchema);
