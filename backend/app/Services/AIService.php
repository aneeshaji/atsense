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
            Log::error('AI Service Exception: ' . $e->getMessage());
            throw $e;
        }
    }

    public function generateResumeContent($jobTitle, $jobDescription, $experience)
    {
        $prompt = "
You are an elite Career Coach and Resume Writer.
MISSION: Generate a one-page ATS-friendly resume showcase for a job interview at {$jobTitle}.

Current Experience Data:
" . json_encode($experience, JSON_PRETTY_PRINT) . "

Target Job Description:
{$jobDescription}

CRITICAL REQUIREMENTS:
1. Professional Summary: 2-3 powerful sentences.
2. Skills: 8-12 highly relevant keywords.
3. Experience: Rewrite bullets to be result-oriented, quantifiable, and keyword-rich.

Return STRICT JSON format:
{
  'summary': 'Compelling summary',
  'skills': ['skill1', 'skill2'],
  'experience': [
    {
      'jobTitle': 'original title',
      'responsibilities': ['bullet1', 'bullet2']
    }
  ]
}
";
        $response = $this->chat([['role' => 'user', 'content' => $prompt]], 0.7, true);
        return json_decode($response, true);
    }

    public function generateCoverLetter($resume, $jobTitle, $companyName, $jobDescription)
    {
        $personalInfo = $resume->personal_info; // Assuming array cast
        
        $experienceSummary = collect($resume->experience)->map(function($e) {
            return ($e['jobTitle'] ?? '') . ' at ' . ($e['company'] ?? '');
        })->implode(', ');

        $skills = implode(', ', $resume->skills ?? []);

        $prompt = "
You are an expert Reviewer and Career Coach. Write a highly personalized, professional Cover Letter.

My Resume:
- Name: " . ($personalInfo['fullName'] ?? 'Candidate') . "
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
        $skills = implode(', ', $resume->skills ?? []);
        $experience = json_encode($resume->experience);

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
        return json_decode($response, true);
    }

    public function optimizeLinkedInProfile($resume, $targetRole)
    {
        $skills = implode(', ', $resume->skills ?? []);
        $experience = json_encode($resume->experience);
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
        $prompt = "
You are an Expert Resume Parser. Extract ALL data from the following Resume Text into STRICT JSON.

Resume Text:
" . substr($text, 0, 15000) . "

CRITICAL RULES:
- Extract EVERY piece of information
- Preserve regional languages if found
- Return ONLY valid JSON

Required Format:
{
  'personalInfo': {
    'fullName': 'string',
    'email': 'string',
    'phone': 'string',
    'linkedin': 'string'
  },
  'summary': 'string',
  'skills': ['skill1', 'skill2'],
  'experience': [
    {
      'jobTitle': 'string',
      'company': 'string',
      'startDate': 'string',
      'endDate': 'string',
      'responsibilities': ['bullet1']
    }
  ],
  'education': [
    {
      'degree': 'string',
      'institution': 'string',
      'year': 'string'
    }
  ]
}
";
        $response = $this->chat([['role' => 'user', 'content' => $prompt]], 0.2, true);
        return json_decode($response, true);
    }

    /**
     * Extract text from file (PDF/Image) using Gemini Vision/Multimodal
     */
    public function extractTextWithGemini($fileContent, $mimeType)
    {
        $geminiKey = env('GEMINI_API_KEY');
        if (!$geminiKey) {
            throw new \Exception('GEMINI_API_KEY not configured for OCR fallback');
        }

        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={$geminiKey}";

        $payload = [
            'contents' => [
                [
                    'parts' => [
                        ['text' => "Extract all text from this document verbatim. Return ONLY the text, preserving layout where possible."],
                        [
                            'inline_data' => [
                                'mime_type' => $mimeType,
                                'data' => base64_encode($fileContent)
                            ]
                        ]
                    ]
                ]
            ]
        ];

        try {
            $response = Http::withHeaders(['Content-Type' => 'application/json'])
                ->post($url, $payload);

            if ($response->failed()) {
                Log::error('Gemini OCR Error: ' . $response->body());
                throw new \Exception('Gemini OCR failed: ' . $response->status());
            }

            $data = $response->json();
            return $data['candidates'][0]['content']['parts'][0]['text'] ?? '';

        } catch (\Exception $e) {
            Log::error('Gemini OCR Exception: ' . $e->getMessage());
            throw $e;
        }
    }
}
