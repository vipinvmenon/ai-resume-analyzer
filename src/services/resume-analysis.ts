import { API_ENDPOINTS, ERROR_MESSAGES } from '@/lib/constants';
import type { AnalysisRequest, AnalysisResponse } from '@/types';

/**
 * Analyze resume against job description using AI
 */
export async function analyzeResume(request: AnalysisRequest): Promise<AnalysisResponse> {
  const response = await fetch(API_ENDPOINTS.ANALYZE_RESUME, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    let errorMessage: string = ERROR_MESSAGES.ANALYSIS_FAILED;
    try {
      const errorData = await response.json();
      errorMessage = errorData.details || errorData.error || errorMessage;
    } catch {
      errorMessage = `Server returned ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

