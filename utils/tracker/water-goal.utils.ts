export const MIN_WATER_GOAL = 1;
export const MAX_WATER_GOAL = 20;

export function clampWaterGoal(value: number): number {
  return Math.min(MAX_WATER_GOAL, Math.max(MIN_WATER_GOAL, value));
}

export function parseWaterGoal(raw: string): number | null {
  const value = Math.floor(Number(raw));
  if (!Number.isFinite(value)) return null;
  if (value < MIN_WATER_GOAL || value > MAX_WATER_GOAL) return null;
  return value;
}

