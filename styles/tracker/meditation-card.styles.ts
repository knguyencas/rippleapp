import { StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

const MEDITATE_GREEN = '#3D7A4A';
const MEDITATE_BG = '#D8E8D8';
const MEDITATE_TRACK = '#E8F0E8';

export const meditationCardStyles = StyleSheet.create({
  card: {
    marginHorizontal: 24,
    marginTop: 20,
    backgroundColor: Colors.foam,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  numberWrap: {
    flex: 1,
  },
  bigNumber: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 32,
    color: MEDITATE_GREEN,
    lineHeight: 36,
  },
  unit: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  progressWrap: {
    flex: 1,
    paddingLeft: 12,
  },
  progressTrack: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: MEDITATE_TRACK,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: MEDITATE_GREEN,
    borderRadius: 4,
  },
  progressText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    color: MEDITATE_GREEN,
    marginTop: 4,
    textAlign: 'right',
  },
  actionBtn: {
    marginTop: 14,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: MEDITATE_BG,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: MEDITATE_GREEN,
  },
  actionBtnText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: MEDITATE_GREEN,
  },
});
