import type { ResumeFile } from '@/types';
import { UI_MESSAGES } from '@/lib/constants';

interface AnalysisInputSummaryProps {
  resume: ResumeFile | null;
  jobDescription: string;
  jobTitle?: string;
  companyName?: string;
}

/**
 * Component to display summary of inputs for analysis
 */
export default function AnalysisInputSummary({
  resume,
  jobDescription,
  jobTitle,
  companyName,
}: AnalysisInputSummaryProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white">
      <h2 className="mb-4 text-xl font-semibold">{UI_MESSAGES.ANALYSIS_INPUT}</h2>

      {resume && (
        <div className="mb-4">
          <h3 className="text-lg font-medium">Resume</h3>
          <p className="text-white/80">
            {resume.name} • {(resume.size / 1024).toFixed(1)} KB
            {resume.content && (
              <span className="ml-2 text-sm text-green-300">✓ Text extracted</span>
            )}
          </p>
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-lg font-medium">Job Description</h3>
        <p className="text-sm text-white/80">
          {jobDescription.slice(0, 200)}...
        </p>
      </div>

      {(jobTitle || companyName) && (
        <div className="grid gap-4 md:grid-cols-2">
          {jobTitle && (
            <p>
              <span className="text-white/60">Job Title:</span> {jobTitle}
            </p>
          )}
          {companyName && (
            <p>
              <span className="text-white/60">Company:</span> {companyName}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

