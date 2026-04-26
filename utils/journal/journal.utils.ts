export interface LogWithCreatedAt {
  createdAt: string;
}

export interface MonthGroup<T extends LogWithCreatedAt> {
  key: string;
  label: string;
  logs: T[];
}

export function groupLogsByMonth<T extends LogWithCreatedAt>(logs: T[]): MonthGroup<T>[] {
  const groups: MonthGroup<T>[] = [];
  const map: Record<string, number> = {};

  logs.forEach((log) => {
    const date = new Date(log.createdAt);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    if (map[key] === undefined) {
      map[key] = groups.length;
      groups.push({ key, label, logs: [] });
    }

    groups[map[key]].logs.push(log);
  });

  return groups;
}

