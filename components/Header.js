// Header.js
// Displays greeting, student info, and a profile button.
// Props: student, onProfilePress

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../theme';

export default function Header({ student, onProfilePress }) {
  // Determine greeting based on hour of day
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Build initials for the avatar (e.g. "Rafay Ul Haq" → "RU")
  const initials = student.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('');

  return (
    <View style={styles.container}>
      {/* Left: greeting + programme info */}
      <View style={styles.textBlock}>
        <Text style={styles.greeting}>
          {greeting}, {student.firstName} 👋
        </Text>
        <Text style={styles.programme}>{student.program}</Text>
        <Text style={styles.semester}>Semester {student.semester}</Text>
      </View>

      {/* Right: avatar / profile button */}
      <Pressable
        onPress={onProfilePress}
        style={({ pressed }) => [styles.avatar, pressed && styles.avatarPressed]}
        accessibilityLabel="Open profile"
      >
        <Text style={styles.avatarText}>{initials}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xl,
    borderBottomLeftRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
  },
  textBlock: {
    flex: 1,
  },
  greeting: {
    fontSize: FONTS.xl,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  programme: {
    fontSize: FONTS.sm,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 2,
  },
  semester: {
    fontSize: FONTS.xs,
    color: 'rgba(255,255,255,0.65)',
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarPressed: {
    opacity: 0.7,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: FONTS.md,
  },
});
