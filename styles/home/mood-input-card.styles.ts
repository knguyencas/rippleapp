import { StyleSheet } from 'react-native';

export const moodInputCardStyles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
    marginTop: 22,
  },
  prompt: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    color: '#1A3A4A',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#1A3A4A',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 5,
  },
  halo: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(244, 166, 160, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  haloLogged: {
    backgroundColor: 'rgba(124, 179, 212, 0.18)',
  },
  heartCore: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F4A6A0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartCoreLogged: {
    backgroundColor: '#5B9BC8',
  },
  heartGlyph: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 22,
    color: '#FFFFFF',
  },
  title: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: '#1A3A4A',
    marginTop: 10,
  },
  sub: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 11,
    color: '#6E8597',
    marginTop: 2,
  },
  loggedNote: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: '#4A7A9B',
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 12,
  },
});
