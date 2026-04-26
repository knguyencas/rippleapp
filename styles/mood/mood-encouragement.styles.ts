import { StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

export const moodEncouragementStyles = StyleSheet.create({
  card: {
    marginHorizontal: 24,
    marginTop: 20,
    backgroundColor: Colors.mist,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  title: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: Colors.teal,
  },
  body: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    lineHeight: 20,
    color: Colors.textPrimary,
  },
});

export const encouragementHintStyles = StyleSheet.create({
  wrap: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  icon: {
    fontSize: 14,
    marginTop: 1,
  },
  text: {
    flex: 1,
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    lineHeight: 18,
    color: Colors.textSecondary,
  },
});
