const CoverLetter = require('../models/CoverLetter');
const Resume = require('../models/Resume');
const aiService = require('../services/aiResumeService');

// GENERATE NEW
exports.createCoverLetter = async (req, res) => {
    try {
        // Limit check
        const count = await CoverLetter.countDocuments({ user: req.user });
        if (count >= 3) {
            return res.status(403).json({
                message: 'Cover letter limit reached',
                error: 'You can only generate up to 3 cover letters in the free plan.'
            });
        }

        const { resumeId, jobTitle, companyName, jobDescription } = req.body;


        // 1. Get Resume Data
        const resume = await Resume.findOne({ _id: resumeId, user: req.user });
        if (!resume) return res.status(404).json({ message: 'Resume not found' });

        // 2. Generate Content
        const content = await aiService.generateCoverLetter(resume, jobTitle, companyName, jobDescription);

        // 3. Save
        const letter = await CoverLetter.create({
            user: req.user,
            resume: resumeId,
            jobTitle,
            companyName,
            jobDescription,
            content
        });

        res.status(201).json(letter);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error generating cover letter: ' + err.message });
    }
};

// GET ALL
exports.getCoverLetters = async (req, res) => {
    try {
        const letters = await CoverLetter.find({ user: req.user }).sort({ createdAt: -1 });
        res.json(letters);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching cover letters' });
    }
};

// GET ONE
exports.getCoverLetter = async (req, res) => {
    try {
        const letter = await CoverLetter.findOne({ _id: req.params.id, user: req.user });
        if (!letter) return res.status(404).json({ message: 'Not found' });
        res.json(letter);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching cover letter' });
    }
};

// DELETE
exports.deleteCoverLetter = async (req, res) => {
    try {
        await CoverLetter.findOneAndDelete({ _id: req.params.id, user: req.user });
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting cover letter' });
    }
};
