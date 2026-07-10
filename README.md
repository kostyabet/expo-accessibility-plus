# expo-accessibility-plus

![npm](https://img.shields.io/npm/v/expo-accessibility-plus?color=2354cc)
![downloads](https://img.shields.io/npm/dm/expo-accessibility-plus?color=707d9c)
![CI](https://github.com/kostyabet/expo-accessibility-plus/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-iOS%2014%2B-lightgrey)
![Expo](https://img.shields.io/badge/Expo_SDK-54%2B-000020)

<p align="center">
  <img src="./hero.png" alt="expo-accessibility-plus — extended iOS accessibility flags for React Native" width="880" />
</p>

<h3>Extended accessibility settings for <a href="https://reactnative.dev/">React Native</a> / <a href="https://expo.dev/">Expo</a>. Read and subscribe to iOS <a href="https://developer.apple.com/documentation/uikit/uiaccessibility">UIAccessibility</a> flags that stock <code>AccessibilityInfo</code> doesn't expose — differentiate without color, darker system colors, content size category, button shapes, and more.</h3>

## Features

- _`Differentiate Without Color`_:
  - The **flag stock `AccessibilityInfo` doesn't expose**. Read `shouldDifferentiateWithoutColor()` and subscribe to changes so colorblind users see shape/label cues in addition to hue.
- _`Increase Contrast`_ (a.k.a. "Darker System Colors"):
  - Detect the `isDarkerSystemColorsEnabled` flag and beef up your text / border contrast when the user asks for it.
- _`Content Size Category`_:
  - Get the current Dynamic Type step as a typed string (`'large'`, `'accessibilityExtraExtraLarge'`, …). React to changes and adapt row heights, truncation and multi-line policies.
- _`Every other UIAccessibility flag`_:
  - Bold text, grayscale, invert colors, reduce motion, reduce transparency, mono audio, closed captions, VoiceOver / Switch Control running state, speak screen / selection, video autoplay, on/off switch labels, button shapes, cross-fade transitions.
- _`Unified change event`_:
  - One `addChangeListener` subscription receives every flag change as `{ flag, value }`. No need to wire up 18 separate observers.
- _`Snapshot()`_:
  - Read all 18 flags at once during first render — one native round-trip instead of eighteen.
- _`Cross-platform safe`_:
  - Every getter returns `false` / `'unspecified'` on Android so you can call it unconditionally from shared code.
- _`Expo Modules API`_:
  - Ships as a modern Expo Module — no legacy `.m` bridge, no manual linking, no config plugin. Just `npx expo install` and go.

## Installation

```bash
npx expo install expo-accessibility-plus
```

Then rebuild your dev client (this package uses native code, so it is **not** available in Expo Go):

```bash
npx expo prebuild
npx expo run:ios
```

## Setup

No config plugin, no entitlements, no manual Xcode steps.

## Usage

```ts
import * as A11y from 'expo-accessibility-plus';

// One-shot reads — fine to call during render for the first frame.
const differentiate = A11y.shouldDifferentiateWithoutColor();
const boldText = A11y.isBoldTextEnabled();
const category = A11y.preferredContentSizeCategory(); // 'large' | 'accessibilityMedium' | ...

// Batch read (cheapest during mount):
const snap = A11y.snapshot();
if (snap.darkerSystemColors) {
  // tune your palette
}

// Subscribe to any change:
const sub = A11y.addChangeListener(({ flag, value }) => {
  console.log(flag, '→', value);
});

// Later:
sub.remove();
```

## API reference

### Getters (all synchronous)

| Function | Returns | Min iOS | Notes |
| -------- | ------- | ------- | ----- |
| `isBoldTextEnabled` | `boolean` | 14 | |
| `isDarkerSystemColorsEnabled` | `boolean` | 14 | "Increase Contrast" toggle |
| `isGrayscaleEnabled` | `boolean` | 14 | |
| `isInvertColorsEnabled` | `boolean` | 14 | Smart / Classic Invert |
| `isReduceMotionEnabled` | `boolean` | 14 | |
| `isReduceTransparencyEnabled` | `boolean` | 14 | |
| `isVoiceOverRunning` | `boolean` | 14 | |
| `isSwitchControlRunning` | `boolean` | 14 | |
| `isMonoAudioEnabled` | `boolean` | 14 | |
| `isClosedCaptioningEnabled` | `boolean` | 14 | |
| `isSpeakScreenEnabled` | `boolean` | 14 | |
| `isSpeakSelectionEnabled` | `boolean` | 14 | |
| `isVideoAutoplayEnabled` | `boolean` | 14 | |
| `isOnOffSwitchLabelsEnabled` | `boolean` | 14 | |
| `shouldDifferentiateWithoutColor` | `boolean` | 14 | **The one stock RN doesn't have** |
| `buttonShapesEnabled` | `boolean` | 14 | |
| `prefersCrossFadeTransitions` | `boolean` | 14 | |
| `preferredContentSizeCategory` | `ContentSizeCategory` | 14 | Dynamic Type step |
| `snapshot` | `AccessibilitySnapshot` | 14 | All of the above in one call |
| `isAvailable` | `boolean` (property) | — | `true` on iOS, `false` elsewhere |

```ts
type ContentSizeCategory =
  | 'extraSmall' | 'small' | 'medium' | 'large'
  | 'extraLarge' | 'extraExtraLarge' | 'extraExtraExtraLarge'
  | 'accessibilityMedium' | 'accessibilityLarge'
  | 'accessibilityExtraLarge' | 'accessibilityExtraExtraLarge'
  | 'accessibilityExtraExtraExtraLarge'
  | 'unspecified';
```

### Events

| Function | Signature | Description |
| -------- | --------- | ----------- |
| `addChangeListener` | `(cb: (event) => void) => EventSubscription` | Fires on every system change. Filter by `event.flag`. Call `.remove()` to unsubscribe. |

```ts
type AccessibilityFlag =
  | 'boldText' | 'darkerSystemColors' | 'grayscale' | 'invertColors'
  | 'reduceMotion' | 'reduceTransparency' | 'voiceOver' | 'switchControl'
  | 'monoAudio' | 'closedCaptioning' | 'speakScreen' | 'speakSelection'
  | 'videoAutoplay' | 'onOffSwitchLabels' | 'buttonShapes'
  | 'prefersCrossFadeTransitions' | 'shouldDifferentiateWithoutColor'
  | 'contentSizeCategory';

interface AccessibilityChangeEvent {
  flag: AccessibilityFlag;
  value: boolean | ContentSizeCategory;
}
```

## Comparison with stock `AccessibilityInfo`

React Native's built-in `AccessibilityInfo` (as of RN 0.81) exposes: `isBoldTextEnabled`, `isGrayscaleEnabled`, `isInvertColorsEnabled`, `isReduceMotionEnabled`, `isReduceTransparencyEnabled`, `isScreenReaderEnabled`, `prefersCrossFadeTransitions` (limited), plus `announceForAccessibility`.

**This package adds:** `shouldDifferentiateWithoutColor`, `isDarkerSystemColorsEnabled`, `preferredContentSizeCategory`, `isMonoAudioEnabled`, `isClosedCaptioningEnabled`, `isSpeakScreenEnabled`, `isSpeakSelectionEnabled`, `isSwitchControlRunning`, `isVideoAutoplayEnabled`, `isOnOffSwitchLabelsEnabled`, `buttonShapesEnabled`, plus a unified change event and a `snapshot()` batch reader. All getters are synchronous, so you can consult them during render.

## Requirements

- iOS **14.0+** (some flags gated behind runtime `#available(iOS 13/14, *)` — they return `false` on older devices).
- Expo SDK **54+** (uses Expo Modules API).
- Xcode **15+**.

Non-iOS calls return `false` / `'unspecified'` and never throw.

## How it works

The module is a thin Swift wrapper around Apple's `UIAccessibility` static properties and their matching `NSNotification.Name`s. When JS registers a listener, the module attaches one observer per notification (up to 15 on iOS 14+); each observer emits a single `onChange(flag, value)` event. Sub­scription is torn down when the last JS listener is removed.

`preferredContentSizeCategory` is normalized from `UIContentSizeCategory` to stable camelCase strings so you can `switch` on them in TypeScript without pulling in Swift-side constants.

## Contributing

The `example/` directory contains a minimal Expo app that exercises every API.

```bash
git clone https://github.com/kostyabet/expo-accessibility-plus
cd expo-accessibility-plus
npm install
npm run build
cd example
npm install
npx expo run:ios
```

Pull requests welcome — please add a `CHANGELOG.md` entry. Android support (starting with `isReduceMotionEnabled` and `isBoldTextEnabled`) is on the roadmap.

## Source code

<a href="https://github.com/kostyabet/expo-accessibility-plus">GitHub repo</a>

## License

<a href="https://github.com/kostyabet/expo-accessibility-plus/blob/master/LICENSE">MIT</a>

## Support

Press star on our <a href="https://github.com/kostyabet/expo-accessibility-plus">GitHub repo</a> please!
