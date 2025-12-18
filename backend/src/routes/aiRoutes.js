const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { generateAIResume } = require('../controllers/aiController');

router.post('/generate', auth, generateAIResume);

module.exports = router;
