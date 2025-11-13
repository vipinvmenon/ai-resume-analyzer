import type { NextApiRequest, NextApiResponse } from 'next';
import {
  PDF_HEADER_SIGNATURE,
  PDF_MIN_HEADER_LENGTH,
  ERROR_MESSAGES,
} from '@/lib/constants';
import type { PdfParseRequest, PdfParseResponse, ApiErrorResponse } from '@/types';

type Pdf2JsonTextRun = {
  T?: string;
};

type Pdf2JsonTextItem = {
  R?: Pdf2JsonTextRun[];
};

type Pdf2JsonPage = {
  Texts?: Pdf2JsonTextItem[];
};

interface Pdf2JsonData {
  Pages?: Pdf2JsonPage[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PdfParseResponse | ApiErrorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fileData, fileName }: PdfParseRequest = req.body;

  if (!fileData) {
    return res.status(400).json({ error: 'No file data provided' });
  }

  try {
    const pdfBuffer = Buffer.from(fileData, 'base64');

    // Validate PDF header
    if (
      pdfBuffer.length < PDF_MIN_HEADER_LENGTH ||
      pdfBuffer.toString('utf8', 0, PDF_MIN_HEADER_LENGTH) !== PDF_HEADER_SIGNATURE
    ) {
      return res.status(400).json({
        error: ERROR_MESSAGES.PDF_INVALID,
        details: ERROR_MESSAGES.PDF_INVALID,
      });
    }

    // Use pdf2json - a simple, reliable PDF parser for Node.js
    let PDFParser;
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      PDFParser = require('pdf2json');
      if (!PDFParser || typeof PDFParser !== 'function') {
        throw new Error('pdf2json module did not export correctly');
      }
    } catch (moduleError) {
      const errorMsg = moduleError instanceof Error ? moduleError.message : 'Unknown error';
      console.error('Failed to load pdf2json module:', errorMsg);
      return res.status(500).json({
        error: ERROR_MESSAGES.PDF_PARSE_FAILED,
        details: `Failed to load PDF parser: ${errorMsg}`,
      });
    }

    return new Promise<void>((resolve) => {
      let responseSent = false;

      const pdfParser = new PDFParser(null, 1);

      const sendResponse = (data: PdfParseResponse | ApiErrorResponse, status = 200) => {
        if (responseSent) return;
        responseSent = true;
        res.status(status).json(data);
        resolve();
      };

      // Set a timeout to ensure we always respond
      const timeout = setTimeout(() => {
        if (!responseSent) {
          console.error('PDF parsing timeout');
          sendResponse(
            {
              error: ERROR_MESSAGES.PDF_PARSE_FAILED,
              details: 'PDF parsing timed out. The file may be corrupted or too large.',
            },
            500
          );
        }
      }, 30000); // 30 second timeout

      pdfParser.on('pdfParser_dataError', (errData: { parserError: string }) => {
        clearTimeout(timeout);
        console.error('PDF parsing error:', errData.parserError);
        sendResponse(
          {
            error: ERROR_MESSAGES.PDF_PARSE_FAILED,
            details: errData.parserError || 'Unknown PDF parsing error',
          },
          500
        );
      });

      pdfParser.on('pdfParser_dataReady', (pdfData: Pdf2JsonData) => {
        clearTimeout(timeout);
        try {
          // Extract text from all pages
          let fullText = '';
          const pages = pdfData.Pages || [];
          const pageCount = pages.length;

          for (const page of pages) {
            const texts = page.Texts || [];
            for (const textItem of texts) {
              // textItem.R is an array of text runs
              if (textItem.R && textItem.R.length > 0) {
                for (const run of textItem.R) {
                  if (run.T) {
                    // Decode URI component as pdf2json encodes text
                    try {
                      fullText += decodeURIComponent(run.T) + ' ';
                    } catch {
                      fullText += run.T + ' ';
                    }
                  }
                }
              }
            }
            fullText += '\n';
          }

          const extractedText = fullText.trim();

          // Handle PDFs with no extractable text
          if (!extractedText) {
            sendResponse({
              text: `[PDF Content from ${fileName || 'uploaded file'}]\n\n${ERROR_MESSAGES.PDF_NO_TEXT}\n\nPlease try:\n- Uploading a text-based PDF\n- Converting your PDF to DOCX format\n- Using a PDF with selectable text`,
              fileName: fileName || 'unknown.pdf',
              pageCount: pageCount || 1,
              isPlaceholder: true,
            });
            return;
          }

          sendResponse({
            text: extractedText,
            fileName: fileName || 'unknown.pdf',
            pageCount: pageCount || 1,
            isPlaceholder: false,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.error('PDF text extraction error:', errorMessage);
          sendResponse(
            {
              error: ERROR_MESSAGES.PDF_PARSE_FAILED,
              details: errorMessage,
            },
            500
          );
        }
      });

      // Load the PDF buffer
      pdfParser.parseBuffer(pdfBuffer);
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;

    console.error('PDF processing error:', {
      message: errorMessage,
      stack: errorStack,
      fileName: fileName || 'unknown',
    });

    return res.status(500).json({
      error: ERROR_MESSAGES.PDF_PARSE_FAILED,
      details: errorMessage,
    });
  }
}
