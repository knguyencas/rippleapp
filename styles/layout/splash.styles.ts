import { StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';

export const splashStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.foam,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wave1: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: Colors.mist,
    opacity: 0.4,
    top: -100,
    right: -100,
  },
  wave2: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: Colors.wave,
    opacity: 0.15,
    bottom: -50,
    left: -80,
  },
  wave3: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.teal,
    opacity: 0.1,
    bottom: 100,
    right: -40,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    ...Typography.h1,
    fontSize: 42,
    color: Colors.teal,
    letterSpacing: 2,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.bodySecondary,
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
