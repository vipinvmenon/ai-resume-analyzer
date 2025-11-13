import Link from "next/link";

export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-4 mx-auto flex w-fit items-center gap-2 text-xs text-white/80 border border-blue-400/30 bg-blue-500/10 px-4 py-2 backdrop-blur rounded-full">
        <svg
          className="h-4 w-4 text-blue-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
        AI‑Powered Analysis
      </div>

      <h1 className="text-center text-4xl font-extrabold leading-tight text-white md:text-6xl">
        Analyze Your Resume{' '}
        <span className="text-white">Against</span>{' '}
        <span className="bg-gradient-to-r from-blue-400 via-sky-400 to-violet-400 bg-clip-text text-transparent">
          Any Job in
        </span>{' '}
        <span className="text-violet-400">Seconds</span>
      </h1>

      <p className="mx-auto mt-6 max-w-2xl text-center text-white/70">
        AI‑powered matching, ATS scoring, and personalized recommendations to land your dream job.
      </p>

      <div className="mt-10 flex justify-center">
        <Link
          href="/start"
          className="group inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-4 font-medium text-white shadow-lg hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 transition-all"
        >
          Start Analysis
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </section>
  );
}


