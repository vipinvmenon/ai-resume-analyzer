import type { StructuredAnalysisData } from '@/types';

interface SkillsBreakdownProps {
  data: StructuredAnalysisData;
}

/**
 * Component for displaying matched and missing skills
 */
export default function SkillsBreakdown({ data }: SkillsBreakdownProps) {
  const { matchedSkills, missingSkills } = data;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white backdrop-blur-sm">
      <h3 className="mb-6 text-xl font-semibold">Skills Breakdown</h3>

      {/* Matched Skills */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="flex items-center gap-2 text-lg font-medium text-green-400">
            <span className="flex h-2 w-2 rounded-full bg-green-400"></span>
            Matched Skills ({matchedSkills.length})
          </h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {matchedSkills.length > 0 ? (
            matchedSkills.map((skill, index) => (
              <span
                key={index}
                className="flex items-center gap-2 rounded-full bg-green-500/20 px-4 py-2 text-sm font-medium text-green-300"
              >
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
                {skill}
              </span>
            ))
          ) : (
            <p className="text-sm text-white/60">No matched skills detected</p>
          )}
        </div>
      </div>

      {/* Missing Skills */}
      {missingSkills.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h4 className="flex items-center gap-2 text-lg font-medium text-red-400">
              <span className="flex h-2 w-2 rounded-full bg-red-400"></span>
              Missing Skills ({missingSkills.length})
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {missingSkills.map((skill, index) => (
              <span
                key={index}
                className="flex items-center gap-2 rounded-full bg-red-500/20 px-4 py-2 text-sm font-medium text-red-300"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

