import type { StructuredAnalysisData } from '@/types';

interface RecommendationsProps {
  data: StructuredAnalysisData;
}

/**
 * Component for displaying improvement recommendations
 */
export default function Recommendations({ data }: RecommendationsProps) {
  const { recommendations } = data;

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white backdrop-blur-sm">
      <div className="mb-6 flex items-center gap-3">
        <svg
          className="h-6 w-6 text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        <h3 className="text-xl font-semibold">How to Improve Your Match</h3>
      </div>

      <div className="space-y-3">
        {recommendations.map((recommendation, index) => (
          <div
            key={index}
            className="flex items-start gap-4 rounded-lg border border-white/10 bg-white/5 p-4"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-sm font-bold text-purple-300">
              {index + 1}
            </div>
            <p className="flex-1 text-sm leading-relaxed text-white/90">{recommendation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

