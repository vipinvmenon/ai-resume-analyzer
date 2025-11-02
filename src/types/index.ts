/**
 * Shared type definitions
 */

/**
 * Resume file data structure
 */
export interface ResumeFile {
  name: string;
  size: number;
  type: string;
  content?: string; // Extracted text content
}

/**
 * Analysis result from AI
 */
export interface AnalysisResult {
  analysis: string;
  model: string;
  timestamp: string;
  error?: string;
  structuredData?: StructuredAnalysisData;
}

/**
 * Structured analysis data for detailed visual report
 */
export interface StructuredAnalysisData {
  overallFitScore: number; // 0-100
  atsCompatibility: number; // 0-100
  skillMatchRate: number; // 0-100
  matchedSkills: string[];
  missingSkills: string[];
  keywordDensity: KeywordDensity[];
  atsIssues: ATSIssue[];
  recommendations: string[];
}

export interface KeywordDensity {
  keyword: string;
  count: number;
  isPresent: boolean;
}

export interface ATSIssue {
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  message: string;
}

/**
 * Analysis request payload
 */
export interface AnalysisRequest {
  resumeContent: string;
  jobDescription: string;
  jobTitle?: string;
  companyName?: string;
}

/**
 * Analysis response from API
 */
export interface AnalysisResponse {
  analysis: string;
  model: string;
  timestamp: string;
  error?: string;
  structuredData?: StructuredAnalysisData;
}

/**
 * PDF parse request
 */
export interface PdfParseRequest {
  fileData: string; // base64 encoded
  fileName: string;
}

/**
 * PDF parse response
 */
export interface PdfParseResponse {
  text: string;
  fileName: string;
  pageCount: number;
  isPlaceholder: boolean;
}

/**
 * API error response
 */
export interface ApiErrorResponse {
  error: string;
  details?: string;
}

/**
 * Stepper step configuration
 */
export interface StepperStep {
  label: string;
  number: number;
}

