/**
 * DOCX parsing utilities
 */

import mammoth from 'mammoth';
import { ERROR_MESSAGES } from '@/lib/constants';

/**
 * Extract text from DOCX file
 */
export async function parseDocxFile(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });

    if (result.messages.length > 0) {
      // Log warnings but don't fail - some formatting warnings are acceptable
      // Only log if there are actual errors, not just formatting warnings
      const errors = result.messages.filter((msg) => msg.type === 'error');
      if (errors.length > 0) {
        console.error('DOCX parsing errors:', errors);
      }
    }

    return result.value || ERROR_MESSAGES.DOCX_NO_TEXT;
  } catch (error) {
    throw new Error(
      `Failed to parse DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

