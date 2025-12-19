const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

exports.generateResumeContent = async ({ jobTitle, jobDescription, experience }) => {
  const prompt = `
You are an elite Career Coach and Resume Writer who has helped thousands land jobs at Google, Amazon, Microsoft, and other top companies.

MISSION: Generate a one-page ATS-friendly resume that showcases ALL experiences, achievements, and skillsets to land a job interview at ${jobTitle}.

Current Experience Data:
${JSON.stringify(experience, null, 2)}

Target Job Description:
${jobDescription}

CRITICAL REQUIREMENTS:
1. **Professional Summary**: Write a powerful 2-3 sentence summary that immediately grabs attention and positions the candidate as the perfect fit for ${jobTitle}
2. **Skills**: Extract and list 8-12 highly relevant technical skills, tools, and technologies that match the job description. Prioritize keywords from the JD.
3. **Experience Optimization**: For EACH job role, rewrite responsibilities to:
   - Start with strong action verbs (Led, Architected, Implemented, Drove, Optimized)
   - Include quantifiable achievements (increased by X%, reduced by Y, managed team of Z)
   - Highlight impact and results, not just duties
   - Use keywords from the job description naturally
   - Keep each bullet concise but impactful (1-2 lines max)
   - Aim for 3-5 bullets per role

TONE: Confident, achievement-focused, results-driven
STYLE: ATS-friendly (no tables, simple formatting, keyword-rich)
GOAL: Make the hiring manager think "I NEED to interview this person"

Return STRICT JSON format:
{
  "summary": "Compelling 2-3 sentence professional summary",
  "skills": ["skill1", "skill2", "skill3", ...],
  "experience": [
    {
      "jobTitle": "keep original",
      "responsibilities": ["Optimized bullet 1 with impact", "Optimized bullet 2 with metrics", ...]
    }
  ]
}

Make every word count. This resume needs to stand out and get past ATS systems AND impress human recruiters.
`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7, // Higher creativity for compelling content
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0]?.message?.content || "{}";
    return JSON.parse(content);

  } catch (error) {
    console.error('Groq Generation Error:', error);
    throw new Error(`Groq Error: ${error.message}`);
  }
};

exports.parseResumeJSON = async (text) => {
  const prompt = `
You are an Expert Resume Parser. Extract ALL data from the following Resume Text into STRICT JSON.

Resume Text:
${text.substring(0, 15000)}

CRITICAL RULES:
- Extract EVERY piece of information you can find
- Be thorough - don't skip any details
- Extract full contact information including social links
- Extract ALL work experiences with complete details
- Extract ALL skills mentioned (technical, soft skills, tools, languages)
- Extract projects, certifications, languages spoken
- For dates, use formats like "Jan 2020" or "2020-2023"
- For responsibilities, extract ALL bullet points as separate array items
- If a field is not found, use empty array [] or empty string "", never omit it
- Return ONLY valid JSON, no markdown formatting

Required Format:
{
  "personalInfo": {
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "location": "string (city, state/country)",
    "linkedin": "string (full URL or username)",
    "github": "string (full URL or username)",
    "portfolio": "string (website URL)"
  },
  "summary": "string (professional summary/objective)",
  "skills": ["skill1", "skill2", "..."],
  "experience": [
    {
      "jobTitle": "string",
      "company": "string",
      "startDate": "string",
      "endDate": "string (or 'Present')",
      "responsibilities": ["bullet1", "bullet2", "..."]
    }
  ],
  "education": [
    {
      "degree": "string (e.g., Bachelor of Science in Computer Science)",
      "institution": "string (university name)",
      "year": "string (e.g., 2020 or 2018-2022)"
    }
  ],
  "certifications": [
    {
      "name": "string (certification name)",
      "issuer": "string (issuing organization)",
      "date": "string (year or month/year)"
    }
  ],
  "projects": [
    {
      "title": "string",
      "description": "string (brief description)",
      "technologies": ["tech1", "tech2"],
      "link": "string (GitHub/demo URL if available)"
    }
  ],
  "languages": [
    {
      "language": "string (language name)",
      "proficiency": "string (Native/Fluent/Professional/Conversational)"
    }
  ]
}

EXTRACT EVERYTHING - be comprehensive!
`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.2, // Slightly higher for better extraction
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(content);

    console.log('AI Parsed Resume:', JSON.stringify(parsed, null, 2));
    return parsed;

  } catch (error) {
    console.error('Groq Parsing Error:', error);
    throw new Error(`Groq Parsing Error: ${error.message}`);
  }
};

exports.generateCoverLetter = async (resumeData, jobTitle, companyName, jobDescription) => {
  const prompt = `
  You are an expert Reviewer and Career Coach. Write a highly personalized, professional Cover Letter.
  
  My Resume Details:
  - Name: ${resumeData.personalInfo?.fullName}
  - Skills: ${resumeData.skills?.join(', ')}
  - Experience: ${JSON.stringify(resumeData.experience?.map(e => ({ title: e.jobTitle, company: e.company, duties: e.responsibilities })))}
  
  Target Job:
  - Role: ${jobTitle}
  - Company: ${companyName}
  - Description: ${jobDescription}
  
  Instructions:
  1. Address the hiring manager professionally.
  2. Hook them in the first paragraph by mentioning the specific role and why I am a great fit.
  3. Use specific examples from my experience to prove I can solve their problems (based on the JD).
  4. Keep it concise (3-4 paragraphs max).
  5. Close professionally.
  6. Return ONLY the body of the letter (do not include "Subject:" or placeholders if possible, or keep them minimal).
  `;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7, // Slightly higher creativity for writing
    });

    return completion.choices[0]?.message?.content || "Could not generate cover letter.";

  } catch (error) {
    console.error('Groq Cover Letter Error:', error);
    throw new Error(`Groq Error: ${error.message}`);
  }
};

exports.analyzeJobMatch = async (resumeData, jobDescription) => {
  const prompt = `
You are an ATS Scoring Engine. Compare the Resume against the Job Description.

Resume:
- Skills: ${resumeData.skills?.join(', ')}
- Experience: ${JSON.stringify(resumeData.experience?.map(e => e.jobTitle + ' ' + e.responsibilities?.join(' ')))}

Job Description:
${jobDescription.substring(0, 5000)}

Return STRICT JSON:
{
  "score": number (0-100),
  "missingKeywords": ["string", "string"],
  "matchingKeywords": ["string", "string"],
  "summary": "1 sentence analysis"
}
`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1,
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0]?.message?.content || "{}";
    return JSON.parse(content);

  } catch (error) {
    console.error('Groq Job Match Error:', error);
    throw new Error(`Groq Error: ${error.message}`);
  }
};

exports.optimizeLinkedIn = async (resumeData, targetRole) => {
  const prompt = `
  You are a LinkedIn Viral Growth Expert and Career Coach. 
  Optimize the following profile based on the candidate's resume and target role.
  
  Candidate Data:
  - Name: ${resumeData.personalInfo?.fullName || 'Candidate'}
  - Target Role: ${targetRole || 'Industry Professional'}
  - Resume Summary: ${resumeData.summary}
  - Key Skills: ${resumeData.skills?.join(', ')}
  - Top Experience: ${JSON.stringify(resumeData.experience?.slice(0, 2).map(e => e.jobTitle + ' at ' + e.company))}
  
  Generate the following LinkedIn Profile sections in STRICT JSON:
  
  1. **Headline**: 3 options. Catchy, keyword-rich, and high-impact. (e.g., "Full Stack Dev | React & Node.js | Building Scalable Tech").
  2. **About**: A compelling, first-person narrative (2-3 paragraphs). Hook the reader, tell a professional story, and mention key achievements. Tone: Professional but approachable.
  3. **Featured Skills**: List of 5-10 top skills to pin.
  4. **Experience Bullets**: For the latest role, provide 3 "LinkedIn-ready" bullet points that are punchy and metric-heavy (different from the resume, optimized for social skimming).
  
  Return STRICT JSON:
  {
    "headlines": ["Option 1", "Option 2", "Option 3"],
    "about": "string (markdown allowed)",
    "featuredSkills": ["skill1", "skill2"],
    "experienceImprovements": ["bullet1", "bullet2", "bullet3"]
  }
  `;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0]?.message?.content || "{}";
    return JSON.parse(content);

  } catch (error) {
    console.error('Groq LinkedIn Error:', error);
    throw new Error(`Groq Error: ${error.message}`);
  }
};
