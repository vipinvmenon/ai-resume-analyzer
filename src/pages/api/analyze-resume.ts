import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';
import { ERROR_MESSAGES, AI_CONFIG } from '@/lib/constants';
import type { AnalysisRequest, AnalysisResponse, ApiErrorResponse } from '@/types';
import { parseAnalysisResponse } from '@/utils/analysis-parser';

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1/',
});

/**
 * Build the prompt for resume analysis
 */
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AnalysisResponse | ApiErrorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { resumeContent, jobDescription, jobTitle, companyName }: AnalysisRequest = req.body;

  if (!resumeContent || !jobDescription) {
    return res.status(400).json({ error: ERROR_MESSAGES.RESUME_REQUIRED });
  }

  try {
    const prompt = buildAnalysisPrompt(jobDescription, resumeContent, jobTitle, companyName);

    const response = await openai.chat.completions.create({
      model: AI_CONFIG.MODEL,
      messages: [
        {
          role: 'system',
          content:
            'You are an expert resume analyst and career coach. Provide detailed, actionable feedback to help job seekers improve their applications.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: AI_CONFIG.TEMPERATURE,
      max_tokens: AI_CONFIG.MAX_TOKENS,
    });

    const analysis = response.choices[0]?.message?.content?.trim() || 'No analysis generated';

    // Parse structured data from analysis text
    const structuredData = parseAnalysisResponse(analysis);

    return res.status(200).json({
      analysis,
      model: AI_CONFIG.MODEL,
      timestamp: new Date().toISOString(),
      structuredData: structuredData || undefined,
    });
  } catch (error) {
    console.error('OpenRouter API Error:', error);

    return res.status(500).json({
      error: ERROR_MESSAGES.ANALYSIS_FAILED,
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
