const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/routes');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

app.use('/', router);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
