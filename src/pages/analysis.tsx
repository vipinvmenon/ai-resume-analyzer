import Stepper from '@/components/Stepper';
import AnalysisInputSummary from '@/components/AnalysisInputSummary';
import AnalysisResults from '@/components/AnalysisResults';
import { useAnalysis } from '@/context/AnalysisContext';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { analyzeResume } from '@/services/resume-analysis';
import { UI_MESSAGES } from '@/lib/constants';

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

  useEffect(() => {
    if (!resume) {
      router.replace('/start');
    }
  }, [resume, router]);

  const handleAnalyze = async () => {
    if (!resume || !jobDescription) return;

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
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="px-6 py-12">
      <Stepper active={3} />
      <h1 className="mt-8 text-center text-3xl font-bold text-white md:text-5xl">
        AI Resume Analysis
      </h1>
      <p className="mt-3 text-center text-white/70">
        Get detailed insights on how your resume matches the job requirements
      </p>

      <div className="mx-auto mt-10 max-w-4xl space-y-6">
        <AnalysisInputSummary
          resume={resume}
          jobDescription={jobDescription}
          jobTitle={jobTitle}
          companyName={companyName}
        />

        {!analysisResult && (
          <div className="text-center">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-4 font-medium text-white shadow hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  {UI_MESSAGES.ANALYSIS_ANALYZING}
                </>
              ) : (
                UI_MESSAGES.ANALYSIS_START
              )}
            </button>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-300">
            <h3 className="font-semibold">Analysis Error</h3>
            <p>{error}</p>
          </div>
        )}

        {analysisResult && <AnalysisResults result={analysisResult} />}
      </div>
    </main>
  );
}
