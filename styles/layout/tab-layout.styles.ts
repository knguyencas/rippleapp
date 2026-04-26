import { StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

export const tabLayoutStyles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.foam,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    paddingBottom: 8,
    paddingTop: 6,
    height: 64,
  },
  tabLabel: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 11,
  },
  iconWrap: {
    width: 36,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  iconWrapActive: {
    backgroundColor: Colors.surface,
  },
  iconText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: Colors.muted,
  },
  iconTextActive: {
    color: Colors.teal,
  },
});
