/**
 * Validation utilities
 */

import { MIN_JOB_DESCRIPTION_LENGTH, ERROR_MESSAGES } from '@/lib/constants';

/**
 * Check if text contains meaningful words (not just random characters)
 */
function hasMeaningfulContent(text: string): boolean {
  const trimmed = text.trim();
  
  // If the entire text is one long string without spaces, check it as a single word
  // This catches cases like "dkvfdngdfgfdmv.nbmkngfkinhgjbhkjdnbcvbnmcvbcvbcvnbmcvnbjsa"
  if (!trimmed.includes(' ') && trimmed.length > 30) {
    // Split on any non-letter character to get potential words
    const potentialWords = trimmed.split(/[^a-zA-Z]+/).filter(w => w.length > 0);
    if (potentialWords.length === 0) {
      // No letter sequences found, likely all random characters
      return false;
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
    if (!hasAnyMeaningful) return false;
  }
  
  const words = trimmed.split(/\s+/).filter(word => word.length > 0);
  
  if (words.length < 3) {
    return false;
  }

  // Check if at least 60% of words are meaningful
  // A word is considered meaningful if:
  // 1. It has at least 3 characters
  // 2. Contains at least one vowel
  // 3. Has a reasonable vowel-to-consonant ratio (not all consonants)
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

  // At least 60% of words should be meaningful
  return meaningfulWords.length >= Math.ceil(words.length * 0.6);
}

/**
 * Validate job description length and content quality
 */
export function validateJobDescription(description: string): {
  isValid: boolean;
  error?: string;
} {
  const trimmed = description.trim();
  
  if (trimmed.length < MIN_JOB_DESCRIPTION_LENGTH) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.JOB_DESCRIPTION_TOO_SHORT,
    };
  }

  if (!hasMeaningfulContent(trimmed)) {
    return {
      isValid: false,
      error: 'Please provide a valid job description with meaningful content. Random characters or gibberish are not accepted.',
    };
  }

  return { isValid: true };
}

