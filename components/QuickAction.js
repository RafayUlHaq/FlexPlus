// QuickAction.js
// A single tappable icon+label button used in the Quick Actions grid.
// Props: icon, label, color, onPress

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../theme';

export default function QuickAction({ icon, label, color, onPress }) {
  const accent = color || COLORS.primary;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      accessibilityLabel={label}
    >
      {/* Icon circle — background uses a tint of the accent color */}
      <View style={[styles.iconCircle, { backgroundColor: accent + '18' }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.label} numberOfLines={1}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    width: '18%',        // 5 buttons per row via parent flexWrap
    minWidth: 62,
    ...SHADOW.sm,
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.95 }],
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  icon: {
    fontSize: 20,
  },
  label: {
    fontSize: FONTS.xs,
    color: COLORS.textMid,
    fontWeight: '600',
    textAlign: 'center',
  },
});
