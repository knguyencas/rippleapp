import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { healthApi } from '../services/health';


let Pedometer: any = null;
if (Platform.OS !== 'web') {
  Pedometer = require('expo-sensors').Pedometer;
}

const STEP_GOAL = 8000;
const SAVE_INTERVAL_MS = 5 * 60 * 1000; // save to backend every 5 minutes

export function useStepCounter() {
  const [steps, setSteps] = useState<number | null>(null);
  const [available, setAvailable] = useState(false);
  const [permission, setPermission] = useState<'granted' | 'denied' | 'unknown'>('unknown');
  const lastSavedSteps = useRef<number | null>(null);
  const saveTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const todayStart = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const saveToBackend = async (currentSteps: number) => {
    if (currentSteps === lastSavedSteps.current) return;
    try {
      const dateStr = new Date().toISOString().split('T')[0];
      await healthApi.saveSteps(dateStr, currentSteps);
      lastSavedSteps.current = currentSteps;
    } catch {

    }
  };

  useEffect(() => {
    if (Platform.OS === 'web' || !Pedometer) {
      setAvailable(false);
      return;
    }

    let subscription: any = null;

    (async () => {

      const isAvail = await Pedometer.isAvailableAsync();
      setAvailable(isAvail);
      if (!isAvail) return;


      const { status } = await Pedometer.requestPermissionsAsync();
      setPermission(status === 'granted' ? 'granted' : 'denied');
      if (status !== 'granted') return;


      try {
        const result = await Pedometer.getStepCountAsync(todayStart(), new Date());
        if (result?.steps != null) {
          setSteps(result.steps);
          saveToBackend(result.steps);
        }
      } catch {

      }


      subscription = Pedometer.watchStepCount((result: { steps: number }) => {
        setSteps(prev => {
          const newSteps = (prev ?? 0) + result.steps;
          return newSteps;
        });
      });


      saveTimer.current = setInterval(async () => {
        try {
          const result = await Pedometer.getStepCountAsync(todayStart(), new Date());
          if (result?.steps != null) {
            setSteps(result.steps);
            saveToBackend(result.steps);
          }
        } catch {}
      }, SAVE_INTERVAL_MS);
    })();

    return () => {
      subscription?.remove();
      if (saveTimer.current) clearInterval(saveTimer.current);
    };
  }, []);

  return {
    steps,
    available,
    permission,
    goal: STEP_GOAL,
    progress: steps != null ? Math.min(steps / STEP_GOAL, 1) : 0,
  };
}
