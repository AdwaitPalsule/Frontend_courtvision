const API_BASE = import.meta.env.VITE_API_BASE;

export async function uploadVideo(
  file: File,
  onStageUpdate: (stage: string, progress: number) => void
): Promise<string> {
  // Stage 1 — Upload
  onStageUpdate("Extracting frames...", 5);
  const formData = new FormData();
  formData.append("video", file);

  const res = await fetch(`${API_BASE}/analyze`, { method: "POST", body: formData });
  if (!res.ok) throw new Error("Upload failed");
  const { job_id } = await res.json();

  // Stage 2 — Poll with fake stage progression
  const stages = [
    { stage: "Extracting frames...",       progress: 10 },
    { stage: "Detecting players...",       progress: 25 },
    { stage: "Tracking ball trajectory...",progress: 40 },
    { stage: "Analyzing shot patterns...", progress: 60 },
    { stage: "Mapping court positions...", progress: 75 },
    { stage: "Generating report...",       progress: 90 },
  ];
  let stageIndex = 0;

  while (true) {
    const { stage, progress } = stages[Math.min(stageIndex, stages.length - 1)];
    onStageUpdate(stage, progress);
    stageIndex++;

    await new Promise(r => setTimeout(r, 5000)); // poll every 5s

    const poll = await fetch(`${API_BASE}/status/${job_id}`);

    if (poll.headers.get("content-type") === "application/pdf") {
      const blob = await poll.blob();
      onStageUpdate("Generating report...", 100);
      return URL.createObjectURL(blob); // returns downloadable PDF URL
    }

    const data = await poll.json();
    if (data.status === "error") throw new Error(data.message);
  }
}
