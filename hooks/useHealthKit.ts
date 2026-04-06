import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

let AppleHealthKit: any = null;
if (Platform.OS === 'ios') {
  AppleHealthKit = require('react-native-health').default;
}

const PERMISSIONS = Platform.OS === 'ios' && AppleHealthKit ? {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.StepCount,
      AppleHealthKit.Constants.Permissions.SleepAnalysis,
      AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
    ],
    write: [],
  },
} : null;

export interface HealthKitSleepSample {
  startDate: string;
  endDate:   string;
  value:     string;
}

export function useHealthKit() {
  const [available, setAvailable]   = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'ios' || !AppleHealthKit) return;

    AppleHealthKit.isAvailable((err: any, isAvail: boolean) => {
      if (err || !isAvail) return;
      setAvailable(true);

      AppleHealthKit.initHealthKit(PERMISSIONS, (initErr: any) => {
        if (!initErr) setAuthorized(true);
      });
    });
  }, []);

  const getStepsToday = (): Promise<number> => {
    return new Promise((resolve) => {
      if (!authorized) return resolve(0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      AppleHealthKit.getStepCount(
        { date: today.toISOString() },
        (err: any, result: { value: number }) => {
          resolve(err ? 0 : (result?.value ?? 0));
        }
      );
    });
  };

  const getDistanceToday = (): Promise<number> => {
    return new Promise((resolve) => {
      if (!authorized) return resolve(0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      AppleHealthKit.getDistanceWalkingRunning(
        { date: today.toISOString(), unit: 'kilometer' },
        (err: any, result: { value: number }) => {
          resolve(err ? 0 : (result?.value ?? 0));
        }
      );
    });
  };

  const getSleepLastNight = (): Promise<HealthKitSleepSample[]> => {
    return new Promise((resolve) => {
      if (!authorized) return resolve([]);
      const end   = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 1);
      start.setHours(18, 0, 0, 0);
      AppleHealthKit.getSleepSamples(
        { startDate: start.toISOString(), endDate: end.toISOString() },
        (err: any, results: HealthKitSleepSample[]) => {
          resolve(err ? [] : (results ?? []));
        }
      );
    });
  };

  return { available, authorized, getStepsToday, getDistanceToday, getSleepLastNight };
}
