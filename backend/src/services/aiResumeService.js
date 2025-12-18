const OpenAI = require('openai');

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY
});

exports.generateResumeContent = async ({ jobTitle, jobDescription, experience }) => {
	const prompt = `
You are an ATS optimization engine.

Generate ATS-friendly resume content in STRICT JSON format.

Rules:
- Use simple language
- Avoid tables, icons, emojis
- Bullet points must be short and impact-driven
- Include industry keywords
- Output VALID JSON ONLY

Return format:
{
  "summary": "string",
  "skills": ["skill1", "skill2"],
  "experience": [
    {
      "jobTitle": "string",
      "responsibilities": ["point1", "point2"]
    }
  ]
}

Job Title: ${jobTitle}
Job Description: ${jobDescription}
User Experience: ${experience}
`;

	const response = await openai.chat.completions.create({
		model: 'gpt-4o-mini',
		messages: [{ role: 'user', content: prompt }],
		temperature: 0.3
	});

	return JSON.parse(response.choices[0].message.content);
};
