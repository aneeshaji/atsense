const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},

		title: {
			type: String,
			default: 'My ATS Resume'
		},

		personalInfo: {
			fullName: String,
			email: String,
			phone: String,
			location: String,
			linkedin: String,
			github: String,
			portfolio: String
		},

		summary: String,

		skills: [String],

		experience: [
			{
				jobTitle: String,
				company: String,
				startDate: String,
				endDate: String,
				responsibilities: [String]
			}
		],

		education: [
			{
				degree: String,
				institution: String,
				year: String
			}
		],

		atsScore: {
			type: Number,
			default: 0
		},

		jobDescription: String
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Resume', ResumeSchema);
