// App.js — FLEX+ Student Portal
// Single-screen dashboard with modals, search/filter, dynamic warnings,
// attendance updates, and charts. No bottom/side navigation.
//
// React concepts demonstrated here:
//   useState       — courses, search, filter, modals, refresh, loading
//   useEffect      — auto-clear loading state after refresh
//   useMemo        — filtered course list, attention alerts, summary stats
//   useRef         — ScrollView ref for programmatic scroll (Quick Actions)
//   Conditional rendering — alerts, empty states, loading banner
//   Props          — every child component receives data via props
//   Events         — onPress, onChangeText, onUpdate
//   .map()         — render every list
//   .filter()      — course search + attendance filters + alert generation
//   .find()        — locate course by id for update
//   .reduce()      — cgpa / average calculation
//   .sort()        — assignments sorted by priority

import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from 'react-native';

// ── Theme ────────────────────────────────────────────────────
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from './theme';

// ── Mock data ────────────────────────────────────────────────
import {
  student,
  initialCourses,
  assignments,
  announcements,
  feeData,
  attendanceTrend,
  priorityOrder,
} from './data/mockData';

// ── Components ───────────────────────────────────────────────
import Header            from './components/Header';
import SummaryCard       from './components/SummaryCard';
import SectionHeader     from './components/SectionHeader';
import AttentionCard     from './components/AttentionCard';
import CourseCard        from './components/CourseCard';
import AssignmentCard    from './components/AssignmentCard';
import AnnouncementCard  from './components/AnnouncementCard';
import QuickAction       from './components/QuickAction';
import EmptyState        from './components/EmptyState';
import AnalyticsSection  from './components/AnalyticsSection';
import CourseDetailsModal from './components/CourseDetailsModal';
import FeeDetailsModal   from './components/FeeDetailsModal';
import ProfileModal      from './components/ProfileModal';

// ── Filter options for course attendance ─────────────────────
const FILTER_OPTIONS = ['All', 'Excellent', 'Safe', 'Warning', 'Low'];

export default function App() {
  // ── Core data state ─────────────────────────────────────────
  // courses is the live, mutable copy of initialCourses
  const [courses, setCourses] = useState(initialCourses);

  // ── UI state ─────────────────────────────────────────────────
  const [searchQuery, setSearchQuery]       = useState('');
  const [activeFilter, setActiveFilter]     = useState('All');
  const [loading, setLoading]               = useState(false);
  const [lastUpdated, setLastUpdated]       = useState('');
  const [showAnalytics, setShowAnalytics]   = useState(false);

  // ── Modal state ──────────────────────────────────────────────
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showFeeModal, setShowFeeModal]     = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // ── ScrollView ref — for Quick Action scrolling ─────────────
  const scrollRef = useRef(null);

  // Section layout Y positions (set via onLayout)
  const sectionRefs = useRef({
    courses:       0,
    attendance:    0,
    assignments:   0,
    announcements: 0,
    analytics:     0,
  });

  // ── useMemo: derive summary stats from live courses ──────────
  // Recalculates only when courses array changes
  const summaryStats = useMemo(() => {
    const totalCredits = courses.reduce((sum, c) => sum + c.creditHours, 0);
    // Overall attendance = average of all course attendance percentages
    const avgAttendance = Math.round(
      courses.reduce((sum, c) => sum + Math.round((c.attended / c.total) * 100), 0) /
        courses.length
    );
    return {
      cgpa:       student.cgpa,
      attendance: avgAttendance,
      courseCount: courses.length,
      credits:    totalCredits,
    };
  }, [courses]);

  // ── useMemo: dynamically generate attention alerts ───────────
  // Uses .filter() + .map() — highlighted for viva
  const attentionAlerts = useMemo(() => {
    const alerts = [];

    // Low / warning attendance
    courses.forEach((c) => {
      const pct = Math.round((c.attended / c.total) * 100);
      if (pct < 75) {
        alerts.push({
          id:       `att-low-${c.id}`,
          icon:     '⚠️',
          title:    'Low Attendance',
          subtitle: `${c.name} — ${pct}% (minimum 75% required)`,
          type:     'danger',
        });
      } else if (pct < 80) {
        alerts.push({
          id:       `att-warn-${c.id}`,
          icon:     '📉',
          title:    'Attendance Warning',
          subtitle: `${c.name} — ${pct}% (approaching the minimum threshold)`,
          type:     'warning',
        });
      }
    });

    // Low marks alert
    courses
      .filter((c) => c.marks < 70)
      .forEach((c) => {
        alerts.push({
          id:       `marks-${c.id}`,
          icon:     '📉',
          title:    'Performance Alert',
          subtitle: `${c.name} — ${c.marks}/100 marks`,
          type:     'warning',
        });
      });

    // Upcoming deadlines
    const urgentAssignments = assignments.filter(
      (a) => a.dueDate === 'Tomorrow' || a.dueDate === 'Today'
    );
    urgentAssignments.forEach((a) => {
      alerts.push({
        id:       `deadline-${a.id}`,
        icon:     '⏰',
        title:    `Deadline ${a.dueDate}`,
        subtitle: `${a.title} — ${a.course}`,
        type:     'info',
      });
    });

    return alerts;
  }, [courses]);

  // ── useMemo: filtered + searched course list ─────────────────
  // Demonstrates .filter() with multiple conditions
  const filteredCourses = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return courses.filter((c) => {
      // Search: match name, code, or instructor
      const matchesSearch =
        !query ||
        c.name.toLowerCase().includes(query) ||
        c.code.toLowerCase().includes(query) ||
        c.instructor.toLowerCase().includes(query);

      if (!matchesSearch) return false;

      // Filter by attendance status
      const pct = Math.round((c.attended / c.total) * 100);
      if (activeFilter === 'All')       return true;
      if (activeFilter === 'Excellent') return pct >= 85;
      if (activeFilter === 'Safe')      return pct >= 75 && pct < 85;
      if (activeFilter === 'Warning')   return pct >= 70 && pct < 75;
      if (activeFilter === 'Low')       return pct < 75;
      return true;
    });
  }, [courses, searchQuery, activeFilter]);

  // ── useMemo: assignments sorted by priority ──────────────────
  // Demonstrates .sort() with custom comparator
  const sortedAssignments = useMemo(
    () =>
      [...assignments].sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
      ),
    []
  );

  // ── Handlers ─────────────────────────────────────────────────

  // Called by CourseDetailsModal when attendance is updated
  const handleCourseUpdate = useCallback((updatedCourse) => {
    // .map() to replace the matching course in the array
    setCourses((prev) =>
      prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c))
    );
  }, []);

  // Refresh dashboard — simulates loading state with useEffect
  const handleRefresh = () => {
    setLoading(true);
    setLastUpdated('');
  };

  // useEffect triggers after loading state is set
  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => {
      setLoading(false);
      setLastUpdated('just now');
    }, 1500);
    return () => clearTimeout(timer); // cleanup
  }, [loading]);

  // Quick action scroll helpers
  const scrollToSection = (key) => {
    const y = sectionRefs.current[key] || 0;
    scrollRef.current?.scrollTo({ y, animated: true });
  };

  // ── Quick actions config (data-driven) ──────────────────────
  const quickActions = [
    { icon: '📚', label: 'Courses',     color: COLORS.primary, onPress: () => scrollToSection('courses')       },
    { icon: '📋', label: 'Attendance',  color: COLORS.success, onPress: () => scrollToSection('attendance')    },
    { icon: '📝', label: 'Assignments', color: COLORS.warning, onPress: () => scrollToSection('assignments')   },
    { icon: '💳', label: 'Fee',         color: COLORS.danger,  onPress: () => setShowFeeModal(true)            },
    { icon: '📊', label: 'Analytics',   color: '#7C3AED',      onPress: () => { setShowAnalytics(true); scrollToSection('analytics'); } },
  ];

  // ── Summary cards config ─────────────────────────────────────
  const summaryCards = [
    { icon: '🎓', label: 'CGPA',      value: summaryStats.cgpa,        color: COLORS.primary },
    { icon: '📅', label: 'Attendance', value: `${summaryStats.attendance}%`, color: summaryStats.attendance < 75 ? COLORS.danger : summaryStats.attendance < 80 ? COLORS.warning : COLORS.success },
    { icon: '📚', label: 'Courses',   value: summaryStats.courseCount, color: '#7C3AED'      },
    { icon: '⚡',  label: 'Credits',   value: summaryStats.credits,     color: COLORS.warning },
  ];

  // ── Fee card summary ─────────────────────────────────────────
  const remaining   = feeData.semesterFee - feeData.paid;
  const feeStatus   = remaining === 0 ? 'Fully Paid' : remaining > 0 ? 'Partial Payment' : 'Paid';
  const feeStatusColor = remaining === 0 ? COLORS.success : COLORS.warning;

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* ── Loading banner — conditional rendering ── */}
      {loading && (
        <View style={styles.loadingBanner}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={styles.loadingText}>Updating dashboard...</Text>
        </View>
      )}

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ════════════════════════════════════════════
            1. HEADER
        ════════════════════════════════════════════ */}
        <Header
          student={student}
          onProfilePress={() => setShowProfileModal(true)}
        />

        <View style={styles.body}>

          {/* Last updated indicator */}
          {lastUpdated ? (
            <Text style={styles.lastUpdated}>✓ Last updated {lastUpdated}</Text>
          ) : null}

          {/* ════════════════════════════════════════════
              2. QUICK SUMMARY CARDS
          ════════════════════════════════════════════ */}
          <View style={styles.section}>
            <View style={styles.summaryRow}>
              {/* .map() over data array — demonstrates data-driven UI */}
              {summaryCards.map((card) => (
                <SummaryCard
                  key={card.label}
                  icon={card.icon}
                  label={card.label}
                  value={card.value}
                  color={card.color}
                />
              ))}
            </View>
          </View>

          {/* ════════════════════════════════════════════
              3. QUICK ACTIONS
          ════════════════════════════════════════════ */}
          <View style={styles.section}>
            <SectionHeader title="Quick Actions" />
            <View style={styles.quickActionsRow}>
              {quickActions.map((qa) => (
                <QuickAction
                  key={qa.label}
                  icon={qa.icon}
                  label={qa.label}
                  color={qa.color}
                  onPress={qa.onPress}
                />
              ))}
            </View>
          </View>

          {/* ════════════════════════════════════════════
              4. NEEDS YOUR ATTENTION
              Dynamic alerts generated from course data
          ════════════════════════════════════════════ */}
          <View
            style={styles.section}
            onLayout={(e) =>
              (sectionRefs.current.attendance = e.nativeEvent.layout.y)
            }
          >
            <SectionHeader
              title="⚡ Needs Your Attention"
              rightLabel={`${attentionAlerts.length} alert${attentionAlerts.length !== 1 ? 's' : ''}`}
            />

            {/* Conditional rendering: alerts vs all-clear */}
            {attentionAlerts.length === 0 ? (
              <EmptyState
                icon="🎉"
                title="You're all caught up!"
                subtitle="No attendance or performance issues right now."
              />
            ) : (
              attentionAlerts.map((alert) => (
                <AttentionCard
                  key={alert.id}
                  icon={alert.icon}
                  title={alert.title}
                  subtitle={alert.subtitle}
                  type={alert.type}
                />
              ))
            )}
          </View>

          {/* ════════════════════════════════════════════
              5. FEE STATUS CARD
          ════════════════════════════════════════════ */}
          <View style={styles.section}>
            <SectionHeader title="💳 Fee Status" />
            <View style={styles.feeCard}>
              <View style={styles.feeTopRow}>
                <View>
                  <Text style={styles.feeLabel}>Semester Fee</Text>
                  <Text style={styles.feeAmount}>
                    PKR {feeData.semesterFee.toLocaleString()}
                  </Text>
                </View>
                <View style={[styles.feeBadge, { backgroundColor: feeStatusColor + '18' }]}>
                  <Text style={[styles.feeBadgeText, { color: feeStatusColor }]}>
                    {feeStatus}
                  </Text>
                </View>
              </View>

              <View style={styles.feeRow}>
                <Text style={styles.feeSubLabel}>Paid</Text>
                <Text style={[styles.feeSubValue, { color: COLORS.success }]}>
                  PKR {feeData.paid.toLocaleString()}
                </Text>
              </View>
              <View style={styles.feeRow}>
                <Text style={styles.feeSubLabel}>Remaining</Text>
                <Text style={[styles.feeSubValue, { color: remaining > 0 ? COLORS.danger : COLORS.success }]}>
                  PKR {remaining.toLocaleString()}
                </Text>
              </View>

              {/* Fee progress bar */}
              <View style={styles.feeTrack}>
                <View
                  style={[
                    styles.feeFill,
                    { width: `${Math.round((feeData.paid / feeData.semesterFee) * 100)}%` },
                  ]}
                />
              </View>

              <Pressable
                style={({ pressed }) => [styles.feeBtn, pressed && styles.feeBtnPressed]}
                onPress={() => setShowFeeModal(true)}
                accessibilityLabel="View fee details"
              >
                <Text style={styles.feeBtnText}>View Details →</Text>
              </Pressable>
            </View>
          </View>

          {/* ════════════════════════════════════════════
              6. COURSE SEARCH + FILTER + LIST
          ════════════════════════════════════════════ */}
          <View
            style={styles.section}
            onLayout={(e) =>
              (sectionRefs.current.courses = e.nativeEvent.layout.y)
            }
          >
            <SectionHeader title="📚 My Courses" />

            {/* Search input — controlled TextInput */}
            <View style={styles.searchContainer}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search by name, code or instructor..."
                placeholderTextColor={COLORS.textMuted}
                returnKeyType="search"
                accessibilityLabel="Search courses"
                clearButtonMode="while-editing"
              />
              {/* Clear button — conditional rendering */}
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery('')} accessibilityLabel="Clear search">
                  <Text style={styles.clearBtn}>✕</Text>
                </Pressable>
              )}
            </View>

            {/* Filter chips — .map() over FILTER_OPTIONS array */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterScroll}
              contentContainerStyle={styles.filterRow}
            >
              {FILTER_OPTIONS.map((f) => (
                <Pressable
                  key={f}
                  style={[
                    styles.filterChip,
                    activeFilter === f && styles.filterChipActive,
                  ]}
                  onPress={() => setActiveFilter(f)}
                  accessibilityLabel={`Filter by ${f}`}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      activeFilter === f && styles.filterChipTextActive,
                    ]}
                  >
                    {f}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Result count */}
            <Text style={styles.resultCount}>
              {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
            </Text>

            {/* Courses list — conditional empty state */}
            {filteredCourses.length === 0 ? (
              <EmptyState
                icon="🔎"
                title="No courses found"
                subtitle={`No results for "${searchQuery}" with filter "${activeFilter}"`}
              />
            ) : (
              filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onPress={setSelectedCourse}
                />
              ))
            )}
          </View>

          {/* ════════════════════════════════════════════
              7. UPCOMING DEADLINES
          ════════════════════════════════════════════ */}
          <View
            style={styles.section}
            onLayout={(e) =>
              (sectionRefs.current.assignments = e.nativeEvent.layout.y)
            }
          >
            <SectionHeader
              title="⏰ Upcoming Deadlines"
              rightLabel={`${sortedAssignments.length} tasks`}
            />
            {sortedAssignments.length === 0 ? (
              <EmptyState icon="✅" title="No pending assignments" />
            ) : (
              sortedAssignments.map((a) => (
                <AssignmentCard key={a.id} assignment={a} />
              ))
            )}
          </View>

          {/* ════════════════════════════════════════════
              8. ANNOUNCEMENTS
          ════════════════════════════════════════════ */}
          <View
            style={styles.section}
            onLayout={(e) =>
              (sectionRefs.current.announcements = e.nativeEvent.layout.y)
            }
          >
            <SectionHeader
              title="📢 Announcements"
              rightLabel={`${announcements.length} new`}
            />
            {announcements.length === 0 ? (
              <EmptyState icon="📭" title="No new announcements" />
            ) : (
              announcements.map((a) => (
                <AnnouncementCard key={a.id} announcement={a} />
              ))
            )}
          </View>

          {/* ════════════════════════════════════════════
              9. ANALYTICS (toggle show/hide)
          ════════════════════════════════════════════ */}
          <View
            style={styles.section}
            onLayout={(e) =>
              (sectionRefs.current.analytics = e.nativeEvent.layout.y)
            }
          >
            <Pressable
              style={({ pressed }) => [
                styles.analyticsToggle,
                pressed && styles.analyticsTogglePressed,
              ]}
              onPress={() => setShowAnalytics((prev) => !prev)}
              accessibilityLabel={showAnalytics ? 'Hide analytics' : 'Show analytics'}
            >
              <Text style={styles.analyticsToggleText}>
                📊 Analytics & Performance {showAnalytics ? '▲' : '▼'}
              </Text>
            </Pressable>

            {/* Conditional rendering — expand/collapse analytics */}
            {showAnalytics && (
              <AnalyticsSection
                courses={courses}
                attendanceTrend={attendanceTrend}
              />
            )}
          </View>

          {/* ════════════════════════════════════════════
              10. REFRESH BUTTON
          ════════════════════════════════════════════ */}
          <View style={styles.section}>
            <Pressable
              style={({ pressed }) => [
                styles.refreshBtn,
                pressed && styles.refreshBtnPressed,
                loading  && styles.refreshBtnDisabled,
              ]}
              onPress={handleRefresh}
              disabled={loading}
              accessibilityLabel="Refresh dashboard"
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.refreshBtnText}>🔄 Refresh Dashboard</Text>
              )}
            </Pressable>
          </View>

          {/* Footer */}
          <Text style={styles.footer}>FLEX+ • Your university, simplified.</Text>
          <View style={{ height: SPACING.xxl }} />

        </View>
      </ScrollView>

      {/* ════════════════════════════════════════════
          MODALS (rendered outside ScrollView)
      ════════════════════════════════════════════ */}
      <CourseDetailsModal
        visible={!!selectedCourse}
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
        onUpdate={handleCourseUpdate}
      />

      <FeeDetailsModal
        visible={showFeeModal}
        feeData={feeData}
        onClose={() => setShowFeeModal(false)}
      />

      <ProfileModal
        visible={showProfileModal}
        student={student}
        onClose={() => setShowProfileModal(false)}
      />
    </SafeAreaView>
  );
}

// ── Styles ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  loadingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingVertical: SPACING.xs,
  },
  loadingText: {
    fontSize: FONTS.xs,
    color: COLORS.primary,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
  scroll: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    backgroundColor: COLORS.background,
  },
  body: {
    padding: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  lastUpdated: {
    fontSize: FONTS.xs,
    color: COLORS.success,
    fontWeight: '600',
    textAlign: 'right',
    marginBottom: SPACING.sm,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  // ── Summary cards ──────────────────────────────────────────
  summaryRow: {
    flexDirection: 'row',
    marginHorizontal: -SPACING.xs,
  },
  // ── Quick actions ──────────────────────────────────────────
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  // ── Fee card ───────────────────────────────────────────────
  feeCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOW.md,
  },
  feeTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  feeLabel: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  feeAmount: {
    fontSize: FONTS.lg,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  feeBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  feeBadgeText: {
    fontSize: FONTS.xs,
    fontWeight: '700',
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  feeSubLabel: {
    fontSize: FONTS.sm,
    color: COLORS.textMid,
  },
  feeSubValue: {
    fontSize: FONTS.sm,
    fontWeight: '700',
  },
  feeTrack: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
  },
  feeFill: {
    height: '100%',
    backgroundColor: COLORS.success,
    borderRadius: RADIUS.full,
  },
  feeBtn: {
    alignSelf: 'flex-end',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.full,
  },
  feeBtnPressed: { opacity: 0.7 },
  feeBtnText: {
    fontSize: FONTS.xs,
    color: COLORS.primary,
    fontWeight: '700',
  },
  // ── Search ─────────────────────────────────────────────────
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: FONTS.sm,
    color: COLORS.textDark,
  },
  clearBtn: {
    fontSize: FONTS.sm,
    color: COLORS.textMuted,
    padding: SPACING.xs,
    fontWeight: '700',
  },
  // ── Filters ────────────────────────────────────────────────
  filterScroll: {
    marginBottom: SPACING.sm,
  },
  filterRow: {
    flexDirection: 'row',
    paddingVertical: SPACING.xs,
  },
  filterChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SPACING.sm,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: FONTS.xs,
    color: COLORS.textMid,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  resultCount: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
  },
  // ── Analytics toggle ───────────────────────────────────────
  analyticsToggle: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    ...SHADOW.sm,
  },
  analyticsTogglePressed: {
    opacity: 0.75,
  },
  analyticsToggleText: {
    fontSize: FONTS.md,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  // ── Refresh button ─────────────────────────────────────────
  refreshBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    ...SHADOW.md,
  },
  refreshBtnPressed: {
    opacity: 0.8,
  },
  refreshBtnDisabled: {
    opacity: 0.6,
  },
  refreshBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: FONTS.md,
  },
  // ── Footer ─────────────────────────────────────────────────
  footer: {
    textAlign: 'center',
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
  },
});
