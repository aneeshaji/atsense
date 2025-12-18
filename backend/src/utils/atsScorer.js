const normalizeText = (text = '') =>
	text.toLowerCase().replace(/[^a-z0-9 ]/g, '');

const extractKeywords = (text) => {
	const stopWords = [
		'and', 'or', 'the', 'a', 'an', 'to', 'for', 'with', 'in', 'on', 'of'
	];
	return normalizeText(text)
		.split(' ')
		.filter(word => word.length > 2 && !stopWords.includes(word));
};

exports.calculateATSScore = (resume, jobDescription) => {
	let score = 0;

	const jdKeywords = extractKeywords(jobDescription);
	const resumeText = `
    ${resume.summary}
    ${resume.skills.join(' ')}
    ${resume.experience.map(e => e.responsibilities.join(' ')).join(' ')}
  `;

	const resumeKeywords = extractKeywords(resumeText);

	const matched = jdKeywords.filter(word =>
		resumeKeywords.includes(word)
	);

	const keywordScore = Math.min(
		(matched.length / jdKeywords.length) * 50,
		50
	);

	score += keywordScore;

	// Skills presence
	if (resume.skills.length >= 5) score += 15;
	if (resume.experience.length > 0) score += 15;
	if (resume.education.length > 0) score += 10;

	return Math.round(Math.min(score, 100));
};
