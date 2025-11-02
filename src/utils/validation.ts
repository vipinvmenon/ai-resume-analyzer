/**
 * Validation utilities
 */

import { MIN_JOB_DESCRIPTION_LENGTH, ERROR_MESSAGES } from '@/lib/constants';

/**
 * Validate job description length
 */
export function validateJobDescription(description: string): {
  isValid: boolean;
  error?: string;
} {
  if (description.trim().length < MIN_JOB_DESCRIPTION_LENGTH) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.JOB_DESCRIPTION_TOO_SHORT,
    };
  }

  return { isValid: true };
}

