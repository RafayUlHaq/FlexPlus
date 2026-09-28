// theme.js
// Central design tokens — colors, spacing, typography, radius, shadows.
// Import from any component to keep the UI consistent.

export const COLORS = {
  primary:     '#2563EB',
  primaryLight:'#DBEAFE',
  dark:        '#0F172A',
  background:  '#F8FAFC',
  card:        '#FFFFFF',
  success:     '#16A34A',
  warning:     '#F59E0B',
  danger:      '#DC2626',
  textDark:    '#1E293B',
  textMid:     '#475569',
  textMuted:   '#94A3B8',
  border:      '#E2E8F0',
  overlay:     'rgba(15, 23, 42, 0.55)',
};

export const FONTS = {
  xs:  11,
  sm:  13,
  md:  15,
  lg:  18,
  xl:  22,
  xxl: 28,
};

export const SPACING = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  24,
  xxl: 32,
};

export const RADIUS = {
  sm:   6,
  md:   12,
  lg:   16,
  xl:   24,
  full: 999,
};

export const SHADOW = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
};
