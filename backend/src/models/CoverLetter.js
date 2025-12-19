const mongoose = require('mongoose');

const coverLetterSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    resume: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resume',
        required: true
    },
    jobTitle: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        default: ''
    },
    jobDescription: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('CoverLetter', coverLetterSchema);
