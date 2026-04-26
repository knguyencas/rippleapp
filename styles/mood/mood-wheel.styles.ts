import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../../constants/colors';

const { width, height } = Dimensions.get('window');

export const moodWheelStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 39, 68, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.foam,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 16,
    paddingBottom: 48,
    alignItems: 'center',
  },
  handle: {
    width: 40, height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    marginBottom: 20,
  },
  moodEmojiBig: {
    fontSize: 64,
    marginBottom: 4,
  },
  moodName: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 20,
    color: Colors.textPrimary,
    marginBottom: 2,
    textAlign: 'center',
  },
  moodDesc: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: '#7FB3CC',
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 32,
  },
  hint: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 11,
    color: '#9BB5C4',
    marginTop: 8,
    marginBottom: 16,
  },
  confirmBtn: {
    backgroundColor: Colors.ocean,
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: 'center',
    width: width - 48,
  },
  confirmBtnText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: Colors.textLight,
  },
  skipBtn: {
    marginTop: 10,
    padding: 8,
  },
  skipText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: '#9BB5C4',
    textDecorationLine: 'underline',
  },
});

export const MOOD_WHEEL_SIZE = Math.min(width * 0.78, height * 0.38, 320);
export const MOOD_WHEEL_RADIUS = MOOD_WHEEL_SIZE / 2;
export const MOOD_WHEEL_INNER_RADIUS = MOOD_WHEEL_SIZE * 0.18;
export const MOOD_WHEEL_CLIP_HEIGHT = MOOD_WHEEL_SIZE / 2 + 20;
const NEEDLE_LEN = MOOD_WHEEL_RADIUS / 2;

export const wheelStyles = StyleSheet.create({
  wheelClip: {
    width: MOOD_WHEEL_SIZE,
    height: MOOD_WHEEL_CLIP_HEIGHT,
    overflow: 'hidden',
    position: 'relative',
  },
  wheelInner: {
    width: MOOD_WHEEL_SIZE,
    height: MOOD_WHEEL_SIZE,
    position: 'absolute',
    top: 0, left: 0,
  },
  centerHole: {
    position: 'absolute',
    width: MOOD_WHEEL_INNER_RADIUS * 2,
    height: MOOD_WHEEL_INNER_RADIUS * 2,
    borderRadius: MOOD_WHEEL_INNER_RADIUS,
    backgroundColor: '#F5FBFD',
    top: MOOD_WHEEL_RADIUS - MOOD_WHEEL_INNER_RADIUS,
    left: MOOD_WHEEL_RADIUS - MOOD_WHEEL_INNER_RADIUS,
  },
  needleWrap: {
    position: 'absolute',
    top: 0, left: 0,
    width: MOOD_WHEEL_SIZE,
    height: MOOD_WHEEL_CLIP_HEIGHT,
  },
  needleLine: {
    position: 'absolute',
    width: 3,
    height: NEEDLE_LEN - 6,
    backgroundColor: '#1A3A5C',
    top: MOOD_WHEEL_RADIUS - NEEDLE_LEN + 4,
    left: MOOD_WHEEL_SIZE / 2 - 1.5,
    borderRadius: 2,
  },
  needleTip: {
    position: 'absolute',
    top: MOOD_WHEEL_RADIUS - NEEDLE_LEN - 6,
    left: MOOD_WHEEL_SIZE / 2 - 5,
    width: 0, height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 9,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#1A3A5C',
  },
  needleCenter: {
    position: 'absolute',
    width: 14, height: 14,
    borderRadius: 7,
    backgroundColor: '#1A3A5C',
    top: MOOD_WHEEL_RADIUS - 7,
    left: MOOD_WHEEL_SIZE / 2 - 7,
  },
});

export const moodWheelElementStyles = StyleSheet.create({
  wheelBackground: {
    width: MOOD_WHEEL_SIZE,
    height: MOOD_WHEEL_SIZE,
  },
  sheetBody: {
    width: '100%',
    alignItems: 'center',
  },
  emojiItemBase: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: {
    fontSize: 18,
  },
  emojiTextActive: {
    fontSize: 28,
  },
});
