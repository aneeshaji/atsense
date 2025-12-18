const Resume = require('../models/Resume');
const { generateResumeContent } = require('../services/aiResumeService');
const { calculateATSScore } = require('../utils/atsScorer');

exports.generateAIResume = async (req, res) => {
	const { resumeId, jobTitle, jobDescription } = req.body;

	const resume = await Resume.findOne({
		_id: resumeId,
		user: req.user
	});

	if (!resume) {
		return res.status(404).json({ message: 'Resume not found' });
	}

	const aiData = await generateResumeContent({
		jobTitle,
		jobDescription,
		experience: resume.experience
	});

	resume.summary = aiData.summary;
	resume.skills = aiData.skills;
	resume.experience = resume.experience.map((exp, idx) => ({
		...exp,
		responsibilities: aiData.experience[idx]?.responsibilities || exp.responsibilities
	}));

	// resume.atsScore = Math.floor(Math.random() * 20) + 75;

	resume.atsScore = calculateATSScore(resume, jobDescription);

	await resume.save();

	res.json(resume);
};
