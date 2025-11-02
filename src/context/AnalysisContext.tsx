import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { ResumeFile, AnalysisResult } from '@/types';

/**
 * Analysis state interface
 */
interface AnalysisState {
  resume: ResumeFile | null;
  jobDescription: string;
  jobTitle: string;
  companyName: string;
  analysisResult: AnalysisResult | null;
  isAnalyzing: boolean;
  setResume: (file: ResumeFile | null) => void;
  setJobDescription: (text: string) => void;
  setJobTitle: (text: string) => void;
  setCompanyName: (text: string) => void;
  setAnalysisResult: (result: AnalysisResult | null) => void;
  setIsAnalyzing: (loading: boolean) => void;
  reset: () => void;
}

const INITIAL_STATE = {
  resume: null,
  jobDescription: '',
  jobTitle: '',
  companyName: '',
  analysisResult: null,
  isAnalyzing: false,
};

const AnalysisContext = createContext<AnalysisState | undefined>(undefined);

/**
 * Provider component for Analysis context
 */
export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [resume, setResume] = useState<ResumeFile | null>(INITIAL_STATE.resume);
  const [jobDescription, setJobDescription] = useState(INITIAL_STATE.jobDescription);
  const [jobTitle, setJobTitle] = useState(INITIAL_STATE.jobTitle);
  const [companyName, setCompanyName] = useState(INITIAL_STATE.companyName);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    INITIAL_STATE.analysisResult
  );
  const [isAnalyzing, setIsAnalyzing] = useState(INITIAL_STATE.isAnalyzing);

  const value = useMemo<AnalysisState>(
    () => ({
      resume,
      jobDescription,
      setResume,
      setJobDescription,
      setJobTitle,
      setCompanyName,
      jobTitle,
      companyName,
      analysisResult,
      setAnalysisResult,
      isAnalyzing,
      setIsAnalyzing,
      reset: () => {
        setResume(INITIAL_STATE.resume);
        setJobDescription(INITIAL_STATE.jobDescription);
        setJobTitle(INITIAL_STATE.jobTitle);
        setCompanyName(INITIAL_STATE.companyName);
        setAnalysisResult(INITIAL_STATE.analysisResult);
        setIsAnalyzing(INITIAL_STATE.isAnalyzing);
      },
    }),
    [resume, jobDescription, jobTitle, companyName, analysisResult, isAnalyzing]
  );

  return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>;
}

/**
 * Hook to access Analysis context
 * @throws Error if used outside AnalysisProvider
 */
export function useAnalysis(): AnalysisState {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within AnalysisProvider');
  }
  return context;
}
