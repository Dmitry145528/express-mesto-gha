const http2 = require('http2');
const { AppError } = require('./AppError');

const HTTP2_STATUS = http2.constants;

class NotFoundError extends AppError {
  constructor(message) {
    super(message, HTTP2_STATUS.HTTP_STATUS_NOT_FOUND);
  }
}

module.exports = {
  NotFoundError,
};
