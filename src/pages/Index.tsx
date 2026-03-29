
import { useState, useCallback, useRef } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import VideoUpload from "@/components/VideoUpload";
import AnalysisProgress from "@/components/AnalysisProgress";
import ReportSection from "@/components/ReportSection";

const stages = [
  "Extracting frames...",
  "Detecting players...",
  "Tracking ball trajectory...",
  "Analyzing shot patterns...",
  "Mapping court positions...",
  "Generating report...",
];

const API_BASE = import.meta.env.VITE_API_BASE;

type AppState = "idle" | "analyzing" | "done" | "error";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("idle");
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(stages[0]);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfDownloadUrl, setPdfDownloadUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const startProgressSimulation = () => {
    let currentProgress = 0;
    let stageIndex = 0;
    progressInterval.current = setInterval(() => {
      currentProgress += Math.random() * 0.8 + 0.2;
      if (currentProgress >= 92) currentProgress = 92;
      stageIndex = Math.min(
        Math.floor((currentProgress / 100) * stages.length),
        stages.length - 1
      );
      setProgress(Math.round(currentProgress));
      setStage(stages[stageIndex]);
    }, 1000);
  };

  const stopProgress = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  };

  const handleVideoSubmit = useCallback(async (file: File) => {
    setAppState("analyzing");
    setProgress(0);
    setStage(stages[0]);
    setPdfUrl(null);
    setPdfBlob(null);
    setPdfDownloadUrl(null);
    setErrorMsg("");
    startProgressSimulation();

    try {
      // Step 1 — upload video, get job ID
      const formData = new FormData();
      formData.append("video", file);
      const res = await fetch(`${API_BASE}/analyze`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { job_id } = await res.json();

      // Step 2 — poll every 15 seconds
      while (true) {
        await new Promise(r => setTimeout(r, 15000));
        const poll = await fetch(`${API_BASE}/status/${job_id}`);
        const contentType = poll.headers.get("content-type") || "";

        if (contentType.includes("application/pdf")) {
          stopProgress();
          // Grab the real shareable URL from the header
          const downloadUrl = poll.headers.get("X-Download-Url");
          const blob = await poll.blob();
          const blobUrl = URL.createObjectURL(blob);
          setPdfBlob(blob);
          setPdfUrl(blobUrl);
          setPdfDownloadUrl(downloadUrl);
          setProgress(100);
          setStage("Report ready!");
          setTimeout(() => setAppState("done"), 800);
          break;
        }

        const data = await poll.json();
        if (data.status === "error") {
          throw new Error(data.message || "Analysis failed");
        }
        // status === "processing" — keep polling
      }
    } catch (err: any) {
      stopProgress();
      setErrorMsg(err.message);
      setAppState("error");
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />

      {appState === "idle" && (
        <VideoUpload onVideoSubmit={handleVideoSubmit} isAnalyzing={false} />
      )}
      {appState === "analyzing" && (
        <AnalysisProgress progress={progress} stage={stage} />
      )}
      {appState === "done" && (
        <ReportSection
          pdfUrl={pdfUrl}
          pdfBlob={pdfBlob}
          pdfDownloadUrl={pdfDownloadUrl}
        />
      )}
      {appState === "error" && (
        <div className="py-20 text-center">
          <p className="text-red-500 font-body mb-4">
            Something went wrong: {errorMsg}
          </p>
          <button
            onClick={() => setAppState("idle")}
            className="text-primary underline text-sm"
          >
            Try again
          </button>
        </div>
      )}

      <footer className="py-10 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm font-body">
            © 2026 CourtVision · AI-Powered Match Analysis
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
