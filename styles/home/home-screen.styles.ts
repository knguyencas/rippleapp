import { StyleSheet } from 'react-native';

const CREAM = '#FAF5E6';

export const homeScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CREAM,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  sectionLabel: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    color: '#1A3A4A',
    marginTop: 22,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 22,
    marginBottom: 12,
  },
  sectionRowTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    color: '#1A3A4A',
  },
  sectionRowMeta: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 11,
    color: '#2E6F8E',
  },
});
