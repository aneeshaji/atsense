const Resume = require('../models/Resume');

// CREATE
exports.createResume = async (req, res) => {
	try {
		const resume = await Resume.create({
			user: req.user,
			...req.body
		});
		res.status(201).json(resume);
	} catch (err) {
		res.status(500).json({ message: 'Error creating resume' });
	}
};

// GET ALL
exports.getResumes = async (req, res) => {
	const resumes = await Resume.find({ user: req.user });
	res.json(resumes);
};

// GET ONE
exports.getResume = async (req, res) => {
	const resume = await Resume.findOne({
		_id: req.params.id,
		user: req.user
	});
	if (!resume) {
		return res.status(404).json({ message: 'Resume not found' });
	}
	res.json(resume);
};

// UPDATE
exports.updateResume = async (req, res) => {
	const resume = await Resume.findOneAndUpdate(
		{ _id: req.params.id, user: req.user },
		req.body,
		{ new: true }
	);
	res.json(resume);
};

// DELETE
exports.deleteResume = async (req, res) => {
	await Resume.findOneAndDelete({
		_id: req.params.id,
		user: req.user
	});
	res.json({ message: 'Resume deleted' });
};

// GET ATS BREAKDOWN
const { getDetailedScore } = require('../utils/atsScorer');

exports.getATSBreakdown = async (req, res) => {
	try {
		const resume = await Resume.findOne({
			_id: req.params.id,
			user: req.user
		});

		if (!resume) {
			return res.status(404).json({ message: 'Resume not found' });
		}

		const jobDescription = resume.jobDescription || '';
		const breakdown = getDetailedScore(resume, jobDescription);

		res.json(breakdown);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Error calculating ATS breakdown' });
	}
};

// IMPORT
const parseService = require('../services/parseService');
const aiService = require('../services/aiResumeService');

exports.importResume = async (req, res) => {
	try {
		if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

		// 1. Extract Text
		const text = await parseService.extractText(req.file);

		if (!text || text.trim().length === 0) {
			return res.status(400).json({
				message: 'Could not extract any text from this resume.',
				error: 'The PDF appears to be image-based and OCR failed. Please ensure Poppler is installed on the server.'
			});
		}

		// 2. AI Parse
		const parsedData = await aiService.parseResumeJSON(text);

		// 3. Create Resume
		const resume = await Resume.create({
			user: req.user,
			title: `Imported Resume - ${new Date().toLocaleDateString()}`,
			...parsedData
		});

		res.status(201).json(resume);

	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Error importing resume: ' + err.message });
	}
};
