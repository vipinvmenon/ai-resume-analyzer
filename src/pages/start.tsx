import Stepper from "@/components/Stepper";
import UploadCard from "@/components/UploadCard";

export default function Start() {
  return (
    <main className="px-6 py-12">
      <Stepper active={1} />

      <h1 className="mt-8 text-center text-3xl font-bold text-white md:text-5xl">
        Upload Your Resume
      </h1>
      <p className="mt-3 text-center text-white/70">
        Upload your resume in PDF or DOCX format to get started with the analysis
      </p>

      <UploadCard />
    </main>
  );
}