const helmet = require('helmet');
const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const NotFoundError = require('./errors/not-found-error');
const auth = require('./middlewares/auth');

require('dotenv').config();

const app = express();
const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());

mongoose.connect(DB_URL)
  .then(() => { console.log('Connected to database'); })
  .catch((err) => { console.log(`Erorr ${err.name} ${err.message}`); });

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^https?:\S+.(?:jpe?g|png|bmp)$/),
    password: Joi.string().required(),
    email: Joi.string().required().email(),
  }),
}), createUser);

app.use(auth);
app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);

app.use(() => {
  throw new NotFoundError('Запрос отправлен по неправильному URL');
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === '500'
      ? 'Произошла ошибка на сервере'
      : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log('App listening on port 3000');
});
