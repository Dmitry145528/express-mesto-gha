const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/routes');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '6586ce173b387bd21083c9d7',
  };

  next();
});
app.use('/', router);

app.listen(PORT);
