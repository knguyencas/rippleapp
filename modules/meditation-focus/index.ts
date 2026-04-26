import { NativeModule, requireNativeModule } from 'expo';
import type { EventSubscription } from 'expo-modules-core';

type Events = {
  onScreenOff: () => void;
  onScreenOn: () => void;
};

declare class MeditationFocusModuleType extends NativeModule<Events> {
  isScreenLocked(): boolean;
}

const NativeMeditationFocus = requireNativeModule<MeditationFocusModuleType>('MeditationFocus');

export type ScreenSubscription = EventSubscription;

export function isScreenLocked(): boolean {
  return NativeMeditationFocus.isScreenLocked();
}

export function addScreenOffListener(handler: () => void): ScreenSubscription {
  return NativeMeditationFocus.addListener('onScreenOff', handler);
}

export function addScreenOnListener(handler: () => void): ScreenSubscription {
  return NativeMeditationFocus.addListener('onScreenOn', handler);
}

export default NativeMeditationFocus;
