const {Schema, model} = require('mongoose');

const schema = new Schema(
	{
		id: {
			type: Number,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		date: {
			type: Date,
			required: true,
			default: new Date(),
		},
	},
	{strict: false},
);

const Events = model('Events', schema);

const getNextEventId = async () => {
	const lastEvent = await Events.findOne({}, {id: 1}).sort({id: -1}).exec();

	return lastEvent ? lastEvent.id + 1 : 1;
};

module.exports = {
	Events,
	getNextEventId,
};
