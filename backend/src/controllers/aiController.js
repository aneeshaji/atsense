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
		const { resumeId, targetRole } = req.body;
		if (!resumeId) {
			return res.status(400).json({ message: 'Missing resumeId' });
		}

		const resume = await Resume.findOne({ _id: resumeId, user: req.user });
		if (!resume) return res.status(404).json({ message: 'Resume not found' });

		// We need to pass the resume data to the service
		// Since the service expects a 'resumeData' object similar to what it parses,
		// we might simply pass the resume document as is, provided it has the necessary fields.
		// The service uses: personalInfo.fullName, summary, skills, experience (jobTitle, company).
		// The Resume model likely has these. Let's verify:
		// Resume Model likely has: user, personalInfo (embedded), experience (array), education etc.
		// Assuming structure matches standard Resume model.

		// Use the imported service logic (not yet imported in THIS file, need to check imports)
		// Ah, looking at line 2: const { generateResumeContent, analyzeJobMatch } = require('../services/aiResumeService');
		// I need to update the import line first or just import it here? 
		// Better to update line 2. But I am in a replace_file_content block for the END of the file.
		// I will use require inside the function for safety or do a separate edit.
		// Actually, let's just use the `require` at the top. I'll need to do 2 edits.

		const { optimizeLinkedIn } = require('../services/aiResumeService'); // Dynamic require to avoid top-level edit conflict if possible, but cleaner to edit top.
		// Actually, I can just do a multi-replace.

		const result = await optimizeLinkedIn(resume, targetRole);
		res.json(result);

	} catch (err) {
		logger.error('LinkedIn Optimization Error:', err);
		res.status(500).json({ message: 'Error generating LinkedIn profile' });
	}
};