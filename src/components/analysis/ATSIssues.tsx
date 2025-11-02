import type { StructuredAnalysisData } from '@/types';

interface ATSIssuesProps {
  data: StructuredAnalysisData;
}

/**
 * Component for displaying ATS issues with severity levels
 */
export default function ATSIssues({ data }: ATSIssuesProps) {
  const { atsIssues } = data;

  const getSeverityColor = (severity: 'HIGH' | 'MEDIUM' | 'LOW') => {
    switch (severity) {
      case 'HIGH':
        return 'bg-red-500/20 border-red-500/30 text-red-300';
      case 'MEDIUM':
        return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300';
      case 'LOW':
        return 'bg-green-500/20 border-green-500/30 text-green-300';
    }
  };

  const getSeverityBadgeColor = (severity: 'HIGH' | 'MEDIUM' | 'LOW') => {
    switch (severity) {
      case 'HIGH':
        return 'bg-red-500 text-white';
      case 'MEDIUM':
        return 'bg-yellow-500 text-white';
      case 'LOW':
        return 'bg-green-500 text-white';
    }
  };

  if (atsIssues.length === 0) {
    return null;
  }

  // Group issues by severity
  const groupedIssues = {
    HIGH: atsIssues.filter((i) => i.severity === 'HIGH'),
    MEDIUM: atsIssues.filter((i) => i.severity === 'MEDIUM'),
    LOW: atsIssues.filter((i) => i.severity === 'LOW'),
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white backdrop-blur-sm">
      <h3 className="mb-6 text-xl font-semibold">ATS Issues</h3>

      <div className="space-y-3">
        {Object.entries(groupedIssues).map(([severity, issues]) => {
          if (issues.length === 0) return null;

          return issues.map((issue, index) => (
            <div
              key={`${severity}-${index}`}
              className={`rounded-lg border p-4 ${getSeverityColor(issue.severity as 'HIGH' | 'MEDIUM' | 'LOW')}`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${getSeverityBadgeColor(
                    issue.severity as 'HIGH' | 'MEDIUM' | 'LOW'
                  )}`}
                >
                  {issue.severity}
                </span>
                <p className="text-sm font-medium">{issue.message}</p>
              </div>
            </div>
          ));
        })}
      </div>
    </div>
  );
}

