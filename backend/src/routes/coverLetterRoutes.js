const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const controller = require('../controllers/coverLetterController');

router.use(auth);

router.post('/', controller.createCoverLetter);
router.get('/', controller.getCoverLetters);
router.get('/:id', controller.getCoverLetter);
router.delete('/:id', controller.deleteCoverLetter);

module.exports = router;
