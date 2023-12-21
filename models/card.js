const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Поле name является обязательным'],
      minlength: [2, 'Минимальная длина 2 символа'],
      maxlength: [30, 'Максимальная длина 30 символов'],
    },
    link: {
      type: String,
      required: [true, 'Поле link является обязательным'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user', // Предполагается, что у вас есть модель User
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
