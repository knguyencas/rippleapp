import { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import JournalEntryForm, {
  JournalFormData, AudioItem, J, cardShadow,
} from '../../../components/journal/JournalEntryForm';
import { MOODS } from '../../../components/mood/MoodWheel';
import api from '../../../services/api';

export default function LogDetailScreen() {
  const router = useRouter();
  const { id, edit } = useLocalSearchParams<{ id: string; edit?: string }>();

  const [log,       setLog]       = useState<any>(null);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [isEditing, setIsEditing] = useState(edit === 'true');

  // Form data managed by JournalEntryForm
  const [formData, setFormData] = useState<JournalFormData>({
    mood: null, note: '', photos: [], audios: [],
  });

  const [toastVisible, setToastVisible] = useState(false);
  const toastAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => { fetchLog(); }, [id]);

  useEffect(() => {
    if (!toastVisible) return;
    toastAnim.setValue(0);
    Animated.timing(toastAnim, { toValue: 1, duration: 300, useNativeDriver: false }).start();
    const timer = setTimeout(() => {
      Animated.timing(toastAnim, { toValue: 0, duration: 250, useNativeDriver: false })
        .start(() => { setToastVisible(false); router.navigate('/tabs/journal'); });
    }, 1800);
    return () => clearTimeout(timer);
  }, [toastVisible]);

  const fetchLog = async () => {
    try {
      const res  = await api.get(`/logs/${id}`);
      const data = res.data;
      setLog(data);
      // Pre-fill form with existing data
      setFormData({
        mood:   MOODS.find(m => m.name === data.mood) ?? null,
        note:   data.note ?? '',
        photos: data.photos ?? [],
        audios: (data.audios ?? []) as AudioItem[],
      });
    } catch {
      Alert.alert('Lỗi', 'Không tải được nhật ký');
      router.navigate('/tabs/journal');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/logs/${id}`, {
        mood:      formData.mood?.name  ?? log.mood,
        moodScore: formData.mood?.score ?? log.moodScore,
        factors:   log.factors ?? [],
        note:      formData.note.trim() || null,
      });
      setIsEditing(false);
      await fetchLog();
      setToastVisible(true);
    } catch {
      Alert.alert('Lỗi', 'Không lưu được, thử lại nhé!');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Xoá nhật ký?',
      'Hành động này không thể hoàn tác.',
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá', style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/logs/${id}`);
              router.navigate('/tabs/journal');
            } catch {
              Alert.alert('Lỗi', 'Không xoá được.');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={s.safe}>
        <ActivityIndicator style={{ flex: 1 }} color={J.accent} />
      </SafeAreaView>
    );
  }

  const date    = new Date(log.createdAt);
  const dateStr = date.toLocaleDateString('vi-VN', {
    weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
  });
  const isToday = new Date().toDateString() === date.toDateString();

  return (
    <SafeAreaView style={s.safe}>

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.navigate('/tabs/journal')} style={s.headerBtn}>
          <Text style={s.headerBtnText}>‹</Text>
        </TouchableOpacity>

        <Text style={s.headerDate} numberOfLines={1}>{dateStr}</Text>

        <View style={s.headerRight}>
          <TouchableOpacity style={s.headerBtn} onPress={handleDelete}>
            <Text style={[s.headerBtnText, { color: J.deleteRed, fontSize: 18 }]}>🗑</Text>
          </TouchableOpacity>

          {isToday && (
            isEditing ? (
              <TouchableOpacity
                style={[s.saveBtn, saving && s.saveBtnOff]}
                onPress={handleSave}
                disabled={saving}
              >
                <Text style={s.saveBtnText}>{saving ? '…' : '✓'}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={s.editBtn} onPress={() => setIsEditing(true)}>
                <Text style={s.editBtnText}>✏️</Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {isEditing ? (
          /* ── Edit mode: full JournalEntryForm ── */
          <JournalEntryForm
            initialMood={formData.mood}
            initialNote={formData.note}
            initialPhotos={formData.photos}
            initialAudios={formData.audios}
            onChange={setFormData}
          />
        ) : (
          /* ── View mode ── */
          <>
            {/* Mood */}
            <View style={[s.card, formData.mood && { backgroundColor: formData.mood.color + '33' }]}>
              <View style={s.moodRow}>
                <Text style={s.moodEmoji}>{formData.mood?.emoji ?? '💭'}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={s.moodName}>{formData.mood?.name ?? log.mood ?? 'Chưa có tâm trạng'}</Text>
                  <Text style={s.moodDesc}>{formData.mood?.desc ?? ''}</Text>
                </View>
              </View>
            </View>

            {/* Note */}
            <View style={s.card}>
              <Text style={s.cardTitle}>Nhật ký</Text>
              {formData.note ? (
                <Text style={s.noteText}>{formData.note}</Text>
              ) : (
                <Text style={s.noteEmpty}>Không có ghi chú</Text>
              )}
            </View>

            {/* Photos */}
            {formData.photos.length > 0 && (
              <View style={s.card}>
                <Text style={s.cardTitle}>Ảnh của bạn</Text>
                <View style={s.photosGrid}>
                  {formData.photos.map((uri, i) => (
                    <View key={i} style={s.photoWrap}>
                      <Animated.Image source={{ uri }} style={s.photo} />
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Audios */}
            {formData.audios.length > 0 && (
              <View style={s.card}>
                <Text style={s.cardTitle}>Ghi âm</Text>
                {formData.audios.map((audio, i) => (
                  <View key={i} style={s.audioRow}>
                    <Text style={s.audioPlayIcon}>🎙</Text>
                    <Text style={s.audioLabel}>{audio.label}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* NLP analysis (if available) */}
            {log.nlpEmotion && (
              <View style={[s.card, s.nlpCard]}>
                <Text style={s.cardTitle}>🧠 AI phân tích cảm xúc</Text>
                <View style={s.nlpRow}>
                  <Text style={s.nlpLabel}>Cảm xúc</Text>
                  <Text style={s.nlpValue}>{log.nlpEmotion}</Text>
                </View>
                {log.nlpScore != null && (
                  <View style={s.nlpRow}>
                    <Text style={s.nlpLabel}>PHQ score</Text>
                    <Text style={s.nlpValue}>{Number(log.nlpScore).toFixed(1)}</Text>
                  </View>
                )}
                {log.alertLevel && (
                  <View style={s.nlpRow}>
                    <Text style={s.nlpLabel}>Mức độ</Text>
                    <Text style={[s.nlpValue, { color: J.deleteRed }]}>{log.alertLevel}</Text>
                  </View>
                )}
              </View>
            )}
          </>
        )}

        <View style={{ height: 48 }} />
      </ScrollView>

      {/* Toast */}
      {toastVisible && (
        <Animated.View
          style={[s.toast, {
            opacity: toastAnim,
            transform: [{ translateY: toastAnim.interpolate({ inputRange: [0,1], outputRange: [20,0] }) }],
          }]}
        >
          <Text style={s.toastIcon}>✅</Text>
          <View>
            <Text style={s.toastTitle}>Đã lưu thay đổi!</Text>
            <Text style={s.toastSub}>Đang quay lại...</Text>
          </View>
        </Animated.View>
      )}

    </SafeAreaView>
  );
}

const PHOTO_SIZE = 90;

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: J.bg },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
  },
  headerBtn:     { padding: 6, minWidth: 36, alignItems: 'center' },
  headerBtnText: { fontSize: 26, color: J.textPrimary, fontFamily: 'Nunito_600SemiBold', lineHeight: 30 },
  headerDate: {
    flex: 1, textAlign: 'center',
    fontFamily: 'Nunito_600SemiBold', fontSize: 14, color: J.textPrimary,
  },
  headerRight:  { flexDirection: 'row', alignItems: 'center', gap: 4 },
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

  scrollContent: { paddingHorizontal: 16, paddingTop: 4, gap: 14 },

  // View mode cards
  card: {
    backgroundColor: J.card, borderRadius: 20, padding: 18, ...cardShadow,
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

  toast: {
    position: 'absolute', bottom: 36, left: 20, right: 20, zIndex: 9999,
    backgroundColor: J.textPrimary, borderRadius: 16,
    paddingVertical: 14, paddingHorizontal: 18,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    ...cardShadow,
  },
  toastIcon:  { fontSize: 22 },
  toastTitle: { fontFamily: 'Nunito_700Bold', fontSize: 14, color: '#fff' },
  toastSub:   { fontFamily: 'Nunito_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
});
