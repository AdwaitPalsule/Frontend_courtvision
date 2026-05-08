const TENNIS_API  = import.meta.env.VITE_API_BASE_TENNIS;
const BADMINTON_API = import.meta.env.VITE_API_BASE_BADMINTON;

export type Sport = "tennis" | "badminton";

export async function uploadVideo(
  file: File,
  sport: Sport,
  onStageUpdate: (stage: string, progress: number) => void
): Promise<string> {
  const API_BASE = sport === "tennis" ? TENNIS_API : BADMINTON_API;

  onStageUpdate("Extracting frames...", 5);
  const formData = new FormData();
  formData.append("video", file);

  const res = await fetch(`${API_BASE}/analyze`, { method: "POST", body: formData });
  if (!res.ok) throw new Error("Upload failed");
  const { job_id } = await res.json();

  const stages = [
    { stage: "Extracting frames...",        progress: 10 },
    { stage: "Detecting players...",        progress: 25 },
    { stage: "Tracking ball trajectory...", progress: 40 },
    { stage: "Analyzing shot patterns...",  progress: 60 },
    { stage: "Mapping court positions...",  progress: 75 },
    { stage: "Generating report...",        progress: 90 },
  ];
  let stageIndex = 0;

  while (true) {
    const { stage, progress } = stages[Math.min(stageIndex, stages.length - 1)];
    onStageUpdate(stage, progress);
    stageIndex++;

    await new Promise(r => setTimeout(r, 5000));

    const poll = await fetch(`${API_BASE}/status/${job_id}`);
    if (poll.headers.get("content-type")?.includes("application/pdf")) {
      const blob = await poll.blob();
      onStageUpdate("Generating report...", 100);
      return URL.createObjectURL(blob);
    }

    const data = await poll.json();
    if (data.status === "error") throw new Error(data.message);
  }
}