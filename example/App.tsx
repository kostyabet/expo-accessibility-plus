import * as A11y from 'expo-accessibility-plus';
import type {
  AccessibilityChangeEvent,
  AccessibilitySnapshot,
} from 'expo-accessibility-plus';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { Button, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

const FLAG_KEYS: (keyof AccessibilitySnapshot)[] = [
  'boldText',
  'darkerSystemColors',
  'grayscale',
  'invertColors',
  'reduceMotion',
  'reduceTransparency',
  'voiceOver',
  'switchControl',
  'monoAudio',
  'closedCaptioning',
  'speakScreen',
  'speakSelection',
  'videoAutoplay',
  'onOffSwitchLabels',
  'buttonShapes',
  'prefersCrossFadeTransitions',
  'shouldDifferentiateWithoutColor',
  'contentSizeCategory',
];

export default function App() {
  const [snap, setSnap] = useState<AccessibilitySnapshot>(() => A11y.snapshot());
  const [log, setLog] = useState<string[]>([]);

  const append = useCallback((line: string) => {
    setLog((prev) => [`${new Date().toLocaleTimeString()} — ${line}`, ...prev].slice(0, 20));
  }, []);

  useEffect(() => {
    const sub = A11y.addChangeListener((event: AccessibilityChangeEvent) => {
      append(`${event.flag}: ${String(event.value)}`);
      setSnap(A11y.snapshot());
    });
    return () => sub.remove();
  }, [append]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>expo-accessibility-plus</Text>
      <Text style={styles.subtitle}>
        Platform: {Platform.OS} · isAvailable: {String(A11y.isAvailable)}
      </Text>

      <View style={styles.block}>
        <Button title="Refresh snapshot" onPress={() => setSnap(A11y.snapshot())} />
      </View>

      <View style={styles.block}>
        <Text style={styles.label}>Snapshot</Text>
        {FLAG_KEYS.map((key) => (
          <View key={key} style={styles.row}>
            <Text style={styles.key}>{key}</Text>
            <Text style={styles.value}>{String(snap[key])}</Text>
          </View>
        ))}
      </View>

      <View style={styles.block}>
        <Text style={styles.label}>Change log</Text>
        <Text style={styles.mono}>{log.length === 0 ? '—' : log.join('\n')}</Text>
      </View>

      <Text style={styles.hint}>
        Toggle any switch in Settings → Accessibility to see events appear above. Content size
        events fire from Settings → Display &amp; Brightness → Text Size.
      </Text>

      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, gap: 16, backgroundColor: '#fff', paddingTop: 80, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { color: '#666' },
  block: { gap: 8, paddingVertical: 8 },
  label: { fontSize: 14, color: '#333', fontWeight: '600' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  key: { fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }), color: '#111' },
  value: { fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }), color: '#555' },
  mono: { fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }), color: '#111' },
  hint: { color: '#666', fontSize: 13, fontStyle: 'italic' },
});
