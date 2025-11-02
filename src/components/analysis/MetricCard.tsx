interface MetricCardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'circular';
}

/**
 * Metric card component for displaying key metrics
 */
export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  variant = 'default',
}: MetricCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Strong Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Weak Match';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500/20 border-green-500/30';
    if (score >= 60) return 'bg-yellow-500/20 border-yellow-500/30';
    if (score >= 40) return 'bg-orange-500/20 border-orange-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  if (variant === 'circular') {
    const circumference = 2 * Math.PI * 45; // radius = 45
    const offset = circumference - (value / 100) * circumference;

    return (
      <div
        className={`rounded-2xl border ${getScoreBgColor(value)} p-6 text-white backdrop-blur-sm`}
      >
        <div className="mb-4 flex items-center gap-2">
          {icon && <div className="text-2xl">{icon}</div>}
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>

        <div className="relative mx-auto h-32 w-32">
          <svg className="h-32 w-32 -rotate-90 transform">
            {/* Background circle */}
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-white/20"
            />
            {/* Progress circle */}
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className={`transition-all duration-500 ${getScoreColor(value)}`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${getScoreColor(value)}`}>{value}%</span>
          </div>
        </div>

        <div className="mt-4 text-center">
          <span className={`text-sm font-medium ${getScoreColor(value)}`}>
            {getScoreLabel(value)}
          </span>
          {subtitle && <p className="mt-1 text-xs text-white/60">{subtitle}</p>}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border ${getScoreBgColor(value)} p-6 text-white backdrop-blur-sm`}
    >
      <div className="mb-4 flex items-center gap-2">
        {icon && <div className="text-2xl">{icon}</div>}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>

      <div className="mb-2">
        <span className={`text-4xl font-bold ${getScoreColor(value)}`}>{value}%</span>
      </div>

      {/* Progress bar */}
      <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full transition-all duration-500 ${getScoreColor(value).replace('text-', 'bg-')}`}
          style={{ width: `${value}%` }}
        />
      </div>

      <div>
        <span className={`text-sm font-medium ${getScoreColor(value)}`}>
          {getScoreLabel(value)}
        </span>
        {subtitle && <p className="mt-1 text-xs text-white/60">{subtitle}</p>}
      </div>
    </div>
  );
}

