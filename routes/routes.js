const http2 = require('http2');
const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');

const HTTP2_STATUS = http2.constants;

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use((req, res) => {
  res.status(HTTP2_STATUS.HTTP_STATUS_NOT_FOUND).send({ message: 'Страница не найдена' });
});

module.exports = router;
