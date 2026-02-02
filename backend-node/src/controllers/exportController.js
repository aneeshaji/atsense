const Resume = require('../models/Resume');
const { generatePDF } = require('../services/pdfService');
const { generateDOCX } = require('../services/docxService');

exports.exportPDF = async (req, res) => {
    const resume = await Resume.findOne({
        _id: req.params.id,
        user: req.user
    });

    if (!resume) {
        return res.status(404).json({ message: 'Resume not found' });
    }

    const pdfBuffer = await generatePDF(resume);

    res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${resume.title}.pdf"`
    });

    res.send(pdfBuffer);
};

exports.exportDOCX = async (req, res) => {
    const resume = await Resume.findOne({
        _id: req.params.id,
        user: req.user
    });

    if (!resume) {
        return res.status(404).json({ message: 'Resume not found' });
    }

    const docxBuffer = await generateDOCX(resume);

    res.set({
        'Content-Type':
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${resume.title}.docx"`
    });

    res.send(docxBuffer);
};
