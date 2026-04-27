export function getGreeting(date: Date = new Date()): string {
  const h = date.getHours();
  if (h < 11) return 'Chào buổi sáng';
  if (h < 17) return 'Chào buổi chiều';
  if (h < 21) return 'Chào buổi tối';
  return 'Chúc ngủ ngon';
}
