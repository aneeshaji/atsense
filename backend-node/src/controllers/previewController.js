const Resume = require('../models/Resume');
const { basicTemplate } = require('../services/templateService');

exports.previewResume = async (req, res) => {
	const resume = await Resume.findOne({
		_id: req.params.id,
		user: req.user
	});

	if (!resume) {
		return res.status(404).json({ message: 'Resume not found' });
	}

	const html = basicTemplate(resume);

	res.send(html);
};
