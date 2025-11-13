/**
 * Features section component showing key benefits
 */
export default function Features() {
  const features = [
    {
      icon: (
        <svg
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: 'Find Your Gaps',
      description: 'Identify missing skills and qualifications to improve your resume match.',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-300',
    },
    {
      icon: (
        <svg
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
          />
        </svg>
      ),
      title: 'Beat the Bots',
      description: 'Get ATS compatibility scores and pass automated screening systems.',
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-300',
      titleColor: 'text-blue-400',
    },
    {
      icon: (
        <svg
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
      title: 'Get Tailored Advice',
      description: 'Receive personalized recommendations to optimize your resume.',
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-300',
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="mb-12 text-center text-3xl font-bold text-white md:text-4xl">
        Everything You Need to Stand Out
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
          >
            {/* Icon */}
            <div
              className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full ${feature.iconBg} ${feature.iconColor} ${
                index === 1 ? 'rounded-lg' : 'rounded-full'
              }`}
            >
              {feature.icon}
            </div>

            {/* Title */}
            <h3
              className={`mb-4 text-xl font-bold ${
                feature.titleColor || 'text-white'
              }`}
            >
              {feature.title}
            </h3>

            {/* Description */}
            <p className="text-white/70">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

