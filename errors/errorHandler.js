const http2 = require('http2');
const { AppError } = require('./AppError');

const HTTP2_STATUS = http2.constants;

const errorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || HTTP2_STATUS.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  let errorMessage = { messgae: 'На сервере произошла ошибка' };

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    errorMessage = { message: error.message };
  }

  next();
  return res.status(statusCode).send(errorMessage);
};

module.exports = {
  errorHandler,
};
