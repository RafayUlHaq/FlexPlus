// ProfileModal.js
// Simple student profile info modal.
// Props: visible, student, onClose

import React from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../theme';

export default function ProfileModal({ visible, student, onClose }) {
  if (!student) return null;

  // Build initials for large avatar
  const initials = student.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('');

  // Profile fields as an array — rendered with .map() for DRY JSX
  const fields = [
    { label: 'Student ID',  value: student.id },
    { label: 'Program',     value: student.program },
    { label: 'Semester',    value: `Semester ${student.semester}` },
    { label: 'Department',  value: student.department },
    { label: 'Batch',       value: student.batch },
    { label: 'Email',       value: student.email },
  ];

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      {/* Overlay */}
      <Pressable style={styles.overlay} onPress={onClose}>
        {/* Card — stop propagation so tapping card doesn't close */}
        <Pressable style={styles.card} onPress={() => {}}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Avatar */}
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>

          <Text style={styles.name}>{student.name}</Text>
          <Text style={styles.cgpa}>CGPA: {student.cgpa}</Text>

          {/* Fields list — data-driven via .map() */}
          <View style={styles.fieldsContainer}>
            {fields.map((f) => (
              <View key={f.label} style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>{f.label}</Text>
                <Text style={styles.fieldValue}>{f.value}</Text>
              </View>
            ))}
          </View>

          <Pressable
            style={({ pressed }) => [styles.closeBtn, pressed && styles.closeBtnPressed]}
            onPress={onClose}
            accessibilityLabel="Close profile"
          >
            <Text style={styles.closeBtnText}>Close</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    width: '100%',
    alignItems: 'center',
    ...SHADOW.md,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.lg,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  avatarText: {
    fontSize: FONTS.xl,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  name: {
    fontSize: FONTS.lg,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 4,
    textAlign: 'center',
  },
  cgpa: {
    fontSize: FONTS.sm,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: SPACING.lg,
  },
  fieldsContainer: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  fieldLabel: {
    fontSize: FONTS.sm,
    color: COLORS.textMuted,
    flex: 1,
  },
  fieldValue: {
    fontSize: FONTS.sm,
    color: COLORS.textDark,
    fontWeight: '600',
    flex: 1.5,
    textAlign: 'right',
  },
  closeBtn: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.full,
  },
  closeBtnPressed: {
    opacity: 0.75,
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: FONTS.md,
  },
});
