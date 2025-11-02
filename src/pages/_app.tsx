import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AnalysisProvider } from "@/context/AnalysisContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AnalysisProvider>
      <Component {...pageProps} />
    </AnalysisProvider>
  );
}
