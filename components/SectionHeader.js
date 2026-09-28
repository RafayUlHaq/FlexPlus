// SectionHeader.js
// Consistent section title + optional right-side label/button.
// Props: title, rightLabel, onRightPress

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING } from '../theme';

export default function SectionHeader({ title, rightLabel, onRightPress }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {/* Conditional rendering — only show right element if provided */}
      {rightLabel ? (
        <Pressable onPress={onRightPress}>
          <Text style={styles.rightLabel}>{rightLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: FONTS.md,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  rightLabel: {
    fontSize: FONTS.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
});
