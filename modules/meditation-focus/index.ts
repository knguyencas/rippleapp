import { Platform } from 'react-native';
import { NativeModule, requireNativeModule } from 'expo';
import type { EventSubscription } from 'expo-modules-core';

type Events = {
  onScreenOff: () => void;
  onScreenOn: () => void;
};

declare class MeditationFocusModuleType extends NativeModule<Events> {
  isScreenLocked(): boolean;
}

export type ScreenSubscription = EventSubscription;

const NOOP_SUBSCRIPTION: ScreenSubscription = { remove: () => {} };

const NativeMeditationFocus: MeditationFocusModuleType | null =
  Platform.OS === 'web'
    ? null
    : requireNativeModule<MeditationFocusModuleType>('MeditationFocus');

export function isScreenLocked(): boolean {
  if (!NativeMeditationFocus) return false;
  return NativeMeditationFocus.isScreenLocked();
}

export function addScreenOffListener(handler: () => void): ScreenSubscription {
  if (!NativeMeditationFocus) return NOOP_SUBSCRIPTION;
  return NativeMeditationFocus.addListener('onScreenOff', handler);
}

export function addScreenOnListener(handler: () => void): ScreenSubscription {
  if (!NativeMeditationFocus) return NOOP_SUBSCRIPTION;
  return NativeMeditationFocus.addListener('onScreenOn', handler);
}

export default NativeMeditationFocus;
