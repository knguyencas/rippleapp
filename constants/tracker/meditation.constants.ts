export const DURATION_OPTIONS = [5, 10, 15, 20] as const;
export type DurationMin = (typeof DURATION_OPTIONS)[number];

export const DEFAULT_DURATION: DurationMin = 10;

export const DAILY_GOAL_MIN = 10;

export const BACKGROUND_GRACE_MS = 5_000;

export const FADE_OUT_MS = 600;
