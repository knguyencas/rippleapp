export function roundToClosestMinute(minute: number, minuteOptions: number[]): number {
  let nearest = minuteOptions[0];
  let minDiff = Infinity;

  for (const value of minuteOptions) {
    const diff = Math.abs(value - minute);
    if (diff < minDiff) {
      minDiff = diff;
      nearest = value;
    }
  }

  return nearest;
}

export function clampListIndex(index: number, length: number): number {
  return Math.min(length - 1, Math.max(0, index));
}

