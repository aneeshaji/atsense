const normalizeText = (text = '') =>
	text.toLowerCase().replace(/[^a-z0-9 ]/g, '');

const extractKeywords = (text) => {
	const stopWords = [
		'and', 'or', 'the', 'a', 'an', 'to', 'for', 'with', 'in', 'on', 'of',
		'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
		'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might',
		'can', 'this', 'that', 'these', 'those', 'as', 'at', 'by', 'from'
	];

	return normalizeText(text)
		.split(/\s+/)
		.filter(word => word.length > 2 && !stopWords.includes(word));
};

exports.calculateATSScore = (resume, jobDescription) => {
	let score = 0;
	const weights = {
		keywords: 40,
		skills: 20,
		experience: 15,
		education: 10,
		formatting: 10,
		completeness: 5
	};

	// 1. Keyword Matching (40 points)
	const jdKeywords = extractKeywords(jobDescription);
	const resumeText = `
    ${resume.summary || ''}
    ${(resume.skills || []).join(' ')}
    ${(resume.experience || []).map(e => (e.responsibilities || []).join(' ')).join(' ')}
    ${(resume.education || []).map(e => `${e.degree} ${e.institution}`).join(' ')}
  `;

	const resumeKeywords = extractKeywords(resumeText);
	const uniqueJdKeywords = [...new Set(jdKeywords)];
	const matched = uniqueJdKeywords.filter(word => resumeKeywords.includes(word));

	const keywordScore = Math.min(
		(matched.length / Math.max(uniqueJdKeywords.length, 1)) * weights.keywords,
		weights.keywords
	);
	score += keywordScore;

	// 2. Skills Evaluation (20 points)
	const skillsCount = (resume.skills || []).length;
	if (skillsCount >= 8) {
		score += weights.skills;
	} else if (skillsCount >= 5) {
		score += weights.skills * 0.7;
	} else if (skillsCount >= 3) {
		score += weights.skills * 0.4;
	}

	// 3. Experience Evaluation (15 points)
	const experienceCount = (resume.experience || []).length;
	const hasDetailedExp = (resume.experience || []).some(
		exp => (exp.responsibilities || []).length >= 3
	);

	if (experienceCount > 0 && hasDetailedExp) {
		score += weights.experience;
	} else if (experienceCount > 0) {
		score += weights.experience * 0.6;
	}

	// 4. Education Evaluation (10 points)
	const educationCount = (resume.education || []).length;
	if (educationCount > 0) {
		score += weights.education;
	}

	// 5. Formatting/Structure (10 points)
	const hasValidEmail = resume.personalInfo?.email &&
		/^\S+@\S+\.\S+$/.test(resume.personalInfo.email);
	const hasPhone = resume.personalInfo?.phone &&
		resume.personalInfo.phone.length >= 10;
	const hasSummary = resume.summary && resume.summary.length >= 50;

	let formatScore = 0;
	if (hasValidEmail) formatScore += 3;
	if (hasPhone) formatScore += 3;
	if (hasSummary) formatScore += 4;
	score += formatScore;

	// 6. Completeness Check (5 points)
	const hasFullName = resume.personalInfo?.fullName &&
		resume.personalInfo.fullName.length >= 3;
	const hasLocation = resume.personalInfo?.location;

	let completenessScore = 0;
	if (hasFullName) completenessScore += 2.5;
	if (hasLocation) completenessScore += 2.5;
	score += completenessScore;

	return Math.round(Math.min(score, 100));
};

// Export individual scoring components for detailed feedback
exports.getDetailedScore = (resume, jobDescription) => {
	const weights = {
		keywords: 40,
		skills: 20,
		experience: 15,
		education: 10,
		formatting: 10,
		completeness: 5
	};

	// Keyword Analysis
	const jdKeywords = extractKeywords(jobDescription);
	const resumeText = `
    ${resume.summary || ''}
    ${(resume.skills || []).join(' ')}
    ${(resume.experience || []).map(e => (e.responsibilities || []).join(' ')).join(' ')}
  `;
	const resumeKeywords = extractKeywords(resumeText);
	const uniqueJdKeywords = [...new Set(jdKeywords)];
	const matched = uniqueJdKeywords.filter(word => resumeKeywords.includes(word));
	const missingKeywords = uniqueJdKeywords.filter(word => !matched.includes(word)).slice(0, 10);

	const keywordScore = Math.min(
		(matched.length / Math.max(uniqueJdKeywords.length, 1)) * 100,
		100
	);

	// Skills Score
	const skillsCount = (resume.skills || []).length;
	let skillsScore = 0;
	if (skillsCount >= 8) skillsScore = 100;
	else if (skillsCount >= 5) skillsScore = 70;
	else if (skillsCount >= 3) skillsScore = 40;

	// Experience Score
	const experienceCount = (resume.experience || []).length;
	const hasDetailedExp = (resume.experience || []).some(
		exp => (exp.responsibilities || []).length >= 3
	);
	let experienceScore = 0;
	if (experienceCount > 0 && hasDetailedExp) experienceScore = 100;
	else if (experienceCount > 0) experienceScore = 60;

	// Education Score
	const educationCount = (resume.education || []).length;
	const educationScore = educationCount > 0 ? 100 : 0;

	// Formatting Score
	const hasValidEmail = resume.personalInfo?.email && /^\S+@\S+\.\S+$/.test(resume.personalInfo.email);
	const hasPhone = resume.personalInfo?.phone && resume.personalInfo.phone.length >= 10;
	const hasSummary = resume.summary && resume.summary.length >= 50;
	const hasLinkedIn = resume.personalInfo?.linkedin;

	let formattingScore = 0;
	if (hasValidEmail) formattingScore += 30;
	if (hasPhone) formattingScore += 30;
	if (hasSummary) formattingScore += 30;
	if (hasLinkedIn) formattingScore += 10;

	// Completeness Score
	const hasFullName = resume.personalInfo?.fullName && resume.personalInfo.fullName.length >= 3;
	const hasLocation = resume.personalInfo?.location;
	const hasProjects = (resume.projects || []).length > 0;
	const hasCertifications = (resume.certifications || []).length > 0;

	let completenessScore = 0;
	if (hasFullName) completenessScore += 25;
	if (hasLocation) completenessScore += 25;
	if (hasProjects) completenessScore += 25;
	if (hasCertifications) completenessScore += 25;

	// Calculate weighted overall score
	const overallScore = Math.round(
		(keywordScore * weights.keywords / 100) +
		(skillsScore * weights.skills / 100) +
		(experienceScore * weights.experience / 100) +
		(educationScore * weights.education / 100) +
		(formattingScore * weights.formatting / 100) +
		(completenessScore * weights.completeness / 100)
	);

	// Generate issues
	const issues = [];
	if (!hasValidEmail) issues.push('Missing valid email address');
	if (!hasPhone) issues.push('Missing phone number');
	if (!hasSummary) issues.push('Professional summary is too short or missing');
	if (!hasLinkedIn) issues.push('No LinkedIn profile link');
	if (skillsCount < 5) issues.push('Add more skills (target: 5-10)');
	if (!hasProjects) issues.push('No projects section');
	if (!hasCertifications) issues.push('No certifications listed');
	if (experienceCount === 0) issues.push('No work experience added');

	// Generate recommendations
	const recommendations = [];
	if (missingKeywords.length > 0) {
		recommendations.push(`Add these keywords: ${missingKeywords.slice(0, 5).join(', ')}`);
	}
	if (skillsCount < 8) {
		recommendations.push('Add 3-5 more relevant technical skills');
	}
	if (!hasDetailedExp && experienceCount > 0) {
		recommendations.push('Add 3-5 bullet points per job role');
	}
	if (!hasSummary) {
		recommendations.push('Write a 2-3 sentence professional summary');
	}
	if (!hasProjects) {
		recommendations.push('Add 2-3 projects to showcase your work');
	}

	return {
		overallScore,
		breakdown: {
			keywords: { score: Math.round(keywordScore), weight: weights.keywords, max: 100 },
			skills: { score: Math.round(skillsScore), weight: weights.skills, max: 100 },
			experience: { score: Math.round(experienceScore), weight: weights.experience, max: 100 },
			education: { score: Math.round(educationScore), weight: weights.education, max: 100 },
			formatting: { score: Math.round(formattingScore), weight: weights.formatting, max: 100 },
			completeness: { score: Math.round(completenessScore), weight: weights.completeness, max: 100 }
		},
		missingKeywords: missingKeywords.slice(0, 10),
		matchedKeywords: matched.slice(0, 10),
		issues,
		recommendations
	};
};

const generateSuggestions = (resume, matched, allKeywords) => {
	const suggestions = [];

	const missingKeywords = allKeywords.filter(word => !matched.includes(word));
	if (missingKeywords.length > 0) {
		suggestions.push(`Add these keywords: ${missingKeywords.slice(0, 5).join(', ')}`);
	}

	if ((resume.skills || []).length < 5) {
		suggestions.push('Add more relevant skills (target: 5-10 skills)');
	}

	if (!resume.summary || resume.summary.length < 50) {
		suggestions.push('Add a professional summary (2-3 sentences)');
	}

	if ((resume.experience || []).length === 0) {
		suggestions.push('Add work experience with detailed responsibilities');
	}

	return suggestions;
};