import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import { useHealthKit } from './useHealthKit';
import { useHealthConnect } from './useHealthConnect';
import { useStepCounter } from './useStepCounter';
import { healthApi } from '../services/health';

const STEP_GOAL = 8000;
const SLEEP_GOAL_MIN = 8 * 60;

export interface HealthSnapshot {
  steps:        number | null;
  distanceKm:   number | null;
  sleepMinutes: number | null;
  source:       'healthkit' | 'healthconnect' | 'pedometer' | 'manual' | null;
  stepsGoal:    number;
  sleepGoal:    number;
}

export function useHealthData() {
  const healthKit     = Platform.OS === 'ios'     ? useHealthKit()     : null;
  const healthConnect = Platform.OS === 'android' ? useHealthConnect() : null;
  const pedometer     = useStepCounter();

  const [snapshot, setSnapshot] = useState<HealthSnapshot>({
    steps:        null,
    distanceKm:   null,
    sleepMinutes: null,
    source:       null,
    stepsGoal:    STEP_GOAL,
    sleepGoal:    SLEEP_GOAL_MIN,
  });

  const refresh = useCallback(async () => {
    if (Platform.OS === 'ios' && healthKit?.authorized) {
      const [steps, km, sleepSamples] = await Promise.all([
        healthKit.getStepsToday(),
        healthKit.getDistanceToday(),
        healthKit.getSleepLastNight(),
      ]);

      const sleepMinutes = sleepSamples.reduce((sum, s) => {
        const ms = new Date(s.endDate).getTime() - new Date(s.startDate).getTime();
        return sum + Math.round(ms / 60000);
      }, 0);

      if (steps > 0) {
        const dateStr = new Date().toISOString().split('T')[0];
        healthApi.saveSteps(dateStr, steps).catch(() => {});
      }

      setSnapshot(prev => ({
        ...prev,
        steps:        steps || null,
        distanceKm:   km    || null,
        sleepMinutes: sleepMinutes || null,
        source:       'healthkit',
      }));
      return;
    }

    if (Platform.OS === 'android' && healthConnect?.authorized) {
      const [steps, km, sleepSessions] = await Promise.all([
        healthConnect.getStepsToday(),
        healthConnect.getDistanceToday(),
        healthConnect.getSleepLastNight(),
      ]);

      const sleepMinutes = sleepSessions.reduce((sum, s) => {
        const ms = new Date(s.endTime).getTime() - new Date(s.startTime).getTime();
        return sum + Math.round(ms / 60000);
      }, 0);

      if (steps > 0) {
        const dateStr = new Date().toISOString().split('T')[0];
        healthApi.saveSteps(dateStr, steps).catch(() => {});
      }

      setSnapshot(prev => ({
        ...prev,
        steps:        steps || null,
        distanceKm:   km    || null,
        sleepMinutes: sleepMinutes || null,
        source:       'healthconnect',
      }));
      return;
    }

    if (pedometer.steps !== null) {
      setSnapshot(prev => ({
        ...prev,
        steps:      pedometer.steps,
        distanceKm: pedometer.steps ? Math.round(pedometer.steps * 0.762) / 1000 : null,
        source:     'pedometer',
      }));
    }
  }, [healthKit?.authorized, healthConnect?.authorized, pedometer.steps]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { ...snapshot, refresh };
}
