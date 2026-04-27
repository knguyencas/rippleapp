import { StyleSheet } from 'react-native';

export const statsRowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 18,
    gap: 10,
  },
  touchable: {
    flex: 1,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    shadowColor: '#1A3A4A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  value: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 24,
    color: '#1A3A4A',
    lineHeight: 26,
  },
  label: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 9,
    color: '#6E8597',
    textAlign: 'center',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  accentDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  accentStreak: { backgroundColor: '#D85A30' },
  accentMood: { backgroundColor: '#7CB3D4' },
  accentLog: { backgroundColor: '#2E6F8E' },
});
