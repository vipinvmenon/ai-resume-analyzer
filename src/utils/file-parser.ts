/**
 * Main file parser orchestrator
 * Handles file type detection and delegates to appropriate parser
 */

import { MIME_TYPES, isAcceptedFileType } from '@/lib/file-types';
import { ERROR_MESSAGES } from '@/lib/constants';
import { parsePdfFile } from './pdf-parser';
import { parseDocxFile } from './docx-parser';

/**
 * Extract text content from a file (PDF or DOCX)
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type;

  if (!isAcceptedFileType(fileType)) {
    throw new Error(`${ERROR_MESSAGES.FILE_TYPE_UNSUPPORTED}: ${fileType}`);
  }

  try {
    if (fileType === MIME_TYPES.PDF) {
      return await parsePdfFile(file);
    } else if (fileType === MIME_TYPES.DOCX) {
      return await parseDocxFile(file);
    } else {
      throw new Error(`${ERROR_MESSAGES.FILE_TYPE_UNSUPPORTED}: ${fileType}`);
    }
  } catch (error) {
    throw new Error(
      `${ERROR_MESSAGES.FILE_PROCESSING_FAILED} (${file.name}): ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

