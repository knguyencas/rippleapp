import { StyleSheet, Platform } from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';

export const cardShadow: any = Platform.OS === 'web'
  ? { boxShadow: '0 2px 8px rgba(26,58,92,0.07)' }
  : { shadowColor: '#1A3A5C', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 2 };

export const commonStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.foam,
  },

  pageHeader: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  pageTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 28,
    color: Colors.textPrimary,
  },
  pageSubtitle: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },

  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  sectionSub: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 12,
    marginTop: -8,
  },

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
