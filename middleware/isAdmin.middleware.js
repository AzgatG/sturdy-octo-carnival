const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

module.exports = (req, res, next) => {
	if (req.method === 'OPTIONS') {
		return next();
	}

	try {
		const token = req.headers.authorization?.split(' ')[1]; // "Bearer TOKEN"

		if (!token) {
			return res.status(401).json({message: 'need auth'});
		}

		try {
			const cert = fs.readFileSync(path.resolve(__dirname, '../public.key'));

			const user = jwt.verify(token, cert, {algorithms: ['ES256']});
			if (!user || (user && user.isAdmin !== '1')) {
				return res.status(401).json({message: 'need admin'});
			}
		} catch (e) {
			return res.status(401).json({message: 'need auth'});
		}

		next();
	} catch (e) {
		res.status(401).json({message: 'need auth'});
	}
};
