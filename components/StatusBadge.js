// StatusBadge.js
// Coloured pill badge that reflects attendance/priority status.
// Props: status ("excellent" | "safe" | "warning" | "low")
//        or priority ("high" | "medium" | "low")

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../theme';

// Map status strings to color pairs  ← data-driven pattern
const STATUS_CONFIG = {
  excellent: { bg: '#DCFCE7', text: COLORS.success, label: 'Excellent' },
  safe:      { bg: '#DBEAFE', text: COLORS.primary, label: 'Safe' },
  warning:   { bg: '#FEF3C7', text: COLORS.warning, label: 'Warning' },
  low:       { bg: '#FEE2E2', text: COLORS.danger,  label: 'Low' },
  high:      { bg: '#FEE2E2', text: COLORS.danger,  label: 'High' },
  medium:    { bg: '#FEF3C7', text: COLORS.warning, label: 'Medium' },
};

export default function StatusBadge({ status }) {
  // Fallback to a neutral style if an unknown status is passed
  const config = STATUS_CONFIG[status] || {
    bg: '#F1F5F9',
    text: COLORS.textMuted,
    label: status,
  };

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.text, { color: config.text }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  text: {
    fontSize: FONTS.xs,
    fontWeight: '700',
  },
});
