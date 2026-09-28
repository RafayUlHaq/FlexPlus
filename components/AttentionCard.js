// AttentionCard.js
// Displays a single dynamically-generated warning/alert item.
// Props: icon, title, subtitle, type ("danger" | "warning" | "info")

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../theme';

// Data-driven color mapping so we never repeat color logic in JSX
const TYPE_COLORS = {
  danger:  { bg: '#FEF2F2', border: COLORS.danger,  text: COLORS.danger  },
  warning: { bg: '#FFFBEB', border: COLORS.warning, text: COLORS.warning },
  info:    { bg: '#EFF6FF', border: COLORS.primary, text: COLORS.primary },
};

export default function AttentionCard({ icon, title, subtitle, type = 'warning' }) {
  const c = TYPE_COLORS[type] || TYPE_COLORS.warning;

  return (
    <View style={[styles.card, { backgroundColor: c.bg, borderLeftColor: c.border }]}>
      <Text style={styles.icon}>{icon}</Text>
      <View style={styles.textBlock}>
        <Text style={[styles.title, { color: c.text }]}>{title}</Text>
        {/* Conditional rendering — subtitle is optional */}
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: RADIUS.md,
    borderLeftWidth: 4,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOW.sm,
  },
  icon: {
    fontSize: 20,
    marginRight: SPACING.sm,
    marginTop: 1,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontSize: FONTS.sm,
    fontWeight: '700',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: FONTS.xs,
    color: COLORS.textMid,
    lineHeight: 16,
  },
});
