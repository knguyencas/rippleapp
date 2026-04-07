import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../constants/colors';

const { width } = Dimensions.get('window');

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

const WHEEL_SIZE   = width * 0.88;
const RADIUS       = WHEEL_SIZE / 2;
const INNER_R      = WHEEL_SIZE * 0.18;
const CLIP_H       = WHEEL_SIZE / 2 + 20;

export const wheelStyles = StyleSheet.create({
  wheelClip: {
    width: WHEEL_SIZE,
    height: CLIP_H,
    overflow: 'hidden',
    position: 'relative',
  },
  wheelInner: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    position: 'absolute',
    top: 0, left: 0,
  },
  centerHole: {
    position: 'absolute',
    width: INNER_R * 2,
    height: INNER_R * 2,
    borderRadius: INNER_R,
    backgroundColor: '#F5FBFD',
    top: RADIUS - INNER_R,
    left: RADIUS - INNER_R,
  },
  needleWrap: {
    position: 'absolute',
    top: 0, left: 0,
    width: WHEEL_SIZE,
    height: CLIP_H,
  },
  needleLine: {
    position: 'absolute',
    width: 3,
    height: RADIUS - INNER_R - 6,
    backgroundColor: '#1A3A5C',
    top: INNER_R + 4,
    left: WHEEL_SIZE / 2 - 1.5,
    borderRadius: 2,
  },
  needleTip: {
    position: 'absolute',
    top: INNER_R - 4,
    left: WHEEL_SIZE / 2 - 6,
    width: 0, height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#1A3A5C',
  },
  needleCenter: {
    position: 'absolute',
    width: 14, height: 14,
    borderRadius: 7,
    backgroundColor: '#1A3A5C',
    top: RADIUS - 7,
    left: WHEEL_SIZE / 2 - 7,
  },
});