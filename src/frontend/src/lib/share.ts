import { toast } from "sonner";
import type { DiagnosisResult } from "../backend";

export function formatDiagnosisText(diagnosis: DiagnosisResult): string {
  const lines: string[] = [];
  lines.push("🌿 PlantPulse Diagnosis Report");
  lines.push(`Plant: ${diagnosis.plantName}`);

  const statusLabels: Record<string, string> = {
    healthy: "✅ Healthy",
    mild: "⚠️ Mild Issue",
    moderate: "🟠 Moderate Issue",
    severe: "🔴 Severe Issue",
  };
  lines.push(
    `Status: ${statusLabels[diagnosis.healthStatus] ?? diagnosis.healthStatus}`,
  );

  if (diagnosis.conditions.length > 0) {
    lines.push("");
    lines.push("📋 Identified Conditions:");
    for (const c of diagnosis.conditions) lines.push(`  \u2022 ${c}`);
  }

  if (diagnosis.fertilizerRecommendations.length > 0) {
    lines.push("");
    lines.push("💧 Fertilizer Recommendations:");
    for (const r of diagnosis.fertilizerRecommendations)
      lines.push(`  \u2022 ${r}`);
  }

  if (diagnosis.pesticideRecommendations.length > 0) {
    lines.push("");
    lines.push("🐛 Pesticide Recommendations:");
    for (const r of diagnosis.pesticideRecommendations)
      lines.push(`  \u2022 ${r}`);
  }

  if (diagnosis.careTips.length > 0) {
    lines.push("");
    lines.push("❤️ Care Tips:");
    for (const t of diagnosis.careTips) lines.push(`  \u2022 ${t}`);
  }

  lines.push("");
  lines.push("Diagnosed with PlantPulse 🌱");

  return lines.join("\n");
}

export async function shareOrCopy(
  diagnosis: DiagnosisResult,
  _imageUrl?: string,
): Promise<void> {
  const text = formatDiagnosisText(diagnosis);
  const title = `PlantPulse: ${diagnosis.plantName} Diagnosis`;

  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({ title, text });
      return;
    } catch (err) {
      // User cancelled or share failed — fall through to clipboard
      if (err instanceof Error && err.name === "AbortError") return;
    }
  }

  try {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  } catch {
    toast.error("Could not copy to clipboard.");
  }
}
