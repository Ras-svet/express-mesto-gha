const express = require('express');
const mongoose = require('mongoose');

const app = express();
const { PORT = 3000 } = process.env;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
	req.user = {
		_id: '654d437267918278c49d81c8'
	};
	next();
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
	.then(() => {console.log('Connected to database')})
	.catch((err) => {console.log(`Erorr ${err.name} ${err.message}`)})

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.listen(PORT, () => {
	console.log('App listening on port 3000')
})