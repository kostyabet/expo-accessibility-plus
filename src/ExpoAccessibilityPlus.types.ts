/**
 * Preferred text size the user has picked in Settings → Display & Brightness →
 * Text Size (and Settings → Accessibility → Display & Text Size for the
 * `accessibility*` values). Values above `extraExtraExtraLarge` are only
 * reachable through the "Larger Accessibility Sizes" toggle and typically
 * warrant a distinct layout treatment.
 */
export type ContentSizeCategory =
  | 'extraSmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'extraLarge'
  | 'extraExtraLarge'
  | 'extraExtraExtraLarge'
  | 'accessibilityMedium'
  | 'accessibilityLarge'
  | 'accessibilityExtraLarge'
  | 'accessibilityExtraExtraLarge'
  | 'accessibilityExtraExtraExtraLarge'
  | 'unspecified';

/**
 * A single accessibility flag whose value can change at runtime.
 *
 * Note: `contentSizeCategory` is included here because it also changes via a
 * system notification — but its value is a `ContentSizeCategory` string, not
 * a boolean.
 */
export type AccessibilityFlag =
  | 'boldText'
  | 'darkerSystemColors'
  | 'grayscale'
  | 'invertColors'
  | 'reduceMotion'
  | 'reduceTransparency'
  | 'voiceOver'
  | 'switchControl'
  | 'monoAudio'
  | 'closedCaptioning'
  | 'speakScreen'
  | 'speakSelection'
  | 'videoAutoplay'
  | 'onOffSwitchLabels'
  | 'buttonShapes'
  | 'prefersCrossFadeTransitions'
  | 'shouldDifferentiateWithoutColor'
  | 'contentSizeCategory';

/**
 * Payload of the unified `onChange` event.
 * `value` is `boolean` for every flag except `contentSizeCategory`, where it
 * is a `ContentSizeCategory` string.
 */
export interface AccessibilityChangeEvent {
  flag: AccessibilityFlag;
  value: boolean | ContentSizeCategory;
}

export type AccessibilityChangeListener = (event: AccessibilityChangeEvent) => void;

/**
 * Full snapshot of every accessibility flag exposed by this module.
 */
export interface AccessibilitySnapshot {
  boldText: boolean;
  darkerSystemColors: boolean;
  grayscale: boolean;
  invertColors: boolean;
  reduceMotion: boolean;
  reduceTransparency: boolean;
  voiceOver: boolean;
  switchControl: boolean;
  monoAudio: boolean;
  closedCaptioning: boolean;
  speakScreen: boolean;
  speakSelection: boolean;
  videoAutoplay: boolean;
  onOffSwitchLabels: boolean;
  buttonShapes: boolean;
  prefersCrossFadeTransitions: boolean;
  shouldDifferentiateWithoutColor: boolean;
  contentSizeCategory: ContentSizeCategory;
}
