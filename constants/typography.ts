import { StyleSheet } from 'react-native';
import { Colors } from './colors';

export const Typography = StyleSheet.create({
  h1: {
    fontSize: 28,
    fontFamily: 'Nunito_700Bold',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  h2: {
    fontSize: 22,
    fontFamily: 'Nunito_700Bold',
    color: Colors.textPrimary,
  },
  h3: {
    fontSize: 18,
    fontFamily: 'Nunito_600SemiBold',
    color: Colors.textPrimary,
  },
  body: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  bodySecondary: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  caption: {
    fontSize: 11,
    fontFamily: 'Nunito_400Regular',
    color: Colors.textSecondary,
  },
  button: {
    fontSize: 15,
    fontFamily: 'Nunito_600SemiBold',
    color: Colors.textLight,
  },
});