// EmptyState.js
// Shown when a list/section has no items to display.
// Props: icon, title, subtitle

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../theme';

export default function EmptyState({ icon = '📭', title, subtitle }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      {/* Conditional rendering — subtitle is optional */}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOW.sm,
  },
  icon: {
    fontSize: 36,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: FONTS.md,
    fontWeight: '600',
    color: COLORS.textDark,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: FONTS.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
