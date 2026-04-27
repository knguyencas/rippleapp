import { StyleSheet } from 'react-native';

const TEXT = '#1A3A4A';
const MUTED = '#6E8597';
const BLUE_DARK = '#2E6F8E';
const BLUE_LIGHT = '#C4DDED';
const STREAK = '#D85A30';
const STREAK_CARD = '#E8F0F7';
const YELLOW_BG = '#FFF3CD';
const YELLOW_TEXT = '#8B6F2A';
const YELLOW_TITLE = '#5A4216';

export const trackerHeaderRedesignStyles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F4C28E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: '#6B4226',
  },
  textBlock: {
    flex: 1,
    minWidth: 0,
  },
  greeting: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: TEXT,
  },
  dateText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 11,
    color: MUTED,
    marginTop: 1,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
    backgroundColor: YELLOW_BG,
    borderRadius: 14,
  },
  streakIcon: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 11,
    color: STREAK,
  },
  streakNum: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 11,
    color: STREAK,
  },
  affirm: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 18,
    color: TEXT,
    lineHeight: 23,
    marginTop: 14,
  },
});

export const heroProgressStyles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginTop: 18,
    backgroundColor: BLUE_LIGHT,
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#1A3A4A',
    shadowOpacity: 0.10,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },
  pctBlock: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: BLUE_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pctTrack: {
    position: 'absolute',
    inset: 0,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: 'rgba(46, 111, 142, 0.22)',
  },
  pctLeftClip: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 35,
    height: 70,
    overflow: 'hidden',
  },
  pctRightClip: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 35,
    height: 70,
    overflow: 'hidden',
  },
  pctProgressHalf: {
    position: 'absolute',
    top: 0,
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: BLUE_DARK,
  },
  pctProgressRight: {
    right: 0,
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  pctProgressLeft: {
    left: 0,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
  },
  pctContent: {
    position: 'absolute',
    inset: 7,
    borderRadius: 28,
    backgroundColor: BLUE_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pctText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: TEXT,
    lineHeight: 20,
  },
  pctSub: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 8,
    color: BLUE_DARK,
    marginTop: 1,
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  bodyText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: TEXT,
    lineHeight: 18,
  },
  bodyProgressTrack: {
    width: '100%',
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(46, 111, 142, 0.18)',
    marginTop: 8,
    overflow: 'hidden',
  },
  bodyProgressFill: {
    height: '100%',
    backgroundColor: BLUE_DARK,
    borderRadius: 3,
  },
  cta: {
    alignSelf: 'flex-start',
    marginTop: 8,
    backgroundColor: BLUE_DARK,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  ctaText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 11,
    color: '#FFFFFF',
  },
});

export const checklistStyles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    marginTop: 22,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    color: TEXT,
  },
  meta: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12,
    color: BLUE_DARK,
  },
  item: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 10,
    shadowColor: '#1A3A4A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  itemDashed: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: BLUE_LIGHT,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLetter: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: TEXT,
  },
  newBadge: {
    backgroundColor: YELLOW_BG,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  newBadgeText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 9,
    color: '#B07F1A',
  },
  sub: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: MUTED,
    marginTop: 2,
  },
  trailingBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: BLUE_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trailingBtnText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: BLUE_DARK,
    lineHeight: 18,
  },
  trailingDoneText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 12,
    color: BLUE_DARK,
  },
});

export const trackerIconsRowStyles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    marginTop: 22,
  },
  title: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    color: TEXT,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  cell: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 4,
    alignItems: 'center',
    gap: 6,
    shadowColor: '#1A3A4A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cellGlyphBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellGlyph: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
  },
  cellLabel: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 9,
    letterSpacing: 0.5,
  },
});

export const streaksCardStyles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginTop: 22,
    backgroundColor: STREAK_CARD,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 18,
    shadowColor: '#1A3A4A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: TEXT,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: '#B5CDD9',
    borderStyle: 'dashed',
    paddingTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  monthBlock: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: STREAK_CARD,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: BLUE_DARK,
  },
  flame: {
    fontSize: 25,
    lineHeight: 28,
  },
  flameMuted: {
    opacity: 0.35,
  },
  body: {
    flex: 1,
  },
  bodyTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
    color: TEXT,
  },
  bodyDesc: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 10,
    color: MUTED,
    marginTop: 3,
    lineHeight: 14,
  },
});

export const yellowReminderStyles = StyleSheet.create({
  ctaCard: {
    marginHorizontal: 20,
    marginTop: 22,
    backgroundColor: YELLOW_BG,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#B07F1A',
    shadowOffset: { width: -7, height: 4 },
    shadowOpacity: 0.20,
    shadowRadius: 16,
    elevation: 5,
  },
  ctaBody: {
    flex: 1,
    minWidth: 0,
  },
  ctaText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 11,
    color: YELLOW_TEXT,
    lineHeight: 16,
  },
  ctaPill: {
    alignSelf: 'flex-start',
    marginTop: 8,
    backgroundColor: YELLOW_TITLE,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 18,
  },
  ctaPillText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 11,
    color: YELLOW_BG,
  },
  ctaArrow: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: YELLOW_TEXT,
  },

  msgCard: {
    marginHorizontal: 20,
    marginTop: 22,
    marginBottom: 0,
    backgroundColor: YELLOW_BG,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    shadowColor: '#B07F1A',
    shadowOffset: { width: -7, height: 4 },
    shadowOpacity: 0.20,
    shadowRadius: 16,
    elevation: 5,
  },
  msgMascot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: BLUE_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  msgMascotText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
    color: BLUE_DARK,
  },
  msgBody: {
    flex: 1,
    minWidth: 0,
  },
  msgTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 11,
    color: YELLOW_TITLE,
  },
  msgText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 11,
    color: YELLOW_TEXT,
    lineHeight: 15,
    marginTop: 3,
  },
});
