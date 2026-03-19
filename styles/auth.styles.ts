import { StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Spacing } from '../constants/spacing';

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.foam,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: Spacing.xl,
  },
  wave1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: Colors.mist,
    opacity: 0.5,
    top: -80,
    right: -80,
  },
  wave2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.wave,
    opacity: 0.1,
    bottom: 50,
    left: -60,
  },
  header: {
    paddingTop: 60,
    paddingBottom: Spacing.xl,
  },
  backBtn: {
    marginBottom: Spacing.md,
  },
  backText: {
    color: Colors.teal,
    fontSize: 15,
    fontWeight: '600',
  },
  title: {
    ...Typography.h1,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  titleCentered: {
    ...Typography.h1,
    color: Colors.teal,
    fontSize: 32,
    letterSpacing: 2,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.bodySecondary,
  },
  subtitleCentered: {
    ...Typography.bodySecondary,
    fontSize: 16,
    textAlign: 'center',
  },
  emoji: {
    fontSize: 48,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  headerCentered: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: Spacing.xl,
  },
  form: {
    gap: Spacing.md,
  },
  inputGroup: {
    gap: Spacing.xs,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: Spacing.radiusMd,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  error: {
    color: Colors.alertHigh,
    fontSize: 13,
    textAlign: 'center',
  },
  btnPrimary: {
    backgroundColor: Colors.teal,
    borderRadius: Spacing.radiusFull,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnText: {
    ...Typography.button,
    fontSize: 16,
  },
  btnSecondary: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  btnSecondaryText: {
    ...Typography.bodySecondary,
    fontSize: 14,
  },
  ageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  ageBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Spacing.radiusFull,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  ageBtnActive: {
    backgroundColor: Colors.teal,
    borderColor: Colors.teal,
  },
  ageBtnText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  ageBtnTextActive: {
    color: Colors.textLight,
    fontWeight: '600',
  },
});