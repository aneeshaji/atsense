const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { generateAIResume, matchJob } = require('../controllers/aiController');

router.post('/generate', auth, generateAIResume);
router.post('/match', auth, matchJob);
router.post('/linkedin-optimize', auth, require('../controllers/aiController').optimizeLinkedIn);

module.exports = router;
