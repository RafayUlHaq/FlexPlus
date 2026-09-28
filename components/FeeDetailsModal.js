// FeeDetailsModal.js
// Shows full semester fee breakdown and payment status.
// Props: visible, feeData, onClose

import React from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOW } from '../theme';

// Format number as PKR currency string
function formatPKR(amount) {
  return `PKR ${amount.toLocaleString()}`;
}

export default function FeeDetailsModal({ visible, feeData, onClose }) {
  if (!feeData) return null;

  const { semesterFee, paid, dueDate, breakdown } = feeData;
  const remaining = semesterFee - paid;
  const paidPct   = Math.round((paid / semesterFee) * 100);

  // Dynamic status — conditional rendering based on remaining amount
  const status      = remaining === 0 ? 'Fully Paid ✅' : 'Payment Due ⚠️';
  const statusColor = remaining === 0 ? COLORS.success : COLORS.warning;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Handle bar */}
        <View style={styles.handle} />

        {/* Modal header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>💳 Fee Details</Text>
          <Pressable onPress={onClose} style={styles.closeBtn} accessibilityLabel="Close fee details">
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>

          {/* ── Status banner ── */}
          <View style={[styles.statusBanner, { borderLeftColor: statusColor }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
            <Text style={styles.dueDate}>Payment deadline: {dueDate}</Text>
          </View>

          {/* ── Payment progress ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Progress</Text>
            {/* Track */}
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${paidPct}%` }]} />
            </View>
            <Text style={styles.pctLabel}>{paidPct}% paid</Text>

            {/* Summary row — .map() over array to avoid repetition */}
            {[
              { label: 'Semester Fee', value: semesterFee, color: COLORS.textDark },
              { label: 'Amount Paid',  value: paid,        color: COLORS.success   },
              { label: 'Remaining',    value: remaining,   color: remaining === 0 ? COLORS.success : COLORS.danger },
            ].map((item) => (
              <View key={item.label} style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{item.label}</Text>
                <Text style={[styles.summaryValue, { color: item.color }]}>
                  {formatPKR(item.value)}
                </Text>
              </View>
            ))}
          </View>

          {/* ── Fee breakdown ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fee Breakdown</Text>
            {/* .map() over breakdown array — data-driven list */}
            {breakdown.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.breakdownRow,
                  index < breakdown.length - 1 && styles.breakdownBorder,
                ]}
              >
                <Text style={styles.breakdownLabel}>{item.label}</Text>
                <Text style={styles.breakdownAmount}>{formatPKR(item.amount)}</Text>
              </View>
            ))}
            {/* Total row */}
            <View style={[styles.breakdownRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>{formatPKR(semesterFee)}</Text>
            </View>
          </View>

          {/* ── Notice ── */}
          <View style={styles.notice}>
            <Text style={styles.noticeText}>
              🏦 To make a payment, visit the Accounts Office or use the online payment portal. 
              For queries call: 051-111-000-001
            </Text>
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
  headerTitle: {
    fontSize: FONTS.lg,
    fontWeight: '700',
    color: COLORS.textDark,
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
  statusBanner: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderLeftWidth: 4,
    padding: SPACING.md,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOW.sm,
  },
  statusText: {
    fontSize: FONTS.md,
    fontWeight: '700',
    marginBottom: 4,
  },
  dueDate: {
    fontSize: FONTS.sm,
    color: COLORS.textMid,
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
    marginBottom: SPACING.md,
  },
  track: {
    height: 10,
    backgroundColor: '#E2E8F0',
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    marginBottom: SPACING.xs,
  },
  fill: {
    height: '100%',
    backgroundColor: COLORS.success,
    borderRadius: RADIUS.full,
  },
  pctLabel: {
    fontSize: FONTS.xs,
    color: COLORS.success,
    fontWeight: '700',
    textAlign: 'right',
    marginBottom: SPACING.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
  },
  summaryLabel: {
    fontSize: FONTS.sm,
    color: COLORS.textMid,
  },
  summaryValue: {
    fontSize: FONTS.sm,
    fontWeight: '700',
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
  },
  breakdownBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  breakdownLabel: {
    fontSize: FONTS.sm,
    color: COLORS.textMid,
  },
  breakdownAmount: {
    fontSize: FONTS.sm,
    color: COLORS.textDark,
    fontWeight: '600',
  },
  totalRow: {
    borderTopWidth: 2,
    borderTopColor: COLORS.border,
    marginTop: SPACING.xs,
  },
  totalLabel: {
    fontSize: FONTS.md,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  totalAmount: {
    fontSize: FONTS.md,
    fontWeight: '700',
    color: COLORS.primary,
  },
  notice: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  noticeText: {
    fontSize: FONTS.xs,
    color: COLORS.primary,
    lineHeight: 18,
  },
});
