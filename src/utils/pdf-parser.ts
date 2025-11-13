/**
 * PDF parsing utilities for client-side operations
 */

import { API_ENDPOINTS, ERROR_MESSAGES } from '@/lib/constants';
import { arrayBufferToBase64 } from './base64';
import type { PdfParseResponse } from '@/types';

/**
 * Parse PDF file by sending it to the server API
 */
export async function parsePdfFile(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const base64 = arrayBufferToBase64(arrayBuffer);

    const response = await fetch(API_ENDPOINTS.PARSE_PDF, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileData: base64,
        fileName: file.name,
      }),
    });

    if (!response.ok) {
      let errorMessage: string = ERROR_MESSAGES.PDF_PARSE_FAILED;
      try {
        const errorData = await response.json();
        errorMessage = errorData.details || errorData.error || errorMessage;
      } catch (error) {
        console.error('Error parsing PDF:', error);
      }
      throw new Error(errorMessage);
    }

    const result: PdfParseResponse = await response.json();
    return result.text;
  } catch (error) {
    throw new Error(
      `Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

