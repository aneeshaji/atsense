const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const controller = require('../controllers/resumeController');

const upload = require('multer')({ storage: require('multer').memoryStorage() });

router.use(auth);

router.post('/import', upload.single('resume'), controller.importResume);
router.post('/', controller.createResume);
router.get('/', controller.getResumes);
router.get('/:id', controller.getResume);
router.get('/:id/ats-breakdown', controller.getATSBreakdown);
router.put('/:id', controller.updateResume);
router.delete('/:id', controller.deleteResume);

module.exports = router;
