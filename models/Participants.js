const {Schema, model} = require('mongoose');

const schema = new Schema({
	id: {
		type: Number,
		required: true,
	},

	eventId: {
		type: Schema.Types.ObjectId,
		required: true,
	},

	first_name: {
		type: String,
		required: true,
	},

	middle_name: {
		type: String,
	},

	last_name: {
		type: String,
	},

	photo_url: {
		type: String,
	},
});

const Participants = model('Participants', schema);

const getNextParticipantId = async () => {
	const lastParticipant = await Participants.findOne({}, {id: 1}).sort({id: -1}).exec();

	return lastParticipant ? lastParticipant.id + 1 : 1;
};

module.exports = {
	getNextParticipantId,
	Participants,
};
