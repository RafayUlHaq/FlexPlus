// AttendanceBar.js
// Visual progress bar for attendance or marks percentage.
// Props: percentage (number 0-100), color (optional override)

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../theme';

// Pick bar color based on percentage threshold
function getBarColor(pct) {
  if (pct >= 85) return COLORS.success;
  if (pct >= 75) return COLORS.primary;
  return COLORS.danger;
}

export default function AttendanceBar({ percentage, color }) {
  // Clamp to 0–100 to avoid rendering glitches
  const clamped = Math.min(100, Math.max(0, percentage));
  const barColor = color || getBarColor(clamped);

  return (
    <View style={styles.wrapper}>
      {/* Track */}
      <View style={styles.track}>
        {/* Fill — width is data-driven */}
        <View
          style={[
            styles.fill,
            { width: `${clamped}%`, backgroundColor: barColor },
          ]}
        />
      </View>
      <Text style={[styles.label, { color: barColor }]}>{clamped}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  track: {
    flex: 1,
    height: 7,
    backgroundColor: '#E2E8F0',
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: RADIUS.full,
  },
  label: {
    fontSize: FONTS.xs,
    fontWeight: '700',
    minWidth: 34,
    textAlign: 'right',
    marginLeft: SPACING.sm,
  },
});
