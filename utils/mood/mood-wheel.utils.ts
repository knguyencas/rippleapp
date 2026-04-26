export function getWheelIndexFromDegree(
  degree: number,
  degreePerItem: number,
  totalItems: number
): number {
  const normalized = ((-degree) % 360 + 360) % 360;
  return Math.floor(normalized / degreePerItem) % totalItems;
}

export function getSnappedDegree(
  currentDegree: number,
  targetIndex: number,
  degreePerItem: number
): number {
  const target = -((targetIndex + 0.5) * degreePerItem);
  let diff = target - (currentDegree % 360);
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return currentDegree + diff;
}

export function buildEmojiPositions(
  count: number,
  degreePerItem: number,
  radius: number,
  trackRadius: number,
  itemSize: number
) {
  return Array.from({ length: count }, (_, index) => {
    const centerDegree = (index + 0.5) * degreePerItem;
    const centerRad = (centerDegree * Math.PI) / 180;
    return {
      left: radius + Math.sin(centerRad) * trackRadius - itemSize / 2,
      top: radius - Math.cos(centerRad) * trackRadius - itemSize / 2,
    };
  });
}

