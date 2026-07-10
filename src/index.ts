import type { EventSubscription } from 'expo-modules-core';
import { Platform } from 'react-native';

import type {
  AccessibilityChangeEvent,
  AccessibilityChangeListener,
  AccessibilityFlag,
  AccessibilitySnapshot,
  ContentSizeCategory,
} from './ExpoAccessibilityPlus.types';
import ExpoAccessibilityPlus from './ExpoAccessibilityPlusModule';

const isIOS = Platform.OS === 'ios';

const FALSE_SNAPSHOT: AccessibilitySnapshot = {
  boldText: false,
  darkerSystemColors: false,
  grayscale: false,
  invertColors: false,
  reduceMotion: false,
  reduceTransparency: false,
  voiceOver: false,
  switchControl: false,
  monoAudio: false,
  closedCaptioning: false,
  speakScreen: false,
  speakSelection: false,
  videoAutoplay: false,
  onOffSwitchLabels: false,
  buttonShapes: false,
  prefersCrossFadeTransitions: false,
  shouldDifferentiateWithoutColor: false,
  contentSizeCategory: 'unspecified',
};

const noopSubscription: EventSubscription = { remove() {} };

// Every getter below is a **synchronous** call — the underlying UIAccessibility
// properties are cheap flag lookups, so we don't wrap them in Promises. On
// non-iOS platforms we short-circuit to sensible defaults.

/** Whether "Bold Text" is enabled in Accessibility settings. */
export function isBoldTextEnabled(): boolean {
  return isIOS ? ExpoAccessibilityPlus.isBoldTextEnabled() : false;
}

/** Whether "Increase Contrast" ("Darker System Colors") is enabled. */
export function isDarkerSystemColorsEnabled(): boolean {
  return isIOS ? ExpoAccessibilityPlus.isDarkerSystemColorsEnabled() : false;
}

/** Whether Grayscale filter is enabled system-wide. */
export function isGrayscaleEnabled(): boolean {
  return isIOS ? ExpoAccessibilityPlus.isGrayscaleEnabled() : false;
}

/** Whether "Smart / Classic Invert Colors" is currently active. */
export function isInvertColorsEnabled(): boolean {
  return isIOS ? ExpoAccessibilityPlus.isInvertColorsEnabled() : false;
}

/** Whether "Reduce Motion" is enabled — prefer static UI over transitions. */
export function isReduceMotionEnabled(): boolean {
  return isIOS ? ExpoAccessibilityPlus.isReduceMotionEnabled() : false;
}

/** Whether "Reduce Transparency" is enabled — avoid vibrancy / blur effects. */
export function isReduceTransparencyEnabled(): boolean {
  return isIOS ? ExpoAccessibilityPlus.isReduceTransparencyEnabled() : false;
}

/** Whether VoiceOver is currently running. */
export function isVoiceOverRunning(): boolean {
  return isIOS ? ExpoAccessibilityPlus.isVoiceOverRunning() : false;
}

/** Whether Switch Control is currently running. */
export function isSwitchControlRunning(): boolean {
  return isIOS ? ExpoAccessibilityPlus.isSwitchControlRunning() : false;
}

/** Whether "Mono Audio" is enabled. */
export function isMonoAudioEnabled(): boolean {
  return isIOS ? ExpoAccessibilityPlus.isMonoAudioEnabled() : false;
}

/** Whether "Closed Captions + SDH" is enabled — surface captions when present. */
export function isClosedCaptioningEnabled(): boolean {
  return isIOS ? ExpoAccessibilityPlus.isClosedCaptioningEnabled() : false;
}

/** Whether "Speak Screen" is enabled. */
export function isSpeakScreenEnabled(): boolean {
  return isIOS ? ExpoAccessibilityPlus.isSpeakScreenEnabled() : false;
}

/** Whether "Speak Selection" is enabled. */
export function isSpeakSelectionEnabled(): boolean {
  return isIOS ? ExpoAccessibilityPlus.isSpeakSelectionEnabled() : false;
}

/**
 * Whether autoplaying video previews should be suppressed.
 * Requires iOS 13+ — returns `false` below that.
 */
export function isVideoAutoplayEnabled(): boolean {
  return isIOS ? ExpoAccessibilityPlus.isVideoAutoplayEnabled() : false;
}

/**
 * Whether the "On/Off Labels" switch is enabled — draw explicit I/O glyphs
 * inside toggles.
 * Requires iOS 13+ — returns `false` below that.
 */
export function isOnOffSwitchLabelsEnabled(): boolean {
  return isIOS ? ExpoAccessibilityPlus.isOnOffSwitchLabelsEnabled() : false;
}

/**
 * Whether "Button Shapes" is enabled — underline / add a backdrop to
 * text-only buttons.
 * Requires iOS 14+ — returns `false` below that.
 */
export function buttonShapesEnabled(): boolean {
  return isIOS ? ExpoAccessibilityPlus.buttonShapesEnabled() : false;
}

/**
 * Whether the user prefers cross-fade transitions instead of horizontal
 * slides.
 * Requires iOS 14+ — returns `false` below that.
 */
export function prefersCrossFadeTransitions(): boolean {
  return isIOS ? ExpoAccessibilityPlus.prefersCrossFadeTransitions() : false;
}

/**
 * Whether "Differentiate Without Color" is enabled — pair color with a shape,
 * label, or pattern so state can be understood without hue perception.
 * Requires iOS 13+ — returns `false` below that.
 *
 * **This is the flag stock `AccessibilityInfo` does not expose.**
 */
export function shouldDifferentiateWithoutColor(): boolean {
  return isIOS ? ExpoAccessibilityPlus.shouldDifferentiateWithoutColor() : false;
}

/**
 * The user's preferred Dynamic Type size. Returns `'unspecified'` on non-iOS.
 */
export function preferredContentSizeCategory(): ContentSizeCategory {
  return isIOS ? ExpoAccessibilityPlus.preferredContentSizeCategory() : 'unspecified';
}

/**
 * Read every accessibility flag in one call — cheaper than 18 round-trips
 * during first render.
 */
export function snapshot(): AccessibilitySnapshot {
  return isIOS ? ExpoAccessibilityPlus.snapshot() : { ...FALSE_SNAPSHOT };
}

/**
 * Subscribe to accessibility changes. The listener fires once per system
 * change with the specific `flag` and its new `value`. Filter by `flag` to
 * react only to the flags you care about.
 *
 * Returns an `EventSubscription`; call `.remove()` to unsubscribe. On non-iOS
 * platforms this returns an inert subscription.
 */
export function addChangeListener(listener: AccessibilityChangeListener): EventSubscription {
  if (!isIOS) return noopSubscription;
  return ExpoAccessibilityPlus.addListener('onChange', listener);
}

/** `true` on iOS, `false` elsewhere — useful for gating UI. */
export const isAvailable = isIOS;

export type {
  AccessibilityChangeEvent,
  AccessibilityChangeListener,
  AccessibilityFlag,
  AccessibilitySnapshot,
  ContentSizeCategory,
};
