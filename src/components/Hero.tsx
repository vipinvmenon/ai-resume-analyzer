import Link from "next/link";
import GlareHover from "./GlareHover";
import GradientText from "./GradientText";
import { Sparkles } from "lucide-react";

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
          <rect x="4" y="4" width="16" height="16" rx="3" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="9" cy="10" r="1.5" fill="currentColor" />
          <circle cx="15" cy="10" r="1.5" fill="currentColor" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 15h6" />
        </svg>
        AI‑Powered Analysis
      </div>

      <h1 className="text-center text-4xl font-extrabold leading-tight text-white md:text-6xl">
        Analyze Your Resume Against Any Job in Seconds
        
      </h1>

      <div className="mx-auto mt-6 max-w-2xl text-center">
        <GradientText
          colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
          animationSpeed={8}
          showBorder={false}
          className="text-lg"
        >
          AI‑powered matching, ATS scoring, and personalized recommendations to land your dream job.
        </GradientText>
      </div>

      <div className="mt-10 flex justify-center">
        <Link href="/start" className="block">
          <GlareHover
            width="auto"
            height="auto"
            background="rgba(59, 130, 246, 0.1)"
            borderRadius="2.5rem"
            borderColor="rgba(96, 165, 250, 0.3)"
            glareColor="#ffffff"
            glareOpacity={0.3}
            glareAngle={-30}
            glareSize={300}
            transitionDuration={800}
            playOnce={false}
            className="backdrop-blur px-6 py-3 font-medium text-white shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <div className="inline-flex items-center gap-2">
              Start Analysis
              <Sparkles className="h-3 w-3 text-yellow-200 transition-transform group-hover:scale-110" />
            </div>
          </GlareHover>
        </Link>
      </div>
    </section>
  );
}


