# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.1] — 2026-07-10

### Changed
- Added a hero illustration to the README.

## [0.1.0] — 2026-07-10

### Added
- Initial release.
- Synchronous getters for every `UIAccessibility` flag: `isBoldTextEnabled`, `isDarkerSystemColorsEnabled`, `isGrayscaleEnabled`, `isInvertColorsEnabled`, `isReduceMotionEnabled`, `isReduceTransparencyEnabled`, `isVoiceOverRunning`, `isSwitchControlRunning`, `isMonoAudioEnabled`, `isClosedCaptioningEnabled`, `isSpeakScreenEnabled`, `isSpeakSelectionEnabled`, `isVideoAutoplayEnabled`, `isOnOffSwitchLabelsEnabled`, `buttonShapesEnabled`, `prefersCrossFadeTransitions`, `shouldDifferentiateWithoutColor`.
- `preferredContentSizeCategory()` — Dynamic Type step as a typed string.
- `snapshot()` — batch reader for all flags in one native round-trip.
- Unified `addChangeListener` event with `{ flag, value }` payload.
- `isAvailable` — boolean flag for platform gating.

[Unreleased]: https://github.com/kostyabet/expo-accessibility-plus/compare/v0.1.1...HEAD
[0.1.1]: https://github.com/kostyabet/expo-accessibility-plus/releases/tag/v0.1.1
[0.1.0]: https://github.com/kostyabet/expo-accessibility-plus/releases/tag/v0.1.0
