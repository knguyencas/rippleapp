import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

let HC: any = null;
if (Platform.OS === 'android') {
  HC = require('react-native-health-connect');
}

const READ_PERMISSIONS = [
  { accessType: 'read', recordType: 'Steps'        },
  { accessType: 'read', recordType: 'SleepSession' },
  { accessType: 'read', recordType: 'Distance'     },
];

export function useHealthConnect() {
  const [available,  setAvailable]  = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'android' || !HC) return;

    (async () => {
      try {
        const isAvail = await HC.getSdkStatus();
        if (isAvail !== HC.SdkAvailabilityStatus.SDK_AVAILABLE) return;
        setAvailable(true);

        await HC.initialize();
        const granted = await HC.requestPermission(READ_PERMISSIONS);
        if (granted?.length > 0) setAuthorized(true);
      } catch {
        // Health Connect not installed or not supported
      }
    })();
  }, []);

  const getStepsToday = async (): Promise<number> => {
    if (!authorized) return 0;
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const result = await HC.readRecords('Steps', {
        timeRangeFilter: {
          operator:  'between',
          startTime: today.toISOString(),
          endTime:   new Date().toISOString(),
        },
      });
      return result.records.reduce((sum: number, r: any) => sum + (r.count ?? 0), 0);
    } catch {
      return 0;
    }
  };

  const getDistanceToday = async (): Promise<number> => {
    if (!authorized) return 0;
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const result = await HC.readRecords('Distance', {
        timeRangeFilter: {
          operator:  'between',
          startTime: today.toISOString(),
          endTime:   new Date().toISOString(),
        },
      });
      const meters = result.records.reduce(
        (sum: number, r: any) => sum + (r.distance?.inMeters ?? 0), 0
      );
      return Math.round(meters) / 1000;
    } catch {
      return 0;
    }
  };

  const getSleepLastNight = async (): Promise<{ startTime: string; endTime: string }[]> => {
    if (!authorized) return [];
    try {
      const end   = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 1);
      start.setHours(18, 0, 0, 0);
      const result = await HC.readRecords('SleepSession', {
        timeRangeFilter: {
          operator:  'between',
          startTime: start.toISOString(),
          endTime:   end.toISOString(),
        },
      });
      return result.records.map((r: any) => ({
        startTime: r.startTime,
        endTime:   r.endTime,
      }));
    } catch {
      return [];
    }
  };

  return { available, authorized, getStepsToday, getDistanceToday, getSleepLastNight };
}
