import Link from "next/link";

export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-4 mx-auto flex w-fit items-center gap-2 text-xs text-white/80 bg-white/5 px-4 py-2 backdrop-blur rounded-full">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-blue-300">🔹</span>
        AI‑Powered Analysis
      </div>

      <h1 className="text-center text-4xl font-extrabold leading-tight text-white md:text-6xl">
        Analyze Your Resume
        <br />
        Against <span className="bg-gradient-to-r from-blue-400 via-sky-400 to-violet-400 bg-clip-text text-transparent">Any Job in</span>
        <br />
        <span className="text-violet-400">Seconds</span>
      </h1>

      <p className="mx-auto mt-6 max-w-2xl text-center text-white/70">
        AI‑powered matching, ATS scoring, and personalized recommendations to land your dream job.
      </p>

      <div className="mt-10 flex justify-center">
        <Link
          href="/start"
          className="group inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          Start Analysis
          <span className="transition-transform group-hover:translate-x-0.5">↗</span>
        </Link>
      </div>
    </section>
  );
}


