import Stepper from '@/components/Stepper';
import AnalysisResults from '@/components/AnalysisResults';
import AnalysisSkeleton from '@/components/skeletons/AnalysisSkeleton';
import { useAnalysis } from '@/context/AnalysisContext';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import { analyzeResume } from '@/services/resume-analysis';

export default function Analysis() {
  const {
    resume,
    jobDescription,
    jobTitle,
    companyName,
    analysisResult,
    setAnalysisResult,
    isAnalyzing,
    setIsAnalyzing,
  } = useAnalysis();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const hasAnalyzedRef = useRef(false); // Track if analysis has been triggered
  const analysisKeyRef = useRef<string>(''); // Track what we analyzed to detect changes

  useEffect(() => {
    if (!resume) {
      router.replace('/start');
      return;
    }

    // Create a unique key for this analysis request
    const currentAnalysisKey = `${resume.name}-${jobDescription.substring(0, 50)}-${jobTitle}-${companyName}`;
    
    // Reset ref if inputs have changed (allows re-analysis when user changes inputs)
    if (analysisKeyRef.current !== currentAnalysisKey) {
      hasAnalyzedRef.current = false;
      analysisKeyRef.current = currentAnalysisKey;
    }

    // Auto-run analysis if not already done and not currently analyzing
    if (!analysisResult && !isAnalyzing && !hasAnalyzedRef.current && jobDescription) {
      hasAnalyzedRef.current = true; // Mark as initiated to prevent duplicate calls
      
      const performAnalysis = async () => {
        setIsAnalyzing(true);
        setError(null);

        try {
          const resumeContent =
            resume.content ||
            `Resume: ${resume.name}\nFile Size: ${(resume.size / 1024).toFixed(1)} KB\nType: ${
              resume.type
            }\n\n[No text content extracted from this file]`;

          const result = await analyzeResume({
            resumeContent,
            jobDescription,
            jobTitle,
            companyName,
          });

          setAnalysisResult(result);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Analysis failed');
          hasAnalyzedRef.current = false; // Reset on error so user can retry
        } finally {
          setIsAnalyzing(false);
        }
      };

      performAnalysis();
    }
  }, [resume, router, analysisResult, isAnalyzing, jobDescription, jobTitle, companyName, setAnalysisResult, setIsAnalyzing]);

  return (
    <main className="px-6 py-12">
      <Stepper active={3} />
      
      {/* Analysis Complete Status */}
      {analysisResult && (
        <div className="mx-auto mt-6 max-w-6xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-green-500/20 px-4 py-2 text-sm font-medium text-green-300">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Analysis Complete
          </div>
        </div>
      )}

      {/* Main Heading */}
      <div className="mx-auto mt-8 max-w-6xl text-center">
        <h1 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
          Your Resume Analysis
        </h1>
        <p className="mt-3 text-white/70">
          Comprehensive analysis of your resume against the job description
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-6xl space-y-6">
        {/* Loading State - Skeleton */}
        {isAnalyzing && !analysisResult && <AnalysisSkeleton />}

        {/* Error State */}
        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-300">
            <h3 className="font-semibold">Analysis Error</h3>
            <p>{error}</p>
          </div>
        )}

        {/* Results */}
        {analysisResult && <AnalysisResults result={analysisResult} />}
      </div>
    </main>
  );
}
