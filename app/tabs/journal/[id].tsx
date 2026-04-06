import { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, StyleSheet, ActivityIndicator, Alert,
  Animated, Platform, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MoodWheel, { MOODS } from '../../../components/mood/MoodWheel';
import api from '../../../services/api';

const J = {
  bg:          '#EEF3EA',
  card:        '#FFFFFF',
  textPrimary: '#2C3E2D',
  textMuted:   '#7A9B7D',
  placeholder: '#B5C9B7',
  accent:      '#5B8A5E',
  deleteRed:   '#C0392B',
  border:      '#DDE8DA',
  nlpCard:     '#F0F7E8',
};

const cardShadow: any = Platform.OS === 'web'
  ? { boxShadow: '0 2px 8px rgba(44,62,45,0.08)' }
  : {
      shadowColor: '#2C3E2D',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    };

export default function LogDetailScreen() {
  const router = useRouter();
  const { id, edit } = useLocalSearchParams<{ id: string; edit?: string }>();

  const [log, setLog]           = useState<any>(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [isEditing, setIsEditing] = useState(edit === 'true');
  const [showWheel, setShowWheel] = useState(false);

  const [selectedMood, setSelectedMood] = useState<typeof MOODS[0] | null>(null);
  const [note, setNote]                 = useState('');

  const [toastVisible, setToastVisible] = useState(false);
  const toastAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => { fetchLog(); }, [id]);

  useEffect(() => {
    if (toastVisible) {
      toastAnim.setValue(0);
      Animated.timing(toastAnim, { toValue: 1, duration: 300, useNativeDriver: false }).start();
      const t = setTimeout(() => {
        Animated.timing(toastAnim, { toValue: 0, duration: 250, useNativeDriver: false })
          .start(() => { setToastVisible(false); router.navigate('/tabs/journal'); });
      }, 1800);
      return () => clearTimeout(t);
    }
  }, [toastVisible]);

  const fetchLog = async () => {
    try {
      const res  = await api.get(`/logs/${id}`);
      const data = res.data;
      setLog(data);
      setSelectedMood(MOODS.find(m => m.name === data.mood) ?? null);
      setNote(data.note ?? '');
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
        mood:      selectedMood?.name  ?? log.mood,
        moodScore: selectedMood?.score ?? log.moodScore,
        factors:   log.factors ?? [],
        note,
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

      {/* ── Header ── */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.navigate('/tabs/journal')} style={s.headerBtn}>
          <Text style={s.headerBtnText}>‹</Text>
        </TouchableOpacity>

        <Text style={s.headerDate} numberOfLines={1}>{dateStr}</Text>

        <View style={s.headerRight}>
          {/* Xoá */}
          <TouchableOpacity style={s.headerBtn} onPress={handleDelete}>
            <Text style={[s.headerBtnText, { color: J.deleteRed, fontSize: 18 }]}>🗑</Text>
          </TouchableOpacity>

          {/* Sửa / Lưu */}
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
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        <TouchableOpacity
          style={[s.card, s.moodCard, selectedMood && { backgroundColor: selectedMood.color + '33' }]}
          onPress={() => isEditing && setShowWheel(true)}
          activeOpacity={isEditing ? 0.8 : 1}
        >
          <View style={s.moodRow}>
            <Text style={s.moodEmoji}>
              {selectedMood?.emoji ?? '💭'}
            </Text>
            <View style={{ flex: 1 }}>
              <Text style={s.moodName}>
                {selectedMood?.name ?? log.mood ?? 'Chưa có tâm trạng'}
              </Text>
              <Text style={s.moodDesc}>
                {selectedMood?.desc ?? (isEditing ? 'Nhấn để thay đổi' : '')}
              </Text>
            </View>
            {isEditing && <Text style={s.moodChevron}>›</Text>}
          </View>
        </TouchableOpacity>

        <View style={s.card}>
          <Text style={s.cardTitle}>Viết về ngày hôm nay</Text>
          {isEditing ? (
            <>
              <TextInput
                style={s.textInput}
                value={note}
                onChangeText={setNote}
                multiline
                placeholder="Chia sẻ thêm về ngày hôm nay..."
                placeholderTextColor={J.placeholder}
                textAlignVertical="top"
              />
              {note.length > 0 && (
                <Text style={s.charCount}>{note.length} ký tự</Text>
              )}
            </>
          ) : (
            note ? (
              <Text style={s.noteText}>{note}</Text>
            ) : (
              <Text style={s.noteEmpty}>Không có ghi chú</Text>
            )
          )}
        </View>

        {log.photos?.length > 0 && (
          <View style={s.card}>
            <Text style={s.cardTitle}>Ảnh của bạn</Text>
            <View style={s.photosGrid}>
              {log.photos.map((uri: string, i: number) => (
                <View key={i} style={s.photoWrap}>
                  <Image source={{ uri }} style={s.photo} />
                </View>
              ))}
            </View>
          </View>
        )}

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

        <View style={{ height: 48 }} />
      </ScrollView>

      {showWheel && (
        <MoodWheel
          onConfirm={(mood) => { setSelectedMood(mood); setShowWheel(false); }}
          onClose={() => setShowWheel(false)}
        />
      )}

      {/* ── Toast ── */}
      {toastVisible && (
        <Animated.View
          style={[
            s.toast,
            {
              opacity: toastAnim,
              transform: [{
                translateY: toastAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }),
              }],
            },
          ]}
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

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerBtn: {
    padding: 6, minWidth: 36, alignItems: 'center',
  },
  headerBtnText: {
    fontSize: 26,
    color: J.textPrimary,
    fontFamily: 'Nunito_600SemiBold',
    lineHeight: 30,
  },
  headerDate: {
    flex: 1, textAlign: 'center',
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14, color: J.textPrimary,
  },
  headerRight: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
  },
  saveBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: J.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  saveBtnOff: { backgroundColor: J.border },
  saveBtnText: {
    color: '#fff', fontFamily: 'Nunito_700Bold', fontSize: 17,
  },
  editBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: J.border,
    alignItems: 'center', justifyContent: 'center',
  },
  editBtnText: { fontSize: 16 },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 4, gap: 14 },

  // Card
  card: {
    backgroundColor: J.card,
    borderRadius: 20,
    padding: 18,
    ...cardShadow,
  },
  cardTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15, color: J.textPrimary, marginBottom: 12,
  },

  // Mood
  moodCard: { paddingVertical: 14 },
  moodRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  moodEmoji: { fontSize: 36 },
  moodName: { fontFamily: 'Nunito_700Bold', fontSize: 15, color: J.textPrimary },
  moodDesc: {
    fontFamily: 'Nunito_400Regular', fontSize: 12,
    color: J.textMuted, marginTop: 2,
  },
  moodChevron: { fontSize: 22, color: J.placeholder },

  // Note
  textInput: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14, color: J.textPrimary,
    minHeight: 120, lineHeight: 22,
  },
  noteText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14, color: J.textMuted, lineHeight: 22,
  },
  noteEmpty: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13, color: J.placeholder,
    fontStyle: 'italic',
  },
  charCount: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 11, color: J.placeholder,
    textAlign: 'right', marginTop: 6,
  },

  // Photos
  photosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  photoWrap: {
    width: PHOTO_SIZE, height: PHOTO_SIZE,
    borderRadius: 12, overflow: 'hidden',
  },
  photo: { width: '100%', height: '100%' },

  // NLP
  nlpCard: { backgroundColor: J.nlpCard },
  nlpRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1, borderBottomColor: J.border,
  },
  nlpLabel: {
    fontFamily: 'Nunito_400Regular', fontSize: 13, color: J.textMuted,
  },
  nlpValue: {
    fontFamily: 'Nunito_600SemiBold', fontSize: 13, color: J.textPrimary,
  },

  // Toast
  toast: {
    position: 'absolute',
    bottom: 36, left: 20, right: 20,
    zIndex: 9999,
    backgroundColor: J.textPrimary,
    borderRadius: 16,
    paddingVertical: 14, paddingHorizontal: 18,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    ...cardShadow,
  },
  toastIcon: { fontSize: 22 },
  toastTitle: {
    fontFamily: 'Nunito_700Bold', fontSize: 14, color: '#fff',
  },
  toastSub: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2,
  },
});
