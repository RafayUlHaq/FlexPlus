// SummaryCard.js
// A single metric card used in the Quick Academic Summary row.
// Props: icon, label, value, color (optional accent)

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../theme';

export default function SummaryCard({ icon, label, value, color }) {
  const accent = color || COLORS.primary;

  return (
    <View style={[styles.card, { borderTopColor: accent }]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.value, { color: accent }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    borderTopWidth: 3,
    marginHorizontal: SPACING.xs,
    ...SHADOW.sm,
  },
  icon: {
    fontSize: 22,
    marginBottom: 4,
  },
  value: {
    fontSize: FONTS.lg,
    fontWeight: '700',
    marginBottom: 2,
  },
  label: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
