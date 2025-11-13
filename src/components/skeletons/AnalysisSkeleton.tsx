/**
 * Skeleton loader for analysis results page
 */
export default function AnalysisSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Metrics Cards Skeleton */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <div className="mb-4 h-6 w-32 rounded bg-white/10"></div>
            <div className="mx-auto mb-4 h-32 w-32 rounded-full bg-white/10"></div>
            <div className="h-4 w-24 mx-auto rounded bg-white/10"></div>
          </div>
        ))}
      </div>

      {/* Skills and Keywords Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Skills Breakdown Skeleton */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="mb-6 h-7 w-40 rounded bg-white/10"></div>
          <div className="mb-4 h-5 w-32 rounded bg-white/10"></div>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-8 w-20 rounded-full bg-white/10"
              ></div>
            ))}
          </div>
          <div className="mt-6 h-5 w-32 rounded bg-white/10"></div>
          <div className="mt-4 flex flex-wrap gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-8 w-24 rounded-full bg-white/10"
              ></div>
            ))}
          </div>
        </div>

        {/* Keyword Density Skeleton */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="mb-6 h-7 w-48 rounded bg-white/10"></div>
          <div className="mb-4 h-4 w-32 rounded bg-white/10"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i}>
                <div className="mb-1 flex items-center justify-between">
                  <div className="h-4 w-24 rounded bg-white/10"></div>
                  <div className="h-4 w-8 rounded bg-white/10"></div>
                </div>
                <div className="h-2 w-full rounded-full bg-white/10"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ATS Issues Skeleton */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="mb-6 h-7 w-32 rounded bg-white/10"></div>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-16 rounded-lg bg-white/10"
            ></div>
          ))}
        </div>
      </div>

      {/* Recommendations Skeleton */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="mb-6 h-7 w-56 rounded bg-white/10"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-start gap-4 rounded-lg bg-white/5 p-4"
            >
              <div className="h-8 w-8 shrink-0 rounded-full bg-white/10"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-full rounded bg-white/10"></div>
                <div className="h-4 w-3/4 rounded bg-white/10"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

