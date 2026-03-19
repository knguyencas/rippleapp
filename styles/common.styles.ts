import { StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';

export const commonStyles = StyleSheet.create({
  inputGroup: {
    gap: Spacing.xs,
  },
  label: {
    fontSize: 13,
    fontFamily: 'Nunito_600SemiBold',
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
    fontFamily: 'Nunito_400Regular',
    color: Colors.textPrimary,
  },

  btnPrimary: {
    backgroundColor: Colors.teal,
    borderRadius: Spacing.radiusFull,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  btnSecondary: {
    backgroundColor: 'transparent',
    borderRadius: Spacing.radiusFull,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.teal,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 15,
    color: Colors.textLight,
  },
  btnTextSecondary: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 15,
    color: Colors.teal,
  },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: Spacing.radiusLg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
  },
});