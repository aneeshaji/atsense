const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const controller = require('../controllers/resumeController');

router.use(auth);

router.post('/', controller.createResume);
router.get('/', controller.getResumes);
router.get('/:id', controller.getResume);
router.put('/:id', controller.updateResume);
router.delete('/:id', controller.deleteResume);

module.exports = router;
