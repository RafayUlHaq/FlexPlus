// AssignmentCard.js
// Displays a single upcoming assignment with priority indicator.
// Props: assignment (object)

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../theme';
import StatusBadge from './StatusBadge';

// Map priority → left border accent color
const PRIORITY_COLOR = {
  high:   COLORS.danger,
  medium: COLORS.warning,
  low:    COLORS.success,
};

// Map priority → emoji
const PRIORITY_ICON = {
  high:   '🔴',
  medium: '🟡',
  low:    '🟢',
};

export default function AssignmentCard({ assignment }) {
  const { course, title, dueDate, priority } = assignment;
  const accentColor = PRIORITY_COLOR[priority] || COLORS.textMuted;

  return (
    <View style={[styles.card, { borderLeftColor: accentColor }]}>
      {/* Priority dot + due date row */}
      <View style={styles.topRow}>
        <Text style={styles.priorityIcon}>{PRIORITY_ICON[priority]}</Text>
        <Text style={styles.dueDate}>Due: {dueDate}</Text>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.course}>{course}</Text>

      <View style={styles.bottomRow}>
        <StatusBadge status={priority} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderLeftWidth: 4,
    ...SHADOW.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  priorityIcon: {
    fontSize: 14,
  },
  dueDate: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  title: {
    fontSize: FONTS.sm,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 3,
  },
  course: {
    fontSize: FONTS.xs,
    color: COLORS.textMid,
    marginBottom: SPACING.sm,
  },
  bottomRow: {
    flexDirection: 'row',
  },
});
