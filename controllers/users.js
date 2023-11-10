// const mongoose = require('mongoose');

const User = require('../models/user');

module.exports.getUsers = (req, res) => {
	User.find({})
		.then(users => res.status(200).send({data: users}))
		.catch(err => res.status(500).send({message: err.message}))
};

module.exports.getUserById = (req, res) => {
	User.findById(req.params.userId)
		.then((user) => (user ? res.status(200).send(user) : res.status(404).send(`Пользователь по указанному id не найден`)))
		.catch((err) => {
			if (err.name === 'CastError') {
				return res.status(400).send(`Неккоретный id пользователя`)
			}
			return res.status(500).send({message: err.message})
		})
};

module.exports.createUser = (req, res) => {
	const { name, about, avatar } = req.body;

	User.create({ name, about, avatar })
		.then(user => res.status(201).send(user))
		.catch((err) => {
			if (err.name === 'ValidationError') {
				return res.status(400).send({message: 'Переданы некорректные данные при создании пользователя'})
			}
			return res.status(500).send({message: err.message})
		})
}

module.exports.updateProfile = (req, res) => {
	const {name, about} = req.body;
	User.findByIdAndUpdate(req.user._id, {name, about}, {new: true, runValidators: true})
	.then((user) => (user ? res.status(200).send(user) : res.status(404).send({message: 'Пользователь с указанным _id не найден.'})))
	.catch((err) => {
		if (err.name === 'ValidationError') {
			return res.status(400).send({message: 'Переданы некорректные данные при обновлении профиля.'})
		}
		return res.status(500).send({message: err.message})
	})
}

module.exports.updateAvatar = (req, res) => {
	const {avatar} = req.body;
	User.findByIdAndUpdate(req.user._id, {avatar}, {new: true, runValidators: true})
		.then((user) => (user ? res.status(200).send(user) : res.status(404).send({message: 'Пользователь с указанным _id не найден.'})))
		.catch((err) => {
			if (err.name === 'ValidationError') {
				return res.status(400).send({message: 'Переданы некорректные данные при обновлении аватара'})
			}
			return res.status(500).send({message: err.message})
		})
}