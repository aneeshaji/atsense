const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { previewResume } = require('../controllers/previewController');

router.get('/:id', auth, previewResume);

module.exports = router;
