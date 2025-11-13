import type { AnalysisResult } from '@/types';
import { UI_MESSAGES } from '@/lib/constants';
import MetricCard from './analysis/MetricCard';
import SkillsBreakdown from './analysis/SkillsBreakdown';
import KeywordDensity from './analysis/KeywordDensity';
import ATSIssues from './analysis/ATSIssues';
import Recommendations from './analysis/Recommendations';

interface AnalysisResultsProps {
  result: AnalysisResult;
}

/**
 * Component to display analysis results with visual metrics and insights
 */
export default function AnalysisResults({ result }: AnalysisResultsProps) {
  const hasStructuredData = result.structuredData !== undefined;

  return (
    <div className="space-y-6">
      {/* Visual Metrics */}
      {hasStructuredData && result.structuredData && (
        <>
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <MetricCard
              title="Overall Fit Score"
              value={result.structuredData.overallFitScore}
              variant="circular"
              icon={
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            />
            <MetricCard
              title="ATS Compatibility"
              value={result.structuredData.atsCompatibility}
              subtitle={`${result.structuredData.matchedSkills.length} matched / ${result.structuredData.missingSkills.length} missing`}
              icon={
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              }
            />
            <MetricCard
              title="Skill Match Rate"
              value={result.structuredData.skillMatchRate}
              subtitle={`${result.structuredData.matchedSkills.length} matched / ${result.structuredData.missingSkills.length} missing`}
              icon={
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              }
            />
          </div>

          {/* Skills and Keywords Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <SkillsBreakdown data={result.structuredData} />
            <KeywordDensity data={result.structuredData} />
          </div>

          {/* ATS Issues */}
          {result.structuredData.atsIssues.length > 0 && (
            <ATSIssues data={result.structuredData} />
          )}

          {/* Recommendations */}
          {result.structuredData.recommendations.length > 0 && (
            <Recommendations data={result.structuredData} />
          )}
        </>
      )}

      {/* Fallback to text display if no structured data */}
      {!hasStructuredData && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white">
          <div className="prose prose-invert max-w-none">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed">{result.analysis}</pre>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
        <p className="text-sm text-white/60">Analysis powered by {result.model}</p>
      </div>
    </div>
  );
}

