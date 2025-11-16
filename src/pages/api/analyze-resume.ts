import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { OpenAI } from 'openai';
import { ERROR_MESSAGES, AI_CONFIG } from '@/lib/constants';
import type { AnalysisRequest, AnalysisResponse, ApiErrorResponse } from '@/types';
import { parseAnalysisResponse } from '@/utils/analysis-parser';

// Initialize OpenAI client for OpenRouter
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1/',
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'X-Title': 'Resume Builder',
  },
});

// Build the prompt for resume analysis

function buildAnalysisPrompt(
  jobDescription: string,
  resumeContent: string,
  jobTitle?: string,
  companyName?: string
): string {
  return `
Analyze this resume against the job description and provide a comprehensive assessment:

JOB DETAILS:
- Title: ${jobTitle || 'Not specified'}
- Company: ${companyName || 'Not specified'}

JOB DESCRIPTION:
${jobDescription}

RESUME CONTENT:
${resumeContent}

Please provide a detailed analysis with:
1. **Overall Match Score**: Provide a percentage score (0-100) for overall compatibility
2. **ATS Compatibility Score**: Provide a percentage score (0-100) for how well it will pass Applicant Tracking Systems
3. **Skill Match Rate**: Provide a percentage score (0-100) for skill alignment
4. **Strengths**: List specific skills and experiences that match (format as bullet points or numbered list)
5. **Gaps**: List missing skills or experience (format as bullet points or numbered list)
6. **Key Keywords**: Mention important keywords from the job description with their frequency counts
7. **ATS Issues**: Identify any issues that could affect ATS screening (categorize as HIGH, MEDIUM, or LOW priority)
8. **Recommendations**: Provide specific, actionable recommendations (format as numbered list or bullet points)

Include specific numbers and percentages where possible. Format your response clearly with section headers.
  `.trim();
}

const handler: NextApiHandler<AnalysisResponse | ApiErrorResponse> = async (
  req: NextApiRequest,
  res: NextApiResponse<AnalysisResponse | ApiErrorResponse>
) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    console.error(`[analyze-resume] Method not allowed: ${req.method}`);
    return res.status(405).json({ 
      error: `Method not allowed. Received: ${req.method}, Expected: POST`
    } as ApiErrorResponse);
  }

  const { resumeContent, jobDescription, jobTitle, companyName }: AnalysisRequest = req.body;

  if (!resumeContent || !jobDescription) {
    return res.status(400).json({ error: ERROR_MESSAGES.RESUME_REQUIRED });
  }

  // Validate job description quality
  const trimmed = jobDescription.trim();
  
  // If the entire text is one long string without spaces, check it as a single word
  if (!trimmed.includes(' ') && trimmed.length > 30) {
    // Split on any non-letter character to get potential words
    const potentialWords = trimmed.split(/[^a-zA-Z]+/).filter(w => w.length > 0);
    if (potentialWords.length === 0) {
      return res.status(400).json({ 
        error: 'Please provide a valid job description with meaningful content. Random characters or gibberish are not accepted.' 
      });
    }
    // Check if any potential word segment is meaningful
    const hasAnyMeaningful = potentialWords.some(word => {
      const cleanWord = word.toLowerCase();
      if (cleanWord.length < 3) return false;
      const vowels = (cleanWord.match(/[aeiou]/g) || []).length;
      if (vowels === 0) return false;
      if (cleanWord.length >= 5 && vowels / cleanWord.length < 0.2) return false;
      const maxConsecutiveConsonants = Math.max(...(cleanWord.match(/[^aeiou]+/g) || []).map(m => m.length));
      if (maxConsecutiveConsonants > 4) return false;
      return true;
    });
    if (!hasAnyMeaningful) {
      return res.status(400).json({ 
        error: 'Please provide a valid job description with meaningful content. Random characters or gibberish are not accepted.' 
      });
    }
  }
  
  const words = trimmed.split(/\s+/).filter(word => word.length > 0);
  if (words.length < 3) {
    return res.status(400).json({ 
      error: 'Job description must contain at least 3 words with meaningful content.' 
    });
  }

  // Check for meaningful content (words with vowels and reasonable patterns)
  const meaningfulWords = words.filter(word => {
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
    if (cleanWord.length < 3) return false;
    
    const vowels = (cleanWord.match(/[aeiou]/g) || []).length;
    
    // Must have at least one vowel
    if (vowels === 0) return false;
    
    // For longer words, ensure reasonable vowel ratio (at least 20% vowels)
    if (cleanWord.length >= 5 && vowels / cleanWord.length < 0.2) {
      return false;
    }
    
    // Check for patterns that suggest random characters (too many consecutive consonants)
    const maxConsecutiveConsonants = Math.max(...(cleanWord.match(/[^aeiou]+/g) || []).map(m => m.length));
    if (maxConsecutiveConsonants > 4) return false;
    
    return true;
  });

  if (meaningfulWords.length < Math.ceil(words.length * 0.6)) {
    return res.status(400).json({ 
      error: 'Please provide a valid job description with meaningful content. Random characters or gibberish are not accepted.' 
    });
  }

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const fullPrompt = buildAnalysisPrompt(jobDescription, resumeContent, jobTitle, companyName);

    // List of free models to try (in order)
    // Note: OpenRouter free models may require the account to have purchased credits at least once
    const freeModels = [
      'deepseek/deepseek-chat:free', // Try :free suffix first
      'mistralai/mixtral-8x7b-instruct:free',
      'mistralai/mistral-7b-instruct:free',
      'openrouter/auto', // Auto-select best free model (no :free suffix)
      'mistralai/mixtral-8x7b-instruct', // Without :free suffix
      'mistralai/mistral-7b-instruct',
    ];

    let analysis: string | null = null;
    let modelName: string = AI_CONFIG.MODEL;
    let lastError: Error | null = null;

    // Try each model until one works
    for (const model of freeModels) {
      try {
        const response = await openai.chat.completions.create({
          model,
          messages: [
            {
              role: 'system',
              content:
                'You are an expert resume analyst and career coach. Provide detailed, actionable feedback to help job seekers improve their applications.',
            },
            {
              role: 'user',
              content: fullPrompt,
            },
          ],
          temperature: AI_CONFIG.TEMPERATURE,
          max_tokens: AI_CONFIG.MAX_TOKENS,
        });

        analysis = response.choices[0]?.message?.content?.trim() || 'No analysis generated';
        modelName = model;
        break; // Success, exit loop
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        // Continue to next model
        console.log(`Model ${model} failed, trying next...`);
      }
    }

    // If all models failed, throw the last error
    if (!analysis) {
      throw lastError || new Error('All free models failed');
    }

    // Parse structured data from analysis text
    const structuredData = parseAnalysisResponse(analysis);

    return res.status(200).json({
      analysis,
      model: modelName,
      timestamp: new Date().toISOString(),
      structuredData: structuredData || undefined,
    });
  } catch (error) {
    console.error('OpenRouter API Error:', error);

    // Provide helpful error messages
    let errorDetails = error instanceof Error ? error.message : 'Unknown error';
    
    if (errorDetails.includes('402') || errorDetails.includes('Insufficient credits')) {
      errorDetails = `OpenRouter requires your account to have purchased credits at least once to enable free model access, even if your balance is now $0. 
      
To fix this:
1. Go to https://openrouter.ai/settings/credits
2. Add a small amount ($1-5 minimum)
3. Enable "Model Training" at https://openrouter.ai/settings/privacy
4. After this one-time setup, free models should work

This is an OpenRouter policy requirement for free tier access.`;
    }
    
    if (errorDetails.includes('404') || errorDetails.includes('No endpoints found')) {
      errorDetails += '. Try using openrouter/auto or check available models at https://openrouter.ai/models';
    }

    return res.status(500).json({
      error: ERROR_MESSAGES.ANALYSIS_FAILED,
      details: errorDetails,
    });
  }
};

export default handler;
