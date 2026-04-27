import { StyleSheet } from 'react-native';

export const QuickActionAccent = {
  water:    { primary: '#2E6F8E', dark: '#5B9BC8', bg: '#DEEBFF', track: '#E8F0F7', soft: '#F0F4F7' },
  sleep:    { primary: '#6B5AAA', dark: '#6B5AAA', bg: '#E0D8F0', track: '#F0EBF7', soft: '#F4F0FA' },
  walk:     { primary: '#A0651A', dark: '#C97818', bg: '#F4D8B0', track: '#FAEDD8', soft: '#FAEDD8' },
  meditate: { primary: '#3D7A4A', dark: '#3D7A4A', bg: '#D8E8D8', track: '#E8F0E8', soft: '#E8F0E8' },
} as const;

export type QuickActionAccentName = keyof typeof QuickActionAccent;

export const quickActionStyles = StyleSheet.create({
  grid: {
    paddingHorizontal: 20,
    gap: 12,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 18,
    shadowColor: '#1A3A4A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardDashed: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLetter: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
  },
  titleBlock: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: '#1A3A4A',
  },
  badgeNew: {
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeNewText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 9,
    color: '#B07F1A',
  },
  goal: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 11,
    color: '#6E8597',
    marginTop: 2,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  valueBig: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 26,
    lineHeight: 28,
  },
  valueUnit: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: '#6E8597',
    marginLeft: 4,
  },
  progressTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pillBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillBtnText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
  },
  pillBtnPrimary: {
    flex: 2,
  },
  pillBtnDisabled: {
    opacity: 0.5,
  },
});
