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
