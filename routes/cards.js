const { celebrate, Joi } = require('celebrate');
const cardRouter = require('express').Router();
const {
  getCards, createCard, deleteCardById, addLike, deleteLike,
} = require('../controllers/cards');

cardRouter.get('/', getCards);
cardRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/^https?:\S+.(?:jpe?g|png|bmp|test)$/),
  }),
}), createCard);
cardRouter.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().required(),
  }),
}), deleteCardById);
cardRouter.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().required(),
  }),
}), addLike);
cardRouter.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().required(),
  }),
}), deleteLike);

module.exports = cardRouter;
