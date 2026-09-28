// AnalyticsSection.js
// Mandatory assignment section — contains Bar Chart and Line Chart
// using react-native-chart-kit, plus a GPA Performance Calculator.
//
// Props:
//   courses          — array of course objects (live state from App.js)
//   attendanceTrend  — { labels: [...], data: [...] }

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
// react-native-svg is a required peer dependency of react-native-chart-kit.
// It does not need a direct import here — the library handles it internally.
// Make sure it is listed in package.json dependencies.
import { BarChart, LineChart } from 'react-native-chart-kit';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../theme';
import SectionHeader from './SectionHeader';

const SCREEN_WIDTH = Dimensions.get('window').width;
// Chart width = screen width minus two lg paddings on each side
const CHART_WIDTH  = SCREEN_WIDTH - SPACING.lg * 2;

// Shared chart config — kept here so both charts stay consistent
const chartConfig = {
  backgroundGradientFrom: COLORS.card,
  backgroundGradientTo:   COLORS.card,
  color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,   // COLORS.primary
  labelColor: (opacity = 1) => `rgba(71, 85, 105, ${opacity})`, // COLORS.textMid
  strokeWidth: 2,
  barPercentage: 0.6,
  useShadowColorFromDataset: false,
  decimalPlaces: 0,
  propsForDots: {
    r: '5',
    strokeWidth: '2',
    stroke: COLORS.primary,
  },
};

// ── Pure helper: calculate average from a courses array ──────
// Uses .reduce() — highlighted for viva
export function calculateAverage(courses) {
  if (!courses.length) return 0;
  const total = courses.reduce((sum, c) => sum + c.marks, 0);
  return (total / courses.length).toFixed(1);
}

export default function AnalyticsSection({ courses, attendanceTrend }) {
  // ── Performance Calculator state ────────────────────────────
  // localMarks mirrors course marks for the editable inputs
  const [localMarks, setLocalMarks] = useState(
    () => courses.reduce((acc, c) => ({ ...acc, [c.id]: String(c.marks) }), {})
  );
  const [validationError, setValidationError] = useState('');

  // useMemo — only recalculates when localMarks changes
  const calculatedAverage = useMemo(() => {
    const values = Object.values(localMarks).map(Number);
    if (values.some(isNaN)) return null;
    const total = values.reduce((sum, v) => sum + v, 0);
    return (total / values.length).toFixed(1);
  }, [localMarks]);

  // Handle marks input change with validation
  const handleMarksChange = (courseId, text) => {
    setValidationError('');
    // Allow empty string while typing
    if (text === '') {
      setLocalMarks((prev) => ({ ...prev, [courseId]: '' }));
      return;
    }
    const num = Number(text);
    if (isNaN(num)) {
      setValidationError('Marks must be a number.');
      return;
    }
    if (num < 0 || num > 100) {
      setValidationError('Marks must be between 0 and 100.');
      return;
    }
    setLocalMarks((prev) => ({ ...prev, [courseId]: text }));
  };

  // Reset inputs back to live course data
  const handleReset = () => {
    setLocalMarks(courses.reduce((acc, c) => ({ ...acc, [c.id]: String(c.marks) }), {}));
    setValidationError('');
  };

  // ── Bar Chart data — derived from courses via .map() ────────
  const barData = {
    labels: courses.map((c) => c.code.split('-')[1] || c.code), // short label
    datasets: [{ data: courses.map((c) => c.marks) }],
  };

  // ── Line Chart data — from attendanceTrend prop ──────────────
  const lineData = {
    labels: attendanceTrend.labels,
    datasets: [{ data: attendanceTrend.data, color: (opacity = 1) => `rgba(37,99,235,${opacity})` }],
  };

  // ── Pie-style summary (manual, no PieChart lib needed) ──────
  // Uses .filter() to count courses by attendance status
  const excellent = courses.filter((c) => Math.round((c.attended / c.total) * 100) >= 85).length;
  const safe      = courses.filter((c) => {
    const p = Math.round((c.attended / c.total) * 100);
    return p >= 75 && p < 85;
  }).length;
  const low       = courses.filter((c) => Math.round((c.attended / c.total) * 100) < 75).length;

  return (
    <View>
      {/* ══════════════════════════════════════════════
          CHART 1 — Bar Chart: Course Performance
      ══════════════════════════════════════════════ */}
      <View style={styles.chartCard}>
        <SectionHeader title="📊 Course Performance" />
        <Text style={styles.chartSubtitle}>Marks per course (out of 100)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <BarChart
            data={barData}
            width={Math.max(CHART_WIDTH, courses.length * 70)}
            height={200}
            chartConfig={chartConfig}
            fromZero
            showValuesOnTopOfBars
            style={styles.chart}
            yAxisSuffix=""
            yAxisLabel=""
            withInnerLines={false}
          />
        </ScrollView>

        {/* Legend: course name → marks */}
        <View style={styles.legendContainer}>
          {courses.map((c) => (
            <View key={c.id} style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
              <Text style={styles.legendText} numberOfLines={1}>
                {c.code} — {c.marks}/100
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* ══════════════════════════════════════════════
          CHART 2 — Line Chart: Attendance Trend
      ══════════════════════════════════════════════ */}
      <View style={styles.chartCard}>
        <SectionHeader title="📈 Attendance Trend" />
        <Text style={styles.chartSubtitle}>Weekly attendance percentage</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <LineChart
            data={lineData}
            width={Math.max(CHART_WIDTH, attendanceTrend.labels.length * 70)}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            yAxisSuffix="%"
            yAxisLabel=""
            fromZero={false}
          />
        </ScrollView>
      </View>

      {/* ══════════════════════════════════════════════
          ATTENDANCE STATUS SUMMARY (visual "pie" alternative)
      ══════════════════════════════════════════════ */}
      <View style={styles.chartCard}>
        <SectionHeader title="🎓 Attendance Status" />
        <Text style={styles.chartSubtitle}>Course breakdown by attendance health</Text>
        <View style={styles.statusRow}>
          {[
            { label: 'Excellent', count: excellent, color: COLORS.success },
            { label: 'Safe',      count: safe,      color: COLORS.primary },
            { label: 'Low',       count: low,        color: COLORS.danger  },
          ].map((item) => (
            <View key={item.label} style={styles.statusBox}>
              <View style={[styles.statusCircle, { borderColor: item.color }]}>
                <Text style={[styles.statusCount, { color: item.color }]}>
                  {item.count}
                </Text>
              </View>
              <Text style={styles.statusLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Visual bar representation */}
        <View style={styles.compositeBar}>
          {excellent > 0 && (
            <View
              style={[
                styles.compositeSegment,
                { flex: excellent, backgroundColor: COLORS.success },
              ]}
            />
          )}
          {safe > 0 && (
            <View
              style={[
                styles.compositeSegment,
                { flex: safe, backgroundColor: COLORS.primary },
              ]}
            />
          )}
          {low > 0 && (
            <View
              style={[
                styles.compositeSegment,
                { flex: low, backgroundColor: COLORS.danger },
              ]}
            />
          )}
        </View>
        <Text style={styles.compositeLabel}>
          {courses.length} total courses
        </Text>
      </View>

      {/* ══════════════════════════════════════════════
          GPA / PERFORMANCE CALCULATOR
          Demonstrates: controlled TextInput, validation,
          useMemo, .reduce(), .map()
      ══════════════════════════════════════════════ */}
      <View style={styles.chartCard}>
        <SectionHeader title="🧮 Performance Calculator" />
        <Text style={styles.chartSubtitle}>
          Edit marks to simulate your semester average
        </Text>

        {/* Controlled inputs — one per course */}
        {courses.map((course) => (
          <View key={course.id} style={styles.calcRow}>
            <Text style={styles.calcLabel} numberOfLines={1}>
              {course.code}
            </Text>
            <TextInput
              style={styles.calcInput}
              value={localMarks[course.id] !== undefined ? localMarks[course.id] : String(course.marks)}
              onChangeText={(text) => handleMarksChange(course.id, text)}
              keyboardType="numeric"
              maxLength={3}
              accessibilityLabel={`Enter marks for ${course.name}`}
              returnKeyType="done"
            />
            <Text style={styles.calcOutOf}>/100</Text>
          </View>
        ))}

        {/* Validation error — conditional rendering */}
        {validationError ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {validationError}</Text>
          </View>
        ) : null}

        {/* Result */}
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>Calculated Average</Text>
          <Text style={styles.resultValue}>
            {calculatedAverage !== null ? `${calculatedAverage}%` : '—'}
          </Text>
        </View>

        {/* Grade indicator */}
        {calculatedAverage !== null && (
          <View style={[styles.gradeBox, { backgroundColor: getGradeColor(Number(calculatedAverage)) + '18' }]}>
            <Text style={[styles.gradeText, { color: getGradeColor(Number(calculatedAverage)) }]}>
              Grade: {getGrade(Number(calculatedAverage))}
            </Text>
          </View>
        )}

        <Pressable
          style={({ pressed }) => [styles.resetBtn, pressed && styles.resetBtnPressed]}
          onPress={handleReset}
          accessibilityLabel="Reset marks to original values"
        >
          <Text style={styles.resetBtnText}>↺ Reset to Actual Marks</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ── Grade helpers ────────────────────────────────────────────
function getGrade(avg) {
  if (avg >= 90) return 'A+';
  if (avg >= 85) return 'A';
  if (avg >= 80) return 'B+';
  if (avg >= 75) return 'B';
  if (avg >= 70) return 'C+';
  if (avg >= 65) return 'C';
  if (avg >= 60) return 'D';
  return 'F';
}

function getGradeColor(avg) {
  if (avg >= 80) return COLORS.success;
  if (avg >= 65) return COLORS.warning;
  return COLORS.danger;
}

// ── Styles ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  chartCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOW.md,
  },
  chartSubtitle: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },
  chart: {
    borderRadius: RADIUS.md,
    marginLeft: -SPACING.sm,
  },
  legendContainer: {
    marginTop: SPACING.sm,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    fontSize: FONTS.xs,
    color: COLORS.textMid,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: SPACING.md,
  },
  statusBox: {
    alignItems: 'center',
  },
  statusCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  statusCount: {
    fontSize: FONTS.xl,
    fontWeight: '700',
  },
  statusLabel: {
    fontSize: FONTS.xs,
    color: COLORS.textMid,
    fontWeight: '600',
  },
  compositeBar: {
    flexDirection: 'row',
    height: 12,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    marginTop: SPACING.sm,
    marginBottom: 4,
  },
  compositeSegment: {
    borderRadius: 0,
  },
  compositeLabel: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  // ── Calculator ─────────────────────────────────────────────
  calcRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  calcLabel: {
    flex: 1,
    fontSize: FONTS.sm,
    color: COLORS.textDark,
    fontWeight: '600',
    marginRight: SPACING.sm,
  },
  calcInput: {
    width: 60,
    height: 38,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    textAlign: 'center',
    fontSize: FONTS.md,
    color: COLORS.textDark,
    fontWeight: '600',
  },
  calcOutOf: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    width: 28,
    marginLeft: SPACING.xs,
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.danger,
  },
  errorText: {
    fontSize: FONTS.xs,
    color: COLORS.danger,
    fontWeight: '600',
  },
  resultBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  resultLabel: {
    fontSize: FONTS.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  resultValue: {
    fontSize: FONTS.xl,
    fontWeight: '700',
    color: COLORS.primary,
  },
  gradeBox: {
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  gradeText: {
    fontSize: FONTS.md,
    fontWeight: '700',
  },
  resetBtn: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  resetBtnPressed: {
    backgroundColor: '#F1F5F9',
  },
  resetBtnText: {
    fontSize: FONTS.sm,
    color: COLORS.textMid,
    fontWeight: '600',
  },
});
