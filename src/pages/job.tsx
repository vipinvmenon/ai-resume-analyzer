import Stepper from '@/components/Stepper';
import { useAnalysis } from '@/context/AnalysisContext';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { validateJobDescription } from '@/utils/validation';
import { UI_MESSAGES } from '@/lib/constants';

export default function Job() {
  const {
    jobDescription,
    setJobDescription,
    resume,
    jobTitle,
    setJobTitle,
    companyName,
    setCompanyName,
  } = useAnalysis();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!resume) {
      router.replace('/start');
    }
  }, [resume, router]);

  const handleContinue = () => {
    const validation = validateJobDescription(jobDescription);
    if (!validation.isValid) {
      setError(validation.error || null);
      return;
    }
    setError(null);
    router.push('/analysis');
  };

  return (
    <main className="px-6 py-12">
      <Stepper active={2} />

      <h1 className="mt-8 text-center text-3xl font-bold text-white md:text-5xl">
        Add Job Description
      </h1>
      <p className="mt-3 text-center text-white/70">
        Paste the job description you're targeting to analyze your resume match
      </p>

      <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-6">
        <label className="block text-sm font-semibold text-white">
          {UI_MESSAGES.JOB_DESCRIPTION_LABEL}
        </label>
        <div className="relative mt-2">
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the complete job description here..."
            className="h-72 w-full resize-none rounded-xl border border-white/10 bg-white/5 p-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="pointer-events-none absolute bottom-3 right-4 text-xs text-white/40">
            {jobDescription.length} characters
          </div>
        </div>
        {error && <p className="mt-2 text-sm text-red-300">{error}</p>}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-white/80">
              {UI_MESSAGES.JOB_TITLE_LABEL}
            </label>
            <input
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g., Senior Frontend Developer"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-white/80">
              {UI_MESSAGES.COMPANY_NAME_LABEL}
            </label>
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g., Tech Corp"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <button
            className="rounded-md border border-white/20 px-4 py-2 text-sm text-white/80 hover:bg-white/5"
            onClick={() => router.push('/start')}
          >
            {UI_MESSAGES.JOB_BACK}
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
            onClick={handleContinue}
          >
            {UI_MESSAGES.JOB_ANALYZE}
          </button>
        </div>
      </div>
    </main>
  );
}
