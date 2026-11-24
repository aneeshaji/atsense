const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { generateAIResume, matchJob } = require('../controllers/aiController');

const optionalAuth = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (authHeader && authHeader.startsWith('Bearer')) {
		try {
			const jwt = require('jsonwebtoken');
			const token = authHeader.split(' ')[1];
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.user = decoded.id;
		} catch (err) {
			// ignore token error for optional auth
		}
	}
	next();
};

router.post('/generate', auth, generateAIResume);
router.post('/match', auth, matchJob);
router.post('/linkedin-optimize', optionalAuth, require('../controllers/aiController').optimizeLinkedIn);

module.exports = router;
