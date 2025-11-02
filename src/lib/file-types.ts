/**
 * File type utilities and constants
 */

import { ACCEPTED_FILE_TYPES } from './constants';

export type AcceptedFileType = (typeof ACCEPTED_FILE_TYPES)[number];

export const MIME_TYPES = {
  PDF: 'application/pdf',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
} as const;

/**
 * Check if a file type is supported
 */
export function isAcceptedFileType(fileType: string): fileType is AcceptedFileType {
  return ACCEPTED_FILE_TYPES.includes(fileType as AcceptedFileType);
}

/**
 * Get file extension from MIME type
 */
export function getFileExtension(mimeType: string): string {
  switch (mimeType) {
    case MIME_TYPES.PDF:
      return 'pdf';
    case MIME_TYPES.DOCX:
      return 'docx';
    default:
      return 'unknown';
  }
}

/**
 * Get file type label from MIME type
 */
export function getFileTypeLabel(mimeType: string): string {
  switch (mimeType) {
    case MIME_TYPES.PDF:
      return 'PDF';
    case MIME_TYPES.DOCX:
      return 'DOCX';
    default:
      return 'Unknown';
  }
}

