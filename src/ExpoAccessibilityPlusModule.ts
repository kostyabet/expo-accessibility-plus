import { NativeModule, requireNativeModule } from 'expo-modules-core';

import type {
  AccessibilityChangeEvent,
  AccessibilitySnapshot,
  ContentSizeCategory,
} from './ExpoAccessibilityPlus.types';

type ExpoAccessibilityPlusEvents = {
  onChange(event: AccessibilityChangeEvent): void;
};

declare class ExpoAccessibilityPlusNative extends NativeModule<ExpoAccessibilityPlusEvents> {
  isBoldTextEnabled(): boolean;
  isDarkerSystemColorsEnabled(): boolean;
  isGrayscaleEnabled(): boolean;
  isInvertColorsEnabled(): boolean;
  isReduceMotionEnabled(): boolean;
  isReduceTransparencyEnabled(): boolean;
  isVoiceOverRunning(): boolean;
  isSwitchControlRunning(): boolean;
  isMonoAudioEnabled(): boolean;
  isClosedCaptioningEnabled(): boolean;
  isSpeakScreenEnabled(): boolean;
  isSpeakSelectionEnabled(): boolean;
  isVideoAutoplayEnabled(): boolean;
  isOnOffSwitchLabelsEnabled(): boolean;
  buttonShapesEnabled(): boolean;
  prefersCrossFadeTransitions(): boolean;
  shouldDifferentiateWithoutColor(): boolean;
  preferredContentSizeCategory(): ContentSizeCategory;
  snapshot(): AccessibilitySnapshot;
}

export default requireNativeModule<ExpoAccessibilityPlusNative>('ExpoAccessibilityPlus');
