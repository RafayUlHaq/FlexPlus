// CourseCard.js
// Tappable card for a single course showing attendance + marks bars.
// Props: course (object), onPress (function)

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../theme';
import AttendanceBar from './AttendanceBar';
import StatusBadge from './StatusBadge';

// Pure function — derives attendance status from percentage
export function getAttendanceStatus(pct) {
  if (pct >= 85) return 'excellent';
  if (pct >= 75) return 'safe';
  if (pct >= 70) return 'warning';
  return 'low';
}

export default function CourseCard({ course, onPress }) {
  // Recalculate percentage from raw counts so UI stays consistent
  const attendancePct = Math.round((course.attended / course.total) * 100);
  const status = getAttendanceStatus(attendancePct);

  return (
    <Pressable
      onPress={() => onPress(course)}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      accessibilityLabel={`Open details for ${course.name}`}
    >
      {/* Top row: code + badge */}
      <View style={styles.topRow}>
        <View style={styles.codeTag}>
          <Text style={styles.codeText}>{course.code}</Text>
        </View>
        <StatusBadge status={status} />
      </View>

      {/* Course name + instructor */}
      <Text style={styles.name}>{course.name}</Text>
      <Text style={styles.instructor}>{course.instructor}</Text>

      {/* Attendance bar */}
      <View style={styles.barSection}>
        <View style={styles.barLabelRow}>
          <Text style={styles.barLabel}>Attendance</Text>
          <Text style={styles.classCount}>
            {course.attended}/{course.total} classes
          </Text>
        </View>
        <AttendanceBar percentage={attendancePct} />
      </View>

      {/* Marks bar */}
      <View style={styles.barSection}>
        <View style={styles.barLabelRow}>
          <Text style={styles.barLabel}>Marks</Text>
        </View>
        <AttendanceBar percentage={course.marks} color={COLORS.primary} />
      </View>

      {/* Tap hint */}
      <Text style={styles.tapHint}>Tap for details →</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOW.md,
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  codeTag: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  codeText: {
    fontSize: FONTS.xs,
    fontWeight: '700',
    color: COLORS.primary,
  },
  name: {
    fontSize: FONTS.md,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 3,
  },
  instructor: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },
  barSection: {
    marginBottom: SPACING.sm,
  },
  barLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  barLabel: {
    fontSize: FONTS.xs,
    color: COLORS.textMid,
    fontWeight: '600',
  },
  classCount: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
  },
  tapHint: {
    fontSize: FONTS.xs,
    color: COLORS.primary,
    textAlign: 'right',
    marginTop: SPACING.xs,
    fontWeight: '600',
  },
});
