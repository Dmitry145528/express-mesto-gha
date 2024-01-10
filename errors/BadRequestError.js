const http2 = require('http2');
const { AppError } = require('./AppError');

const HTTP2_STATUS = http2.constants;

class BadRequestError extends AppError {
  constructor(message) {
    super(message, HTTP2_STATUS.HTTP_STATUS_BAD_REQUEST);
  }
}

module.exports = {
  BadRequestError,
};
