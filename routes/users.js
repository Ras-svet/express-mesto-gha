const { celebrate, Joi } = require('celebrate');

const userRouter = require('express').Router();
const {
  getUsers, myInfo, getUserById, updateProfile, updateAvatar,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/me', myInfo);
userRouter.get('/:userId', getUserById);
userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);
userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/^https?:\S+.(?:jpe?g|png)$/),
  }),
}), updateAvatar);

module.exports = userRouter;
