import type { StructuredAnalysisData } from '@/types';

interface KeywordDensityProps {
  data: StructuredAnalysisData;
}

/**
 * Component for displaying keyword density analysis
 */
export default function KeywordDensity({ data }: KeywordDensityProps) {
  const { keywordDensity } = data;

  const getMaxCount = () => {
    return Math.max(...keywordDensity.map((k) => k.count), 1);
  };

  const maxCount = getMaxCount();

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white backdrop-blur-sm">
      <h3 className="mb-6 text-xl font-semibold">Keywords & ATS Analysis</h3>

      <div>
        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/70">
          Keyword Density
        </h4>
        <div className="space-y-3">
          {keywordDensity.length > 0 ? (
            keywordDensity.map((keyword, index) => {
              const percentage = maxCount > 0 ? (keyword.count / maxCount) * 100 : 0;
              const isPresent = keyword.isPresent;

              return (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className={isPresent ? 'text-green-400' : 'text-red-400'}>
                      {keyword.keyword}
                    </span>
                    <span className="text-white/60">{keyword.count}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isPresent ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-white/60">No keyword data available</p>
          )}
        </div>
      </div>
    </div>
  );
}

