// AnnouncementCard.js
// Tappable announcement that expands to show full description (no modal needed).
// Props: announcement (object)

import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../theme';

// Data-driven type → accent color
const TYPE_COLOR = {
  academic: COLORS.primary,
  fee:      COLORS.danger,
  general:  COLORS.textMid,
  event:    COLORS.success,
};

const TYPE_BG = {
  academic: COLORS.primaryLight,
  fee:      '#FEE2E2',
  general:  '#F1F5F9',
  event:    '#DCFCE7',
};

export default function AnnouncementCard({ announcement }) {
  // Local state — each card manages its own expanded state
  const [expanded, setExpanded] = useState(false);
  const { icon, title, description, date, type } = announcement;
  const accentColor = TYPE_COLOR[type] || COLORS.textMid;
  const bgColor     = TYPE_BG[type]    || '#F1F5F9';

  return (
    <Pressable
      onPress={() => setExpanded((prev) => !prev)}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      accessibilityLabel={`${expanded ? 'Collapse' : 'Expand'} announcement: ${title}`}
    >
      {/* Header row */}
      <View style={styles.topRow}>
        {/* Type tag */}
        <View style={[styles.typeTag, { backgroundColor: bgColor }]}>
          <Text style={[styles.typeText, { color: accentColor }]}>
            {icon} {type.charAt(0).toUpperCase() + type.slice(1)}
          </Text>
        </View>
        <Text style={styles.date}>{date}</Text>
      </View>

      <Text style={styles.title}>{title}</Text>

      {/* Conditional rendering — only show description when expanded */}
      {expanded ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}

      <Text style={[styles.expandHint, { color: accentColor }]}>
        {expanded ? 'Show less ▲' : 'Read more ▼'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOW.sm,
  },
  cardPressed: {
    opacity: 0.85,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  typeTag: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  typeText: {
    fontSize: FONTS.xs,
    fontWeight: '700',
  },
  date: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
  },
  title: {
    fontSize: FONTS.sm,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: SPACING.xs,
    lineHeight: 20,
  },
  description: {
    fontSize: FONTS.sm,
    color: COLORS.textMid,
    lineHeight: 20,
    marginBottom: SPACING.sm,
  },
  expandHint: {
    fontSize: FONTS.xs,
    fontWeight: '600',
    marginTop: 4,
  },
});
