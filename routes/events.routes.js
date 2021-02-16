const {Router} = require('express');
// const config = require('config');
const {check, validationResult} = require('express-validator');

const {Events, getNextEventId} = require('../models/Events');
const {Participants, getNextParticipantId} = require('../models/Participants');
const auth = require('../middleware/auth.middleware');
const isAdmin = require('../middleware/isAdmin.middleware');

const router = Router();

// router.post('/events', auth, async (req, res) => {});
// get all events
router.get('/', async (req, res) => {
	try {
		return res.json({events: await Events.find().exec()});
	} catch (e) {
		console.log('e', e);
		return res.status(500).json({message: 'Server error'});
	}
});

// create event
router.post(
	'/',
	[
		check('name', 'isEmpty').not().isEmpty().trim().isLength({min: 3}),
		check('date', 'isEmpty').not().isEmpty().toDate(),
	],
	isAdmin,
	async (req, res) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array(),
					message: 'Bad params',
				});
			}

			const {name, date} = req.body;
			if (date < new Date()) {
				return res.status(400).json({
					message: 'Bad date',
				});
			}

			const nextEvenId = await getNextEventId();
			const event = new Events({
				name,
				date: new Date(date),
				id: nextEvenId,
			});

			await event.save();

			return res.json({event});
		} catch (e) {
			return res.status(500).json({message: 'Server error'});
		}
	},
);

// delete event
router.delete('/:id', isAdmin, async (req, res) => {
	let {id} = req.params;

	if (!id) {
		return res.status(400).json({message: 'ID param required'});
	}
	id = Number(id);

	const event = await Events.deleteOne({id});

	if (!event.deletedCount) {
		return res.status(401).json({message: 'Event not found'});
	}

	await Participants.deleteMany({id});

	return res.status(204).end();
});

// add partisipant to event
router.post(
	'/:id/participants',
	[
		check('first_name', 'isEmpty').not().isEmpty().trim().isLength({min: 1}),
		check('middle_name', 'isEmpty').not().isEmpty().trim().isLength({min: 1}),
		check('last_name', 'isEmpty').not().isEmpty().trim().isLength({min: 1}),
		check('photo_url', 'isEmpty').not().isEmpty().trim().isLength({min: 1}),
	],
	isAdmin,
	async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array(),
				message: 'Bad params',
			});
		}

		let {id} = req.params;
		if (!id) {
			return res.status(400).json({message: 'ID param required'});
		}

		id = Number(id);
		let event = await Events.findOne({id});
		if (!event) {
			return res.status(401).json({message: 'Event not found'});
		}

		const {first_name, middle_name, last_name, photo_url} = req.body;
		const participantId = await getNextParticipantId();
		const participant = new Participants({
			first_name,
			middle_name,
			last_name,
			photo_url,
			eventId: event._id,
			id: participantId,
		});
		await participant.save();

		event = event.toObject();
		event.participants = await Participants.find(
			{eventId: event._id},
			{eventId: 0, _v: 0},
		).exec();

		return res.json({event});
	},
);

// get event info with all partisipants
router.get('/:id', auth, async (req, res) => {
	let {id} = req.params;

	if (!id) {
		res.status(400).json({message: 'ID param required'});
	}
	id = Number(id);

	let event = await Events.findOne({id}).exec();

	if (!event) {
		res.status(401).json({message: 'Event not found'});
	}
	event = event.toObject();
	event.participants = await Participants.find({eventId: event._id}, {eventId: 0, _v: 0}).exec();

	return res.status(200).json({event});
});

module.exports = router;
