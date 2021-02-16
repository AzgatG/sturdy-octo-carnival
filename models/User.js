const {Schema, model} = require('mongoose');

const ROLES = {
	ADMIN: 'admin',
	USER: 'user',
};

const schema = new Schema({
	email: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	role: {
		type: String,
		default: ROLES.USER,
	},
});

module.exports = model('User', schema);
