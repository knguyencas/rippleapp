import { StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

const MEDITATE_GREEN = '#3D7A4A';
const MEDITATE_BG = '#D8E8D8';
const MEDITATE_BORDER = '#C8DCC8';
const MEDITATE_TRACK = '#E8F0E8';

export const MeditateAccent = {
  green: MEDITATE_GREEN,
  bg: MEDITATE_BG,
  border: MEDITATE_BORDER,
  track: MEDITATE_TRACK,
};

export const meditationModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(12, 44, 58, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: Colors.foam,
    borderRadius: 22,
    paddingVertical: 22,
    paddingHorizontal: 18,
    shadowColor: '#1A3A4A',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    elevation: 8,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 20,
    color: Colors.textPrimary,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 22,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  subtitle: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 16,
  },

  sectionLabel: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: Colors.textPrimary,
    marginTop: 14,
    marginBottom: 8,
  },

  soundsScroll: {
    paddingVertical: 4,
  },
  soundCard: {
    width: 116,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginRight: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'transparent',
    alignItems: 'center',
    shadowColor: '#1A3A4A',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
  },
  soundCardActive: {
    borderColor: MEDITATE_GREEN,
    backgroundColor: MEDITATE_BG,
  },
  soundName: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  soundDesc: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 10,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  soundStatus: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: MEDITATE_TRACK,
  },
  soundStatusText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 10,
    color: MEDITATE_GREEN,
  },
  soundStatusInactive: {
    backgroundColor: '#EEF4F8',
  },
  soundStatusInactiveText: {
    color: Colors.textSecondary,
  },
  soundProgressBar: {
    marginTop: 6,
    width: '100%',
    height: 4,
    borderRadius: 2,
    backgroundColor: MEDITATE_TRACK,
    overflow: 'hidden',
  },
  soundProgressFill: {
    height: '100%',
    backgroundColor: MEDITATE_GREEN,
    borderRadius: 2,
  },

  durationRow: {
    flexDirection: 'row',
    gap: 8,
  },
  durationChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  durationChipActive: {
    backgroundColor: MEDITATE_GREEN,
    borderColor: MEDITATE_GREEN,
  },
  durationChipText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: Colors.textPrimary,
  },
  durationChipTextActive: {
    color: '#FFFFFF',
  },

  hero: {
    marginTop: 20,
    backgroundColor: MEDITATE_BG,
    borderRadius: 20,
    paddingVertical: 28,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: MEDITATE_BORDER,
  },
  heroCountdown: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 44,
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
  heroSub: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },

  actions: {
    marginTop: 18,
    gap: 10,
  },
  primaryBtn: {
    backgroundColor: MEDITATE_GREEN,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: MEDITATE_GREEN,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 5,
  },
  primaryBtnText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    color: '#FFFFFF',
  },
  primaryBtnDisabled: {
    backgroundColor: '#9CC0A2',
    shadowOpacity: 0.1,
  },
  secondaryBtn: {
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: Colors.textSecondary,
  },

  emptyText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 24,
  },
});

export const meditationAwayDialogStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(12, 44, 58, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: Colors.foam,
    borderRadius: 18,
    paddingVertical: 22,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#1A3A4A',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 17,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  body: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 16,
  },
  bodyBold: {
    fontFamily: 'Nunito_700Bold',
    color: Colors.textPrimary,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  endBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  endText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: Colors.textSecondary,
  },
  resumeBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: MEDITATE_GREEN,
    alignItems: 'center',
  },
  resumeText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
    color: '#FFFFFF',
  },
});
