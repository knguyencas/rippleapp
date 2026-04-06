import { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Alert, Animated, ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import JournalEntryForm, { JournalFormData, J, cardShadow } from '../../../components/journal/JournalEntryForm';
import api from '../../../services/api';

export default function NewJournalScreen() {
  const [formData, setFormData] = useState<JournalFormData>({
    mood: null, note: '', photos: [], audios: [],
  });
  const [loading, setLoading]         = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const toastAnim = useRef(new Animated.Value(0)).current;

  const canSave = !!(
    formData.mood ||
    formData.note.trim() ||
    formData.photos.length ||
    formData.audios.length
  );

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

  const handleSubmit = async () => {
    if (!canSave || loading) return;
    setLoading(true);
    try {
      await api.post('/logs', {
        mood:      formData.mood?.name  ?? 'neutral',
        moodScore: formData.mood?.score ?? 3,
        factors:   [],
        note:      formData.note.trim() || null,
      });
      setToastVisible(true);
    } catch (error: any) {
      if (error?.response?.status === 409) {
        const existingId = error.response.data?.existingId;
        Alert.alert(
          'Đã có nhật ký hôm nay',
          'Bạn muốn chỉnh sửa không?',
          [
            { text: 'Huỷ', style: 'cancel' },
            { text: 'Chỉnh sửa', onPress: () => router.replace(`/tabs/journal/${existingId}?edit=true`) },
          ]
        );
      } else {
        Alert.alert('Lỗi', 'Không lưu được, thử lại nhé!');
      }
    } finally {
      setLoading(false);
    }
  };

  const dateStr = new Date().toLocaleDateString('vi-VN', {
    weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <SafeAreaView style={s.safe}>

      <View style={s.header}>
        <TouchableOpacity
          onPress={() => router.navigate('/tabs/journal')}
          style={s.headerBtn}
        >
          <Text style={s.headerBtnText}>‹</Text>
        </TouchableOpacity>

        <Text style={s.headerDate}>{dateStr}</Text>

        <View style={s.headerRight}>
          <TouchableOpacity
            style={s.headerBtn}
            onPress={() =>
              Alert.alert('Xoá nhật ký?', 'Nội dung chưa được lưu sẽ mất.', [
                { text: 'Huỷ', style: 'cancel' },
                { text: 'Xoá', style: 'destructive', onPress: () => router.navigate('/tabs/journal') },
              ])
            }
          >
            <Text style={[s.headerBtnText, { color: J.deleteRed, fontSize: 18 }]}>🗑</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.saveBtn, !canSave && s.saveBtnOff]}
            onPress={handleSubmit}
            disabled={loading || !canSave}
          >
            <Text style={s.saveBtnText}>{loading ? '…' : '✓'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <JournalEntryForm onChange={setFormData} />
        <View style={{ height: 48 }} />
      </ScrollView>

      {toastVisible && (
        <Animated.View
          style={[s.toast, {
            opacity: toastAnim,
            transform: [{ translateY: toastAnim.interpolate({ inputRange: [0,1], outputRange: [20,0] }) }],
          }]}
        >
          <Text style={s.toastIcon}>✅</Text>
          <View>
            <Text style={s.toastTitle}>Đã lưu nhật ký!</Text>
            <Text style={s.toastSub}>Đang quay lại...</Text>
          </View>
        </Animated.View>
      )}

    </SafeAreaView>
  );
}

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
    fontFamily: 'Nunito_600SemiBold', fontSize: 15, color: J.textPrimary,
  },
  headerRight:   { flexDirection: 'row', alignItems: 'center', gap: 4 },
  saveBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: J.accent, alignItems: 'center', justifyContent: 'center',
  },
  saveBtnOff: { backgroundColor: J.border },
  saveBtnText: { color: '#fff', fontFamily: 'Nunito_700Bold', fontSize: 17 },

  scrollContent: { paddingHorizontal: 16, paddingTop: 4 },

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
