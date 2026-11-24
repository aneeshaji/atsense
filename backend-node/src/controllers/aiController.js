const Resume = require('../models/Resume');
const { generateResumeContent, analyzeJobMatch } = require('../services/aiResumeService');
const { calculateATSScore } = require('../utils/atsScorer');
const logger = require('../utils/logger');

exports.generateAIResume = async (req, res) => {
	try {
		const { resumeId, jobTitle, jobDescription } = req.body;

		// Input validation
		if (!resumeId || !jobTitle || !jobDescription) {
			return res.status(400).json({
				message: 'Missing required fields: resumeId, jobTitle, jobDescription'
			});
		}

		// Validate ObjectId format
		if (!resumeId.match(/^[0-9a-fA-F]{24}$/)) {
			return res.status(400).json({ message: 'Invalid resume ID format' });
		}

		const resume = await Resume.findOne({
			_id: resumeId,
			user: req.user
		});

		if (!resume) {
			return res.status(404).json({ message: 'Resume not found' });
		}

		// AI content generation with error handling
		try {
			const aiData = await generateResumeContent({
				jobTitle,
				jobDescription,
				experience: resume.experience
			});

			// Validate AI response structure
			if (!aiData || !aiData.summary || !aiData.skills) {
				throw new Error('Invalid AI response structure');
			}

			resume.summary = aiData.summary;
			resume.skills = aiData.skills;

			// Safely map experience with validation
			if (aiData.experience && Array.isArray(aiData.experience)) {
				resume.experience = resume.experience.map((exp, idx) => ({
					...exp,
					responsibilities: aiData.experience[idx]?.responsibilities || exp.responsibilities
				}));
			}

			// Calculate ATS score
			resume.atsScore = calculateATSScore(resume, jobDescription);
			resume.jobDescription = jobDescription;

			await resume.save();

			logger.info(`AI resume generated for user ${req.user}, resume ${resumeId}`);
			res.json(resume);

		} catch (aiError) {
			logger.error('AI generation error:', aiError);
			res.status(503).json({
				message: 'AI service unavailable. Please try again later.',
				error: process.env.NODE_ENV === 'development' ? aiError.message : undefined
			});
		}

	} catch (err) {
		logger.error('Generate AI resume error:', err);
		res.status(500).json({
			message: 'Server error',
			error: process.env.NODE_ENV === 'development' ? err.message : undefined
		});
	}
};

exports.matchJob = async (req, res) => {
	try {
		const { resumeId, jobDescription } = req.body;
		if (!resumeId || !jobDescription) {
			return res.status(400).json({ message: 'Missing resumeId or jobDescription' });
		}

		const resume = await Resume.findOne({ _id: resumeId, user: req.user });
		if (!resume) return res.status(404).json({ message: 'Resume not found' });

		const result = await analyzeJobMatch(resume, jobDescription);
		res.json(result);

	} catch (err) {
		logger.error('Job Match Error:', err);
		res.status(500).json({ message: 'Error analyzing job match' });
	}
};

exports.optimizeLinkedIn = async (req, res) => {
	try {
		const { resumeId, resume: directResume, targetRole } = req.body;
		let resume = directResume;

		if (!resume && resumeId) {
			resume = await Resume.findOne({ _id: resumeId, user: req.user });
			if (!resume) return res.status(404).json({ message: 'Resume not found' });
		}

		if (!resume) {
			return res.status(400).json({ message: 'Missing resume data' });
		}

		const { optimizeLinkedIn } = require('../services/aiResumeService');
		const result = await optimizeLinkedIn(resume, targetRole);
		res.json(result);

	} catch (err) {
		logger.error('LinkedIn Optimization Error:', err);
		res.status(500).json({ message: 'Error generating LinkedIn profile', error: err.message });
	}
};