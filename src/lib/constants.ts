/**
 * Application-wide constants
 */

// File upload constants
export const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const;

export const FILE_TYPE_LABELS = {
  PDF: 'PDF',
  DOCX: 'DOCX',
} as const;

// File processing constants
export const BASE64_CHUNK_SIZE = 8192; // 8KB chunks for base64 conversion

// Validation constants
export const MIN_JOB_DESCRIPTION_LENGTH = 20;

// PDF constants
export const PDF_HEADER_SIGNATURE = '%PDF';
export const PDF_MIN_HEADER_LENGTH = 4;

// File size constants (in bytes)
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Error messages
export const ERROR_MESSAGES = {
  FILE_TYPE_UNSUPPORTED: 'Only PDF or DOCX files are supported',
  FILE_PROCESSING_FAILED: 'Failed to process file',
  PDF_INVALID: 'The uploaded file does not appear to be a valid PDF document',
  PDF_NO_TEXT: 'No extractable text found in this PDF. This may be a scanned PDF or image-based PDF that requires OCR (Optical Character Recognition) to extract text.',
  RESUME_REQUIRED: 'Resume content and job description are required',
  JOB_DESCRIPTION_TOO_SHORT: 'Please provide at least 20 characters.',
  ANALYSIS_FAILED: 'Failed to analyze resume',
  PDF_PARSE_FAILED: 'Failed to parse PDF',
  DOCX_NO_TEXT: 'No text content found in DOCX file',
} as const;

// UI messages
export const UI_MESSAGES = {
  UPLOAD_DRAG_DROP: 'Drag your resume here or click to browse',
  UPLOAD_PROCESSING: 'Processing file...',
  UPLOAD_CONTINUE: 'Continue to Job Description',
  UPLOAD_BACK: 'Back',
  ANALYSIS_START: 'Start AI Analysis',
  ANALYSIS_ANALYZING: 'Analyzing...',
  ANALYSIS_RESULTS: 'AI Analysis Results',
  ANALYSIS_INPUT: 'Analysis Input',
  JOB_BACK: 'Back',
  JOB_ANALYZE: 'Analyze Now',
  JOB_DESCRIPTION_LABEL: 'Job Description *',
  JOB_TITLE_LABEL: 'Job Title (Optional)',
  COMPANY_NAME_LABEL: 'Company Name (Optional)',
} as const;

// Stepper configuration
export const STEPPER_STEPS = [
  { label: 'Upload Resume', number: 1 },
  { label: 'Job Description', number: 2 },
  { label: 'Analysis', number: 3 },
] as const;

// API endpoints
export const API_ENDPOINTS = {
  PARSE_PDF: '/api/parse-pdf',
  ANALYZE_RESUME: '/api/analyze-resume',
} as const;

// AI Model configuration
// Using OpenRouter with openrouter/auto to automatically select best free model
// Alternative free models: mistralai/mixtral-8x7b-instruct, mistralai/mistral-7b-instruct
// IMPORTANT: Enable "Model Training" in OpenRouter privacy settings at https://openrouter.ai/settings/privacy
export const AI_CONFIG = {
  PROVIDER: 'openrouter' as 'huggingface' | 'openrouter',
  MODEL: 'openrouter/auto', // Auto-selects best available free model
  TEMPERATURE: 0.3,
  MAX_TOKENS: 2000,
} as const;

