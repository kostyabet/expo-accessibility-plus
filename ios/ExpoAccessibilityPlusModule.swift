import ExpoModulesCore
import Foundation
import UIKit

/// All UIAccessibility flags we surface. Keep the string values in sync with
/// the `AccessibilityFlag` union in `src/ExpoAccessibilityPlus.types.ts`.
private enum Flag: String {
  case boldText
  case darkerSystemColors
  case grayscale
  case invertColors
  case reduceMotion
  case reduceTransparency
  case voiceOver
  case switchControl
  case monoAudio
  case closedCaptioning
  case speakScreen
  case speakSelection
  case videoAutoplay
  case onOffSwitchLabels
  case buttonShapes
  case prefersCrossFadeTransitions
  case shouldDifferentiateWithoutColor
  case contentSizeCategory
}

public class ExpoAccessibilityPlusModule: Module {
  private var observers: [NSObjectProtocol] = []

  public func definition() -> ModuleDefinition {
    Name("ExpoAccessibilityPlus")

    Events("onChange")

    // MARK: - Boolean getters (available since iOS 5–13, all safe on iOS 14+)

    Function("isBoldTextEnabled") { UIAccessibility.isBoldTextEnabled }
    Function("isDarkerSystemColorsEnabled") { UIAccessibility.isDarkerSystemColorsEnabled }
    Function("isGrayscaleEnabled") { UIAccessibility.isGrayscaleEnabled }
    Function("isInvertColorsEnabled") { UIAccessibility.isInvertColorsEnabled }
    Function("isReduceMotionEnabled") { UIAccessibility.isReduceMotionEnabled }
    Function("isReduceTransparencyEnabled") { UIAccessibility.isReduceTransparencyEnabled }
    Function("isVoiceOverRunning") { UIAccessibility.isVoiceOverRunning }
    Function("isSwitchControlRunning") { UIAccessibility.isSwitchControlRunning }
    Function("isMonoAudioEnabled") { UIAccessibility.isMonoAudioEnabled }
    Function("isClosedCaptioningEnabled") { UIAccessibility.isClosedCaptioningEnabled }
    Function("isSpeakScreenEnabled") { UIAccessibility.isSpeakScreenEnabled }
    Function("isSpeakSelectionEnabled") { UIAccessibility.isSpeakSelectionEnabled }

    // iOS 13+
    Function("isVideoAutoplayEnabled") {
      if #available(iOS 13.0, *) { return UIAccessibility.isVideoAutoplayEnabled }
      return false
    }
    Function("isOnOffSwitchLabelsEnabled") {
      if #available(iOS 13.0, *) { return UIAccessibility.isOnOffSwitchLabelsEnabled }
      return false
    }
    Function("shouldDifferentiateWithoutColor") {
      if #available(iOS 13.0, *) { return UIAccessibility.shouldDifferentiateWithoutColor }
      return false
    }

    // iOS 14+
    Function("buttonShapesEnabled") {
      if #available(iOS 14.0, *) { return UIAccessibility.buttonShapesEnabled }
      return false
    }
    Function("prefersCrossFadeTransitions") {
      if #available(iOS 14.0, *) { return UIAccessibility.prefersCrossFadeTransitions }
      return false
    }

    // MARK: - Enum-like getters

    Function("preferredContentSizeCategory") { self.currentContentSizeCategory() }

    // MARK: - Snapshot

    Function("snapshot") { self.snapshot() as [String: Any] }

    // MARK: - Event subscription

    OnStartObserving {
      self.attachObservers()
    }

    OnStopObserving {
      self.detachObservers()
    }

    OnDestroy {
      self.detachObservers()
    }
  }

  // MARK: - Observer plumbing

  private func attachObservers() {
    detachObservers()
    let nc = NotificationCenter.default

    func observe(_ name: NSNotification.Name, flag: Flag, value: @escaping () -> Any) {
      let token = nc.addObserver(forName: name, object: nil, queue: .main) { [weak self] _ in
        self?.emit(flag: flag, value: value())
      }
      observers.append(token)
    }

    observe(UIAccessibility.boldTextStatusDidChangeNotification, flag: .boldText) {
      UIAccessibility.isBoldTextEnabled
    }
    observe(UIAccessibility.darkerSystemColorsStatusDidChangeNotification, flag: .darkerSystemColors) {
      UIAccessibility.isDarkerSystemColorsEnabled
    }
    observe(UIAccessibility.grayscaleStatusDidChangeNotification, flag: .grayscale) {
      UIAccessibility.isGrayscaleEnabled
    }
    observe(UIAccessibility.invertColorsStatusDidChangeNotification, flag: .invertColors) {
      UIAccessibility.isInvertColorsEnabled
    }
    observe(UIAccessibility.reduceMotionStatusDidChangeNotification, flag: .reduceMotion) {
      UIAccessibility.isReduceMotionEnabled
    }
    observe(UIAccessibility.reduceTransparencyStatusDidChangeNotification, flag: .reduceTransparency) {
      UIAccessibility.isReduceTransparencyEnabled
    }
    observe(UIAccessibility.voiceOverStatusDidChangeNotification, flag: .voiceOver) {
      UIAccessibility.isVoiceOverRunning
    }
    observe(UIAccessibility.switchControlStatusDidChangeNotification, flag: .switchControl) {
      UIAccessibility.isSwitchControlRunning
    }
    observe(UIAccessibility.monoAudioStatusDidChangeNotification, flag: .monoAudio) {
      UIAccessibility.isMonoAudioEnabled
    }
    observe(UIAccessibility.closedCaptioningStatusDidChangeNotification, flag: .closedCaptioning) {
      UIAccessibility.isClosedCaptioningEnabled
    }
    observe(UIAccessibility.speakScreenStatusDidChangeNotification, flag: .speakScreen) {
      UIAccessibility.isSpeakScreenEnabled
    }
    observe(UIAccessibility.speakSelectionStatusDidChangeNotification, flag: .speakSelection) {
      UIAccessibility.isSpeakSelectionEnabled
    }
    observe(UIContentSizeCategory.didChangeNotification, flag: .contentSizeCategory) { [weak self] in
      self?.currentContentSizeCategory() ?? "unspecified"
    }

    if #available(iOS 13.0, *) {
      observe(UIAccessibility.videoAutoplayStatusDidChangeNotification, flag: .videoAutoplay) {
        UIAccessibility.isVideoAutoplayEnabled
      }
      observe(UIAccessibility.onOffSwitchLabelsDidChangeNotification, flag: .onOffSwitchLabels) {
        UIAccessibility.isOnOffSwitchLabelsEnabled
      }
      observe(UIAccessibility.differentiateWithoutColorDidChangeNotification, flag: .shouldDifferentiateWithoutColor) {
        UIAccessibility.shouldDifferentiateWithoutColor
      }
    }

    if #available(iOS 14.0, *) {
      observe(UIAccessibility.buttonShapesEnabledStatusDidChangeNotification, flag: .buttonShapes) {
        UIAccessibility.buttonShapesEnabled
      }
      observe(UIAccessibility.prefersCrossFadeTransitionsStatusDidChange, flag: .prefersCrossFadeTransitions) {
        UIAccessibility.prefersCrossFadeTransitions
      }
    }
  }

  private func detachObservers() {
    let nc = NotificationCenter.default
    observers.forEach { nc.removeObserver($0) }
    observers.removeAll()
  }

  private func emit(flag: Flag, value: Any) {
    sendEvent("onChange", [
      "flag": flag.rawValue,
      "value": value,
    ])
  }

  // MARK: - Content size category mapping

  private func currentContentSizeCategory() -> String {
    let raw = UIApplication.shared.preferredContentSizeCategory
    switch raw {
    case .extraSmall: return "extraSmall"
    case .small: return "small"
    case .medium: return "medium"
    case .large: return "large"
    case .extraLarge: return "extraLarge"
    case .extraExtraLarge: return "extraExtraLarge"
    case .extraExtraExtraLarge: return "extraExtraExtraLarge"
    case .accessibilityMedium: return "accessibilityMedium"
    case .accessibilityLarge: return "accessibilityLarge"
    case .accessibilityExtraLarge: return "accessibilityExtraLarge"
    case .accessibilityExtraExtraLarge: return "accessibilityExtraExtraLarge"
    case .accessibilityExtraExtraExtraLarge: return "accessibilityExtraExtraExtraLarge"
    default: return "unspecified"
    }
  }

  // MARK: - Snapshot builder

  private func snapshot() -> [String: Any] {
    var out: [String: Any] = [
      "boldText": UIAccessibility.isBoldTextEnabled,
      "darkerSystemColors": UIAccessibility.isDarkerSystemColorsEnabled,
      "grayscale": UIAccessibility.isGrayscaleEnabled,
      "invertColors": UIAccessibility.isInvertColorsEnabled,
      "reduceMotion": UIAccessibility.isReduceMotionEnabled,
      "reduceTransparency": UIAccessibility.isReduceTransparencyEnabled,
      "voiceOver": UIAccessibility.isVoiceOverRunning,
      "switchControl": UIAccessibility.isSwitchControlRunning,
      "monoAudio": UIAccessibility.isMonoAudioEnabled,
      "closedCaptioning": UIAccessibility.isClosedCaptioningEnabled,
      "speakScreen": UIAccessibility.isSpeakScreenEnabled,
      "speakSelection": UIAccessibility.isSpeakSelectionEnabled,
      "contentSizeCategory": self.currentContentSizeCategory(),
    ]

    if #available(iOS 13.0, *) {
      out["videoAutoplay"] = UIAccessibility.isVideoAutoplayEnabled
      out["onOffSwitchLabels"] = UIAccessibility.isOnOffSwitchLabelsEnabled
      out["shouldDifferentiateWithoutColor"] = UIAccessibility.shouldDifferentiateWithoutColor
    } else {
      out["videoAutoplay"] = false
      out["onOffSwitchLabels"] = false
      out["shouldDifferentiateWithoutColor"] = false
    }

    if #available(iOS 14.0, *) {
      out["buttonShapes"] = UIAccessibility.buttonShapesEnabled
      out["prefersCrossFadeTransitions"] = UIAccessibility.prefersCrossFadeTransitions
    } else {
      out["buttonShapes"] = false
      out["prefersCrossFadeTransitions"] = false
    }

    return out
  }
}
