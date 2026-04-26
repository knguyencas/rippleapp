import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { Audio } from 'expo-av';
import {
  addScreenOffListener,
  addScreenOnListener,
} from '../../modules/meditation-focus';
import {
  BACKGROUND_GRACE_MS,
  FADE_OUT_MS,
} from '../../constants/tracker/meditation.constants';
import { computeElapsedSec } from '../../utils/tracker/meditation.utils';

export type SessionStatus = 'idle' | 'playing' | 'paused' | 'completed';

export type PauseReason = 'user' | 'switched_app' | 'audio_error' | null;

export interface SessionState {
  status: SessionStatus;
  elapsedSec: number;
  targetSec: number;
  pauseReason: PauseReason;
  showAwayDialog: boolean;
  awayDurationSec: number;
}

interface StartOptions {
  audioUri: string;
  targetMin: number;
}

const TICK_MS = 250;

export function useMeditationSession(onCompleted?: (actualMin: number) => void) {
  const [state, setState] = useState<SessionState>({
    status: 'idle',
    elapsedSec: 0,
    targetSec: 0,
    pauseReason: null,
    showAwayDialog: false,
    awayDurationSec: 0,
  });

  const soundRef = useRef<Audio.Sound | null>(null);
  const tickerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef<number>(0);
  const totalPausedMsRef = useRef<number>(0);
  const pausedAtRef = useRef<number | null>(null);
  const screenOffRef = useRef<boolean>(false);
  const backgroundedAtRef = useRef<number | null>(null);
  const sessionActiveRef = useRef<boolean>(false);
  const completedFiredRef = useRef<boolean>(false);

  const stopAudio = useCallback(async (fade = false) => {
    const sound = soundRef.current;
    if (!sound) return;
    try {
      if (fade) {
        const steps = 6;
        const stepMs = FADE_OUT_MS / steps;
        for (let i = steps; i >= 0; i--) {
          await sound.setVolumeAsync(i / steps).catch(() => {});
          await new Promise((r) => setTimeout(r, stepMs));
        }
      }
      await sound.stopAsync().catch(() => {});
      await sound.unloadAsync().catch(() => {});
    } finally {
      soundRef.current = null;
    }
  }, []);

  const pauseAudio = useCallback(async () => {
    const sound = soundRef.current;
    if (!sound) return;
    try { await sound.pauseAsync(); } catch {}
  }, []);

  const resumeAudio = useCallback(async () => {
    const sound = soundRef.current;
    if (!sound) return;
    try {
      await sound.setVolumeAsync(1.0);
      await sound.playAsync();
    } catch {}
  }, []);

  const stopTicker = useCallback(() => {
    if (tickerRef.current) {
      clearInterval(tickerRef.current);
      tickerRef.current = null;
    }
  }, []);

  const startTicker = useCallback(() => {
    stopTicker();
    tickerRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.status !== 'playing') return prev;
        const elapsed = computeElapsedSec(
          startedAtRef.current,
          totalPausedMsRef.current
        );
        if (elapsed >= prev.targetSec) {
          return { ...prev, elapsedSec: prev.targetSec, status: 'completed' };
        }
        return { ...prev, elapsedSec: elapsed };
      });
    }, TICK_MS);
  }, [stopTicker]);

  useEffect(() => {
    if (state.status !== 'completed' || completedFiredRef.current) return;
    completedFiredRef.current = true;
    stopTicker();
    void stopAudio(true);
    sessionActiveRef.current = false;
    const actualMin = Math.round(state.targetSec / 60);
    onCompleted?.(actualMin);
  }, [state.status, state.targetSec, stopTicker, stopAudio, onCompleted]);

  const start = useCallback(
    async ({ audioUri, targetMin }: StartOptions) => {
      stopTicker();
      await stopAudio(false);
      completedFiredRef.current = false;
      totalPausedMsRef.current = 0;
      pausedAtRef.current = null;
      backgroundedAtRef.current = null;
      screenOffRef.current = false;

      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: false,
        });
      } catch {}

      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri: audioUri },
          { shouldPlay: true, isLooping: true, volume: 1.0 }
        );
        soundRef.current = sound;
      } catch (e) {
        console.warn('Failed to load audio:', e);
        setState((prev) => ({ ...prev, status: 'paused', pauseReason: 'audio_error' }));
        return false;
      }

      const targetSec = targetMin * 60;
      startedAtRef.current = Date.now();
      sessionActiveRef.current = true;

      setState({
        status: 'playing',
        elapsedSec: 0,
        targetSec,
        pauseReason: null,
        showAwayDialog: false,
        awayDurationSec: 0,
      });

      startTicker();
      return true;
    },
    [stopTicker, stopAudio, startTicker]
  );

  const pause = useCallback(
    async (reason: PauseReason = 'user') => {
      setState((prev) => {
        if (prev.status !== 'playing') return prev;
        if (pausedAtRef.current == null) pausedAtRef.current = Date.now();
        return { ...prev, status: 'paused', pauseReason: reason };
      });
      await pauseAudio();
    },
    [pauseAudio]
  );

  const resume = useCallback(async () => {
    setState((prev) => {
      if (prev.status !== 'paused') return prev;
      if (pausedAtRef.current != null) {
        totalPausedMsRef.current += Date.now() - pausedAtRef.current;
        pausedAtRef.current = null;
      }
      return { ...prev, status: 'playing', pauseReason: null, showAwayDialog: false };
    });
    await resumeAudio();
  }, [resumeAudio]);

  const stopAndSave = useCallback(async (): Promise<number> => {
    stopTicker();
    sessionActiveRef.current = false;
    await stopAudio(true);

    const cutoff = pausedAtRef.current ?? Date.now();
    const actualSec = Math.max(
      0,
      Math.floor((cutoff - startedAtRef.current - totalPausedMsRef.current) / 1000)
    );
    const actualMin = Math.max(0, Math.round(actualSec / 60));

    setState({
      status: 'idle',
      elapsedSec: 0,
      targetSec: 0,
      pauseReason: null,
      showAwayDialog: false,
      awayDurationSec: 0,
    });

    return actualMin;
  }, [stopTicker, stopAudio]);

  const cancel = useCallback(async () => {
    stopTicker();
    sessionActiveRef.current = false;
    await stopAudio(false);
    setState({
      status: 'idle',
      elapsedSec: 0,
      targetSec: 0,
      pauseReason: null,
      showAwayDialog: false,
      awayDurationSec: 0,
    });
  }, [stopTicker, stopAudio]);

  const dismissAwayDialog = useCallback(() => {
    setState((prev) => ({ ...prev, showAwayDialog: false, awayDurationSec: 0 }));
  }, []);

  useEffect(() => {
    const offSub = addScreenOffListener(() => {
      screenOffRef.current = true;
    });
    const onSub = addScreenOnListener(() => {
      screenOffRef.current = false;
    });

    const handleAppState = (next: AppStateStatus) => {
      if (!sessionActiveRef.current) return;

      if (next === 'background' || next === 'inactive') {
        if (screenOffRef.current) {
          backgroundedAtRef.current = null;
          return;
        }
        if (backgroundedAtRef.current == null) {
          backgroundedAtRef.current = Date.now();
        }
        void pause('switched_app');
        return;
      }

      if (next === 'active') {
        const leftAt = backgroundedAtRef.current;
        backgroundedAtRef.current = null;
        if (leftAt == null) return;

        const awayMs = Date.now() - leftAt;
        if (awayMs >= BACKGROUND_GRACE_MS) {
          setState((prev) => ({
            ...prev,
            showAwayDialog: true,
            awayDurationSec: Math.round(awayMs / 1000),
          }));
        } else {
          void resume();
        }
      }
    };

    const sub = AppState.addEventListener('change', handleAppState);

    return () => {
      offSub.remove();
      onSub.remove();
      sub.remove();
    };
  }, [pause, resume]);

  useEffect(() => {
    return () => {
      stopTicker();
      void stopAudio(false);
      sessionActiveRef.current = false;
    };
  }, [stopTicker, stopAudio]);

  return {
    state,
    start,
    pause,
    resume,
    stopAndSave,
    cancel,
    dismissAwayDialog,
  };
}
