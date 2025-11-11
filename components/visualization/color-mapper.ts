// 5-level thickness color scale
export const thicknessScale = {
  excellent: { min: 0.9, max: 1.0, color: "#22c55e", label: "Excellent (90-100%)" }, // Green
  good: { min: 0.75, max: 0.89, color: "#a3e635", label: "Good (75-89%)" }, // Lime
  moderate: { min: 0.6, max: 0.74, color: "#eab308", label: "Moderate (60-74%)" }, // Yellow
  poor: { min: 0.4, max: 0.59, color: "#f97316", label: "Poor (40-59%)" }, // Orange
  critical: { min: 0, max: 0.39, color: "#000000", label: "Critical (<40%)" }, // Black
}

export function getThicknessColor(value: number, maxValue = 100): string {
  const normalized = value / maxValue
  if (normalized >= thicknessScale.excellent.min) return thicknessScale.excellent.color
  if (normalized >= thicknessScale.good.min) return thicknessScale.good.color
  if (normalized >= thicknessScale.moderate.min) return thicknessScale.moderate.color
  if (normalized >= thicknessScale.poor.min) return thicknessScale.poor.color
  return thicknessScale.critical.color
}

export function getThicknessLevel(value: number, maxValue = 100): string {
  const normalized = value / maxValue
  if (normalized >= thicknessScale.excellent.min) return "excellent"
  if (normalized >= thicknessScale.good.min) return "good"
  if (normalized >= thicknessScale.moderate.min) return "moderate"
  if (normalized >= thicknessScale.poor.min) return "poor"
  return "critical"
}
