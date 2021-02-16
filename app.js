const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const cors = require('cors');

if (!config.get('MONGO_URL')) {
	throw Error('MONGO_URL required');
}

// routes
const eventsRoutes = require('./routes/events.routes');

const app = express();
app.use(cors());
app.use(express.json({extended: true}));
app.use('/api/events', eventsRoutes);

async function start() {
	const PORT = config.get('PORT') || 5000;

	try {
		await mongoose.connect(`${config.get('MONGO_URL')}?authSource=admin`, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});
		app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`));
	} catch (e) {
		console.log('Server Error', e.message);
	}
}

start();
