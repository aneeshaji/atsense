<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AIService
{
    protected $apiKey;
    protected $baseUrl = 'https://api.groq.com/openai/v1';
    protected $model = 'llama-3.3-70b-versatile';

    public function __construct()
    {
        $this->apiKey = env('GROQ_API_KEY');
    }

    /**
     * Send chat completion request to Groq
     */
    protected function chat($messages, $temperature = 0.7, $json = false)
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/chat/completions', [
                'model' => $this->model,
                'messages' => $messages,
                'temperature' => $temperature,
                'response_format' => $json ? ['type' => 'json_object'] : null,
            ]);

            if ($response->failed()) {
                Log::error('Groq API Error: ' . $response->body());
                throw new \Exception('AI Service failure: ' . $response->status());
            }

            return $response->json()['choices'][0]['message']['content'];

        } catch (\Exception $e) {
            Log::error('Interview Evaluation Failed: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Evaluate an Interview Answer
     */
    public function evaluateInterviewAnswer($question, $answer, $jobDescription)
    {
        $prompt = "
You are an expert Interviewer and HR specialist.
Evaluate the candidate's answer to this question.

CONTEXT (JOB DESCRIPTION):
{$jobDescription}

QUESTION:
{$question}

CANDIDATE'S ANSWER:
{$answer}

Analyze the answer based on:
1. STAR Method (Situation, Task, Action, Result)
2. Relevance to the role
3. Professionalism and clarity

Return STRICT JSON:
{
  'score': number (1-10),
  'goodPoints': ['specific point 1', 'specific point 2'],
  'improvements': ['concrete advice 1', 'concrete advice 2'],
  'sampleBetterAnswer': 'A 1-2 sentence example of a perfect answer.'
}
";
        $response = $this->chat([['role' => 'user', 'content' => $prompt]], 0.6, true);
        return json_decode($this->cleanJson($response), true);
    }

    public function generateResumeContent($jobTitle, $jobDescription, $experience)
    {
        $prompt = '
You are an elite ATS Resume Specialist and Career Coach.
MISSION: Rewrite this resume to be maximally ATS-optimized for the target role.
TARGET JOB: ' . $jobTitle . '
JOB DESCRIPTION: ' . $jobDescription . '

CANDIDATE EXPERIENCE:
' . json_encode($experience, JSON_PRETTY_PRINT) . '

CRITICAL INSTRUCTIONS:
1. Summary: 2-3 powerful sentences. Start with a strong adjective. Tailor keywords directly from JD.
2. Skills: Group them by category using "Category: skill1, skill2" format. Use 3-5 categories (e.g. "Core Skills", "Tools & Technologies", "Methodologies", "Languages").
3. Experience bullets: Rewrite to be quantifiable, result-oriented (Challenge-Action-Result). Start each with a strong action verb.
4. Field names MUST exactly match the schema below.

Return STRICT JSON — field names must match EXACTLY:
{
  "summary": "2-3 sentence compelling summary",
  "skills": [
    "Core Skills: skill1, skill2, skill3",
    "Tools & Technologies: tool1, tool2",
    "Methodologies: method1, method2"
  ],
  "experience": [
    {
      "title": "refined job title",
      "company": "company name",
      "location": "City, Country",
      "startDate": "Month YYYY",
      "endDate": "Month YYYY or Present",
      "description": "Achieved X by doing Y resulting in Z\nDrove X improvement by implementing Y\nLed team of N to deliver Z"
    }
  ]
}

For description: each bullet point on its own line (\n separated). Do NOT use JSON arrays for bullets — use a single string with \n between points.
';
        $response = $this->chat([['role' => 'user', 'content' => $prompt]], 0.7, true);
        return json_decode($response, true);
    }

    public function generateCoverLetter($resume, $jobTitle, $companyName, $jobDescription)
    {
        // Recursively convert to array to ensure nested properties are accessible
        $resumeData = json_decode(json_encode($resume), true);
        
        $personalInfo = $resumeData['personalInfo'] ?? $resumeData['personal_info'] ?? [];
        $fullName = $personalInfo['fullName'] ?? $personalInfo['full_name'] ?? 'Candidate';
        
        $experienceArr = $resumeData['experience'] ?? [];
        $experienceSummary = collect($experienceArr)->map(function($e) {
            $eTitle = $e['jobTitle'] ?? $e['title'] ?? 'Role';
            $eCompany = $e['company'] ?? 'Company';
            return "{$eTitle} at {$eCompany}";
        })->implode(', ');

        $skillsArr = $resumeData['skills'] ?? [];
        $skills = is_array($skillsArr) ? implode(', ', $skillsArr) : $skillsArr;

        $prompt = "
You are an expert Reviewer and Career Coach. Write a highly personalized, professional Cover Letter.

My Resume:
- Name: {$fullName}
- Skills: {$skills}
- Experience: {$experienceSummary}

Target Job:
- Role: {$jobTitle}
- Company: {$companyName}
- Description: {$jobDescription}

Instructions:
1. Address hiring manager professionally.
2. Hook them in first paragraph.
3. Use specific examples from my experience to prove fit.
4. Keep it concise (3-4 paragraphs).
5. Close professionally.
6. Return ONLY the body text of the letter.
";
        return $this->chat([['role' => 'user', 'content' => $prompt]], 0.7);
    }

    public function analyzeJobMatch($resume, $jobDescription)
    {
        $resumeData = is_array($resume) ? $resume : (array)$resume;
        $skillsArr = $resumeData['skills'] ?? [];
        $skills = is_array($skillsArr) ? implode(', ', $skillsArr) : $skillsArr;
        $experience = json_encode($resumeData['experience'] ?? []);

        $prompt = "
You are an ATS Scoring Engine. Compare the Resume against the Job Description.

Resume:
- Skills: {$skills}
- Experience: {$experience}

Job Description:
{$jobDescription}

Return STRICT JSON:
{
  'score': number (0-100),
  'missingKeywords': ['keyword1', 'keyword2'],
  'matchingKeywords': ['keyword1', 'keyword2'],
  'summary': '1 sentence analysis'
}
";
        $response = $this->chat([['role' => 'user', 'content' => $prompt]], 0.1, true);
        return json_decode($this->cleanJson($response), true);
    }

    public function generateBlogPost($topic)
    {
        $prompt = '
You are an expert SEO Content Marketer and Career Writer.
Generate a highly engaging, SEO-optimized blog post for a career / resume-building SaaS called ATSense.

TOPIC: '.$topic.'

Return STRICT JSON containing:
{
  "title": "A highly clickable, SEO optimized title (max 60 chars)",
  "slug": "seo-optimized-url-slug-based-on-title",
  "category": "Select best fit: \'ATS Tips\', \'LinkedIn\', \'Job Search\', or \'Templates\'",
  "content": "The full markdown content of the post. Include headings (##), bullet points, and actionable advice.",
  "excerpt": "A 2-sentence hook / meta summary.",
  "meta_title": "SEO Meta Title",
  "meta_description": "SEO Meta Description (max 160 chars)",
  "image_prompt": "A vivid, descriptive prompt for an AI image generator to create the header graphic. Clean, modern, corporate aesthetic."
}
';
        $response = $this->chat([['role' => 'user', 'content' => $prompt]], 0.7, true);
        $data = json_decode($this->cleanJson($response), true);
        
        if (isset($data['image_prompt'])) {
            $data['cover_image'] = "https://image.pollinations.ai/prompt/" . urlencode($data['image_prompt']) . "?width=1200&height=630&nologo=true";
        }

        return $data;
    }

    protected function cleanJson($content)
    {
        // Strip Triple Backticks if present
        $content = preg_replace('/^```json\s*/i', '', $content);
        $content = preg_replace('/^```\s*/i', '', $content);
        $content = preg_replace('/\s*```$/i', '', $content);
        return trim($content);
    }

    public function optimizeLinkedInProfile($resume, $targetRole)
    {
        // Handle $resume as either object or array
        $resumeData = is_array($resume) ? $resume : (array)$resume;
        $skills = implode(', ', $resumeData['skills'] ?? []);
        $experience = json_encode($resumeData['experience'] ?? []);
        $roleContext = $targetRole ? "Targeting Role: $targetRole" : "General Professional Profile";

        $prompt = "
You are a LinkedIn Viral Growth Expert. Transform this resume into a high-converting LinkedIn Profile.
{$roleContext}

Resume Data:
- Skills: {$skills}
- Experience: {$experience}

Return STRICT JSON:
{
  'headlines': ['Viral headline 1', 'Viral headline 2'],
  'about': 'Engaging 1st-person professional story (max 200 words)',
  'featuredSkills': ['Top Skill 1', 'Top Skill 2'],
  'experienceImprovements': ['Action-oriented achievement bullet 1', 'Metric-driven bullet 2']
}
";
        $response = $this->chat([['role' => 'user', 'content' => $prompt]], 0.7, true);
        return json_decode($response, true);
    }

    /**
     * Detailed ATS Breakdown Analysis
     */
    public function analyzeATSBreakdown($resumeData)
    {
        $resumeJson = json_encode($resumeData, JSON_PRETTY_PRINT);

        $prompt = "
You are an advanced ATS Audit System.
Analyze this resume for 'ATS Compatibility'.

Resume Data:
{$resumeJson}

Calculate a score (0-100) and provide a detailed breakdown.

Scoring Weights:
- Keywords: 20%
- Skills: 20%
- Experience: 30%
- Education: 10%
- Formatting: 10% (Assume simple JSON structure implies good formatting)
- Completeness: 10%

Return STRICT JSON matching this interface:
{
  'overallScore': number (0-100),
  'breakdown': {
    'keywords': { 'score': number, 'weight': 20, 'max': 20 },
    'skills': { 'score': number, 'weight': 20, 'max': 20 },
    'experience': { 'score': number, 'weight': 30, 'max': 30 },
    'education': { 'score': number, 'weight': 10, 'max': 10 },
    'formatting': { 'score': number, 'weight': 10, 'max': 10 },
    'completeness': { 'score': number, 'weight': 10, 'max': 10 }
  },
  'missingKeywords': ['string'],
  'matchedKeywords': ['string'],
  'issues': ['string (critical issues)'],
  'recommendations': ['string (actionable improvements)']
}
";
        $response = $this->chat([['role' => 'user', 'content' => $prompt]], 0.3, true);
        return json_decode($response, true);
    }
    public function parseResumeJSON($text)
    {
        $prompt = '
You are an Expert Resume Parser. Extract ALL data from the following Resume Text into STRICT JSON.

Resume Text:
' . substr($text, 0, 15000) . '

CRITICAL RULES:
- Extract EVERY piece of information present in the resume.
- SPACING: Preserve all spaces in names (e.g. "GAURI S" stays "GAURI S", not "GAURIS").
- NAME CLEANING: fullName must ONLY be the person name. No page numbers, file names, or metadata.
- For skills: group by categories if the resume has skill categories. Format each line as "Category: skill1, skill2". If no categories exist, use "Technical Skills: skill1, skill2" as a single entry.
- For experience description: join all responsibility bullet points into a single string, one bullet per line (\n separated). Do NOT return an array.
- Field names must match EXACTLY as shown below.
- Return ONLY valid JSON, no markdown fences.

Required Format:
{
  "personalInfo": {
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedin": "string",
    "portfolio": "string"
  },
  "summary": "string",
  "skills": [
    "Category Name: skill1, skill2, skill3"
  ],
  "experience": [
    {
      "title": "string",
      "company": "string",
      "location": "string",
      "startDate": "string",
      "endDate": "string",
      "description": "bullet point 1\nbullet point 2\nbullet point 3"
    }
  ],
  "education": [
    {
      "degree": "string",
      "fieldOfStudy": "string",
      "institution": "string",
      "location": "string",
      "startDate": "string",
      "endDate": "string"
    }
  ],
  "certifications": [
    {
      "name": "string",
      "issuer": "string",
      "date": "string"
    }
  ],
  "languages": ["Language (Proficiency)"]
}
';
        $response = $this->chat([['role' => 'user', 'content' => $prompt]], 0.2, true);
        return json_decode($this->cleanJson($response), true);
    }

    /**
     * Extract text from file (PDF/Image) using Groq Vision
     */
    public function extractTextWithGroqVision($base64Data, $mimeType)
    {
        if (!$this->apiKey) {
            throw new \Exception('GROQ_API_KEY not configured for OCR fallback');
        }

        $url = "https://api.groq.com/openai/v1/chat/completions";

        $payload = [
            'model' => 'meta-llama/llama-4-scout-17b-16e-instruct',
            'messages' => [
                [
                    'role' => 'user',
                    'content' => [
                        [
                            'type' => 'text',
                            'text' => "Extract all text from this document verbatim. Return ONLY the text, preserving original layout and spacing exactly (especially in names and initials)."
                        ],
                        [
                            'type' => 'image_url',
                            'image_url' => [
                                'url' => "data:{$mimeType};base64,{$base64Data}"
                            ]
                        ]
                    ]
                ]
            ],
            'temperature' => 0.1
        ];

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json'
            ])->post($url, $payload);

            if ($response->failed()) {
                Log::error('Groq Vision OCR Error: ' . $response->body());
                throw new \Exception('Groq Vision OCR failed: ' . $response->status());
            }

            $data = $response->json();
            return $data['choices'][0]['message']['content'] ?? '';

        } catch (\Exception $e) {
            Log::error('Groq Vision OCR Exception: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Generate Tailored Interview Questions
     */
    public function generateInterviewQuestions($resume, $jobDescription)
    {
        $skills = implode(', ', $resume['skills'] ?? []);
        $experience = json_encode($resume['experience'] ?? []);
        $role = $resume['title'] ?? 'Candidate';

        $prompt = "
You are a Senior Technical Recruiter at a Top Tier Tech Company.
Generate a set of 5-8 highly tailored behavioral and technical interview questions for this candidate based on their resume and the target Job Description.

Candidate Resume:
- Role: {$role}
- Skills: {$skills}
- Experience: {$experience}

Target Job Description:
{$jobDescription}

QUESTIONS MIX (Total 5-8):
1. **Fundamental Technical** (2-3): Basic concepts, syntax, core principles (e.g., 'What is X in Y?').
2. **Behavioral** (2-3): Using STAR method (e.g., 'Tell me about a time...').
3. **Role-Specific/Advanced** (1-2): Problem solving or advanced architecture.

For each question:
1. Explain WHY you are asking it (connection to resume/JD).
2. Provide a 'Star Tip' on how the candidate should answer.

Return STRICT JSON matching this structure:
{
  'questions': [
    {
      'question': 'The actual question string',
      'category': 'Technical' | 'Behavioral' | 'Advanced',
      'rationale': 'Why this is being asked',
      'tip': 'STAR method tip for answering'
    }
  ],
  'context': '1-sentence recruiter perspective'
}
";
        $response = $this->chat([['role' => 'user', 'content' => $prompt]], 0.7, true);
        return json_decode($response, true);
    }
    /**
     * Generate Professional Summary
     */
    public function generateProfessionalSummary($targetRole, $resumeContext)
    {
        $prompt = "
You are an expert Resume Writer. 
Write a powerful 2-3 sentence professional summary for a candidate.

TARGET ROLE: {$targetRole}
CANDIDATE CONTEXT: {$resumeContext}

INSTRUCTIONS:
1. Start with a strong adjective.
2. Highlight years of experience and top skills.
3. Quantify impact if possible from context.
4. Keep it exactly 2-3 sentences.
5. Return ONLY the summary text. No preamble.
";
        return $this->chat([['role' => 'user', 'content' => $prompt]], 0.7);
    }

    /**
     * Extract clean Job Details from raw web-page text (Scraping fallback)
     */
    public function extractJobFromText($text)
    {
        $textChunk = substr($text, 0, 15000); // Prevent token overflow limits
        $prompt = "
You are an expert Job Data Extractor.
Extract the core details from the following raw text scraped from a job board webpage (like LinkedIn, Indeed).
The text is messy and contains headers, footers, buttons, and navigation text.
Ignore the garbage and extract the true Job Title, Company, and full Job Description/Requirements.

RAW TEXT:
{$textChunk}

Return STRICT JSON:
{
  \"jobTitle\": \"The extracted job title\",
  \"companyName\": \"The hiring company name or 'Unknown'\",
  \"jobDescription\": \"The clean, full job description and requirements without headers/footers. Preserve line breaks (\n).\"
}
";
        $response = $this->chat([['role' => 'user', 'content' => $prompt]], 0.1, true);
        return json_decode($this->cleanJson($response), true);
    }
}
