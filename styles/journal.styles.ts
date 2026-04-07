import { StyleSheet, Platform, Dimensions } from 'react-native';
import { Colors } from '../constants/colors';

const { width } = Dimensions.get('window');
const PHOTO_SIZE = (width - 48 - 12) / 3;

export const J = {
  bg:          '#EEF3EA',
  illustBg:   '#C8DEB0',
  card:        '#FFFFFF',
  textPrimary: '#2C3E2D',
  textMuted:   '#7A9B7D',
  textLight:   '#A8B898',
  placeholder: '#B5C9B7',
  accent:      '#5B8A5E',
  deleteRed:   '#C0392B',
  border:      '#DDE8DA',
  micBg:       '#6A9B6D',
  micActive:   '#C0392B',
  divider:     '#E5E8DD',
  btnBg:       '#3D5C28',
  btnText:     '#FFFFFF',
};

export const journalCardShadow: any = Platform.OS === 'web'
  ? { boxShadow: '0 2px 8px rgba(44,62,45,0.08)' }
  : { shadowColor: '#2C3E2D', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 };

export const journalHeaderStyles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
  },
  headerBtn:     { padding: 6, minWidth: 36, alignItems: 'center' },
  headerBtnText: { fontSize: 26, color: J.textPrimary, fontFamily: 'Nunito_600SemiBold', lineHeight: 30 },
  headerDate: {
    flex: 1, textAlign: 'center',
    fontFamily: 'Nunito_600SemiBold', fontSize: 15, color: J.textPrimary,
  },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  saveBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: J.accent, alignItems: 'center', justifyContent: 'center',
  },
  saveBtnOff:  { backgroundColor: J.border },
  saveBtnText: { color: '#fff', fontFamily: 'Nunito_700Bold', fontSize: 17 },
  editBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: J.border, alignItems: 'center', justifyContent: 'center',
  },
  editBtnText: { fontSize: 16 },
});

export const journalToastStyles = StyleSheet.create({
  toast: {
    position: 'absolute', bottom: 36, left: 20, right: 20, zIndex: 9999,
    backgroundColor: J.textPrimary, borderRadius: 16,
    paddingVertical: 14, paddingHorizontal: 18,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    ...journalCardShadow,
  },
  toastIcon:  { fontSize: 22 },
  toastTitle: { fontFamily: 'Nunito_700Bold', fontSize: 14, color: '#fff' },
  toastSub:   { fontFamily: 'Nunito_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
});

export const journalNewStyles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: J.bg },
  scrollContent: { paddingHorizontal: 16, paddingTop: 4 },
});

export const journalDetailStyles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: J.bg },
  scrollContent: { paddingHorizontal: 16, paddingTop: 4, gap: 14 },
  card: {
    backgroundColor: J.card, borderRadius: 20, padding: 18, ...journalCardShadow,
  },
  cardTitle: { fontFamily: 'Nunito_700Bold', fontSize: 15, color: J.textPrimary, marginBottom: 12 },
  moodRow:   { flexDirection: 'row', alignItems: 'center', gap: 12 },
  moodEmoji: { fontSize: 36 },
  moodName:  { fontFamily: 'Nunito_700Bold', fontSize: 15, color: J.textPrimary },
  moodDesc:  { fontFamily: 'Nunito_400Regular', fontSize: 12, color: J.textMuted, marginTop: 2 },
  noteText:  { fontFamily: 'Nunito_400Regular', fontSize: 14, color: J.textMuted, lineHeight: 22 },
  noteEmpty: { fontFamily: 'Nunito_400Regular', fontSize: 13, color: J.placeholder, fontStyle: 'italic' },
  photosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  photoWrap:  { width: PHOTO_SIZE, height: PHOTO_SIZE, borderRadius: 12, overflow: 'hidden' },
  photo:      { width: '100%', height: '100%' },
  audioRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F0F7E8', borderRadius: 12,
    paddingVertical: 10, paddingHorizontal: 12,
    gap: 10, marginBottom: 6,
  },
  audioPlayIcon: { fontSize: 16 },
  audioLabel: { fontFamily: 'Nunito_600SemiBold', fontSize: 13, color: J.textPrimary },
  nlpCard: { backgroundColor: '#F0F7E8' },
  nlpRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: J.border,
  },
  nlpLabel: { fontFamily: 'Nunito_400Regular', fontSize: 13, color: J.textMuted },
  nlpValue: { fontFamily: 'Nunito_600SemiBold', fontSize: 13, color: J.textPrimary },
});

export const journalIndexStyles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F7F5EE' },
  illustWrap: {
    backgroundColor: '#C8DEB0',
    alignItems: 'center',
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  illustPlaceholder: { width: '100%', height: 200 },
  illustImg: { width: '100%', height: 200, resizeMode: 'contain' },
  pageTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 28,
    color: '#2C3318',
    marginTop: 4,
    marginBottom: 8,
  },
  actionSection: { paddingHorizontal: 16, paddingTop: 20, gap: 12 },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    ...journalCardShadow,
  },
  actionCardLeft: { flex: 1, gap: 12 },
  actionCardTitle: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: '#2C3318',
    lineHeight: 20,
  },
  actionBtn: {
    backgroundColor: '#3D5C28',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 18,
    alignSelf: 'flex-start',
  },
  actionBtnText: { fontFamily: 'Nunito_700Bold', fontSize: 13, color: '#FFFFFF' },
  actionChevron: { fontSize: 24, color: '#A8B898', marginLeft: 8 },
  monthSection: { paddingHorizontal: 16, paddingTop: 28 },
  monthTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: '#2C3318',
    marginBottom: 12,
  },
  entryRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    alignItems: 'flex-start',
    gap: 14,
  },
  entryRowBorder: { borderBottomWidth: 1, borderBottomColor: '#E5E8DD' },
  entryRowToday: {
    backgroundColor: '#F0F7E8',
    borderRadius: 12,
    paddingHorizontal: 8,
  },
  dateCol: { width: 36, alignItems: 'center', paddingTop: 2 },
  dateWeekday: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 11,
    color: '#7A8C5E',
    textTransform: 'uppercase',
  },
  dateDay: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 22,
    color: '#2C3318',
    lineHeight: 26,
  },
  entryContent: { flex: 1 },
  entryText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: '#7A8C5E',
    lineHeight: 20,
  },
  entryEmpty: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: '#A8B898',
    fontStyle: 'italic',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 40,
    gap: 10,
  },
  emptyIcon:  { fontSize: 48 },
  emptyTitle: { fontFamily: 'Nunito_700Bold', fontSize: 18, color: '#2C3318' },
  emptyText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: '#7A8C5E',
    textAlign: 'center',
  },
});

export const journalFormStyles = StyleSheet.create({
  card:      { backgroundColor: J.card, borderRadius: 20, padding: 18, ...journalCardShadow },
  cardTitle: { fontFamily: 'Nunito_700Bold', fontSize: 15, color: J.textPrimary, marginBottom: 12 },

  moodCard:   { paddingVertical: 14 },
  moodRow:    { flexDirection: 'row', alignItems: 'center', gap: 12 },
  moodEmoji:  { fontSize: 36 },
  moodName:   { fontFamily: 'Nunito_700Bold', fontSize: 15, color: J.textPrimary },
  moodDesc:   { fontFamily: 'Nunito_400Regular', fontSize: 12, color: J.textMuted, marginTop: 2 },
  moodChange: { fontFamily: 'Nunito_600SemiBold', fontSize: 13, color: J.accent },
  moodChevron:{ fontSize: 22, color: J.placeholder },

  textInput: {
    fontFamily: 'Nunito_400Regular', fontSize: 14, color: J.textPrimary,
    minHeight: 120, lineHeight: 22,
  },
  charCount: {
    fontFamily: 'Nunito_400Regular', fontSize: 11,
    color: J.placeholder, textAlign: 'right', marginTop: 6,
  },

  photosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  photoWrap:  { width: PHOTO_SIZE, height: PHOTO_SIZE, borderRadius: 12, overflow: 'hidden' },
  photo:      { width: '100%', height: '100%' },
  photoRemove: {
    position: 'absolute', top: 4, right: 4,
    backgroundColor: 'rgba(0,0,0,0.45)',
    width: 20, height: 20, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  photoRemoveText: { color: '#fff', fontSize: 14, lineHeight: 20 },
  photoAdd: {
    width: PHOTO_SIZE, height: PHOTO_SIZE, borderRadius: 12,
    backgroundColor: J.bg, borderWidth: 1.5, borderColor: J.border,
    borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: 4,
  },
  photoAddIcon:  { fontSize: 22 },
  photoAddLabel: { fontFamily: 'Nunito_400Regular', fontSize: 10, color: J.textMuted },

  audioList: { gap: 8, marginBottom: 14 },
  audioRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F0F7E8', borderRadius: 12,
    paddingVertical: 10, paddingHorizontal: 12, gap: 10,
  },
  audioPlayBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: J.accent, alignItems: 'center', justifyContent: 'center',
  },
  audioPlayIcon: { color: '#fff', fontSize: 12 },
  audioLabel:    { flex: 1, fontFamily: 'Nunito_600SemiBold', fontSize: 13, color: J.textPrimary },
  audioDeleteBtn: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#FADBD8', alignItems: 'center', justifyContent: 'center',
  },
  audioDeleteIcon: { color: J.deleteRed, fontSize: 18, lineHeight: 22 },

  voiceWrap: { alignItems: 'center', paddingTop: 4, gap: 10 },
  micBtn: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: J.micBg, alignItems: 'center', justifyContent: 'center', ...journalCardShadow,
  },
  micBtnActive: { backgroundColor: J.micActive },
  micIcon:      { fontSize: 26 },
  voiceHint: { fontFamily: 'Nunito_400Regular', fontSize: 13, color: J.textMuted },
});

