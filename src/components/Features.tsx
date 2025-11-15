'use client';

import { useChromaGrid } from '@/hooks/useChromaGrid';
import ChromaGridOverlay from './ChromaGridOverlay';

/**
 * Features section component showing key benefits with ChromaGrid-style animations
 */
export default function Features() {
  const { rootRef, fadeRef, handleMove, handleLeave, handleCardMove } = useChromaGrid();

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
      borderColor: '#3B82F6',
      gradient: 'linear-gradient(145deg, #3B82F6, rgba(0, 0, 0, 0.3))',
    },
    {
      icon: (
        <svg
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <rect
            x="4"
            y="4"
            width="16"
            height="16"
            rx="3"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="9" cy="10" r="1.5" fill="currentColor" />
          <circle cx="15" cy="10" r="1.5" fill="currentColor" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 15h6"
          />
        </svg>
      ),
      title: 'Beat the Bots',
      description: 'Get ATS compatibility scores and pass automated screening systems.',
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-300',
      borderColor: '#8B5CF6',
      gradient: 'linear-gradient(180deg, #8B5CF6, rgba(0, 0, 0, 0.3))',
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
      borderColor: '#10B981',
      gradient: 'linear-gradient(210deg, #10B981, rgba(0, 0, 0, 0.3))',
    },
  ];


  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="mb-12 text-center text-3xl font-bold text-white md:text-4xl">
        Everything You Need to Stand Out
      </h2>

      <ChromaGridOverlay
        rootRef={rootRef}
        fadeRef={fadeRef}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        className="w-full grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {features.map((feature, index) => (
          <div
            key={index}
            onMouseMove={handleCardMove}
            className="group relative flex flex-col rounded-2xl overflow-hidden border border-blue-400/30 backdrop-blur transition-colors duration-300 cursor-pointer"
            style={{
              background: 'rgba(59, 130, 246, 0.1)',
              '--spotlight-color': 'rgba(255,255,255,0.05)',
            } as React.CSSProperties}
          >
            {/* Spotlight effect */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-20 opacity-0 group-hover:opacity-100"
              style={{
                background:
                  'radial-gradient(circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 70%)',
              }}
            />

            {/* Card content */}
            <div className="relative z-10 p-8 text-center">
              {/* Icon */}
              <div
                className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full ${feature.iconBg} ${feature.iconColor} ${
                  index === 1 ? 'rounded-lg' : 'rounded-full'
                }`}
              >
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="mb-4 text-xl font-bold text-white">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-white/70">{feature.description}</p>
            </div>
          </div>
        ))}
      </ChromaGridOverlay>
    </section>
  );
}

