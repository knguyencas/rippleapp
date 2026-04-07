import { StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

const BAR_MAX_H = 100;

export const trackerScreenStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 28,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  headerSub: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  completedBadge: {
    backgroundColor: Colors.teal,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
  },
  completedText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: Colors.textLight,
  },
  completedLabel: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
  },
});

export const statsRowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 20,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  emoji: { fontSize: 22, marginBottom: 4 },
  num: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 22,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  label: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 10,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export const moodBarChartStyles = StyleSheet.create({
  card: {
    marginHorizontal: 24,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  toggle: {
    flexDirection: 'row',
    backgroundColor: Colors.foam,
    borderRadius: 10,
    padding: 3,
  },
  toggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  toggleBtnActive: { backgroundColor: Colors.teal },
  toggleText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 12,
    color: Colors.textSecondary,
  },
  toggleTextActive: { color: Colors.textLight },
  chart: {
    flexDirection: 'row',
    height: BAR_MAX_H + 50,
  },
  yAxis: {
    width: 16,
    justifyContent: 'space-between',
    paddingBottom: 24,
    paddingTop: 20,
  },
  yLabel: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 9,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
  bars: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingLeft: 8,
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    left: 8, right: 0,
    height: 1,
    backgroundColor: Colors.border,
  },
  barCol: { flex: 1, alignItems: 'center' },
  barEmoji: { fontSize: 12, marginBottom: 4, height: 18 },
  barBg: {
    width: 20,
    height: BAR_MAX_H,
    backgroundColor: Colors.border,
    borderRadius: 4,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: { width: '100%', borderRadius: 4 },
  barLabel: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});

export const dailyTrackersStyles = StyleSheet.create({
  wrap: { gap: 10 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  cardLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emoji: { fontSize: 28 },
  info: { flex: 1 },
  name: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  sub: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  barBg: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },
  btn: {
    width: 34, height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: Colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDone: {
    backgroundColor: Colors.teal,
    borderColor: Colors.teal,
  },
  btnText: {
    fontSize: 18,
    color: Colors.teal,
    lineHeight: 22,
  },
  btnTextDone: {
    color: Colors.textLight,
    fontSize: 14,
  },
});

export const psychPhaseStyles = StyleSheet.create({
  phaseCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  phaseTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 12,
  },
  phaseEmoji: { fontSize: 32 },
  phaseInfo: { flex: 1 },
  phaseLabel: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  phaseName: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: Colors.textPrimary,
  },
  scoreBadge: {
    width: 44, height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
  },
  phaseDesc: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },
  quoteCard: {
    backgroundColor: Colors.ocean + '12',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  quoteIcon: { fontSize: 20, marginTop: 2 },
  quoteText: {
    flex: 1,
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: Colors.textPrimary,
    fontStyle: 'italic',
    lineHeight: 21,
  },
});

export const moodDistStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
  },
  bar: {
    flexDirection: 'row',
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 16,
  },
  barSeg: { height: '100%' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  emoji: { fontSize: 14 },
  name: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: Colors.textPrimary,
  },
  right: { alignItems: 'flex-end' },
  pct: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: Colors.textPrimary,
  },
  count: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 11,
    color: Colors.textSecondary,
  },
});

export const aiInsightStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    gap: 14,
    alignItems: 'flex-start',
  },
  icon: { fontSize: 24 },
  text: { flex: 1 },
  title: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  desc: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
