// CourseDetailsModal.js
// Full-detail modal for a selected course.
// Shows attendance stats, marks, upcoming assignment.
// Allows "Mark Attended" and "Mark Missed" — updates state via onUpdate callback.
// Props: visible, course, onClose, onUpdate

import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../theme';
import AttendanceBar from './AttendanceBar';
import StatusBadge from './StatusBadge';
import { getAttendanceStatus } from './CourseCard';

export default function CourseDetailsModal({ visible, course, onClose, onUpdate }) {
  // Local copy of mutable stats so UI updates instantly before propagating up
  const [attended, setAttended]   = useState(0);
  const [total, setTotal]         = useState(0);
  const [feedback, setFeedback]   = useState('');

  // Sync local state whenever a different course is selected
  useEffect(() => {
    if (course) {
      setAttended(course.attended);
      setTotal(course.total);
      setFeedback('');
    }
  }, [course]);

  if (!course) return null;

  // Recalculate percentage from raw counts (demonstrates arithmetic logic)
  const pct    = total > 0 ? Math.round((attended / total) * 100) : 0;
  const missed = total - attended;
  const status = getAttendanceStatus(pct);

  // ── Handlers ────────────────────────────────────────────────

  // Mark next class as attended: increases both attended and total
  const handleMarkAttended = () => {
    const newAttended = attended + 1;
    const newTotal    = total + 1;
    setAttended(newAttended);
    setTotal(newTotal);
    const newPct = Math.round((newAttended / newTotal) * 100);
    setFeedback(`✅ Class marked attended! Attendance now ${newPct}%`);
    // Propagate updated course data to parent (App.js)
    onUpdate({ ...course, attended: newAttended, total: newTotal });
  };

  // Mark next class as missed: increases total only
  const handleMarkMissed = () => {
    const newTotal = total + 1;
    setTotal(newTotal);
    const newPct = Math.round((attended / newTotal) * 100);
    setFeedback(`⚠️ Class marked missed. Attendance now ${newPct}%`);
    onUpdate({ ...course, attended, total: newTotal });
  };

  // Confirmation before marking missed if already at risk
  const confirmMarkMissed = () => {
    if (pct < 75) {
      Alert.alert(
        'Low Attendance Warning',
        `Your attendance is already ${pct}%. Missing another class may further affect your eligibility. Continue?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Mark Missed', style: 'destructive', onPress: handleMarkMissed },
        ]
      );
    } else {
      handleMarkMissed();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* ── Handle bar ── */}
        <View style={styles.handle} />

        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.codeTag}>
              <Text style={styles.codeText}>{course.code}</Text>
            </View>
            <StatusBadge status={status} />
          </View>
          <Pressable onPress={onClose} style={styles.closeBtn} accessibilityLabel="Close modal">
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
          {/* Course title */}
          <Text style={styles.courseName}>{course.name}</Text>
          <Text style={styles.instructor}>👨‍🏫 {course.instructor}</Text>
          <Text style={styles.credits}>📚 {course.creditHours} Credit Hours</Text>

          {/* ── Attendance stats ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Attendance</Text>
            <AttendanceBar percentage={pct} />

            {/* Stat row — demonstrates object destructuring in rendering */}
            <View style={styles.statRow}>
              {[
                { label: 'Total Classes', value: total,    color: COLORS.textDark },
                { label: 'Attended',      value: attended, color: COLORS.success  },
                { label: 'Missed',        value: missed,   color: COLORS.danger   },
              ].map((stat) => (
                <View key={stat.label} style={styles.statBox}>
                  <Text style={[styles.statValue, { color: stat.color }]}>
                    {stat.value}
                  </Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* ── Marks ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Current Marks</Text>
            <AttendanceBar percentage={course.marks} color={COLORS.primary} />
            <Text style={styles.marksDetail}>{course.marks}/100</Text>
          </View>

          {/* ── Upcoming assignment ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upcoming Assignment</Text>
            <View style={styles.assignmentBox}>
              <Text style={styles.assignmentTitle}>{course.upcomingAssignment}</Text>
              <Text style={styles.assignmentDeadline}>
                🗓 Due: {course.assignmentDeadline}
              </Text>
            </View>
          </View>

          {/* ── Feedback message — conditional rendering ── */}
          {feedback ? (
            <View style={styles.feedbackBox}>
              <Text style={styles.feedbackText}>{feedback}</Text>
            </View>
          ) : null}

          {/* ── Action buttons ── */}
          <View style={styles.buttonRow}>
            <Pressable
              style={({ pressed }) => [
                styles.btnAttended,
                pressed && styles.btnPressed,
              ]}
              onPress={handleMarkAttended}
              accessibilityLabel="Mark next class as attended"
            >
              <Text style={styles.btnAttendedText}>✅ Mark Attended</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.btnMissed,
                pressed && styles.btnPressed,
              ]}
              onPress={confirmMarkMissed}
              accessibilityLabel="Mark next class as missed"
            >
              <Text style={styles.btnMissedText}>❌ Mark Missed</Text>
            </Pressable>
          </View>

          <View style={{ height: SPACING.xxl }} />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.full,
    alignSelf: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeTag: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    marginRight: SPACING.sm,
  },
  codeText: {
    fontSize: FONTS.sm,
    fontWeight: '700',
    color: COLORS.primary,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: FONTS.sm,
    color: COLORS.textMid,
    fontWeight: '700',
  },
  scroll: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  courseName: {
    fontSize: FONTS.xl,
    fontWeight: '700',
    color: COLORS.textDark,
    marginTop: SPACING.lg,
    marginBottom: 6,
  },
  instructor: {
    fontSize: FONTS.sm,
    color: COLORS.textMid,
    marginBottom: 4,
  },
  credits: {
    fontSize: FONTS.sm,
    color: COLORS.textMid,
    marginBottom: SPACING.lg,
  },
  section: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOW.sm,
  },
  sectionTitle: {
    fontSize: FONTS.sm,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: SPACING.sm,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SPACING.md,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONTS.xl,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  marksDetail: {
    fontSize: FONTS.sm,
    color: COLORS.textMid,
    marginTop: SPACING.xs,
    textAlign: 'right',
  },
  assignmentBox: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
  },
  assignmentTitle: {
    fontSize: FONTS.sm,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 4,
  },
  assignmentDeadline: {
    fontSize: FONTS.xs,
    color: COLORS.textMid,
  },
  feedbackBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.success,
  },
  feedbackText: {
    fontSize: FONTS.sm,
    color: COLORS.success,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
  },
  btnAttended: {
    flex: 1,
    backgroundColor: COLORS.success,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  btnMissed: {
    flex: 1,
    backgroundColor: '#FEE2E2',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  btnPressed: {
    opacity: 0.75,
  },
  btnAttendedText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: FONTS.sm,
  },
  btnMissedText: {
    color: COLORS.danger,
    fontWeight: '700',
    fontSize: FONTS.sm,
  },
});
