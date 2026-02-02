const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { exportLimiter } = require('../middleware/rateLimiter');
const { exportPDF, exportDOCX } = require('../controllers/exportController');

// Apply rate limiting to export endpoints
router.get('/pdf/:id', auth, exportLimiter, exportPDF);
router.get('/docx/:id', auth, exportLimiter, exportDOCX);

module.exports = router;