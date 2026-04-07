import { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity,
  Alert, Animated, ScrollView, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import JournalEntryForm, { JournalFormData } from '../../../components/journal/JournalEntryForm';
import api from '../../../services/api';
import { J, journalHeaderStyles as h, journalToastStyles as t, journalNewStyles as s } from '../../../styles/journal.styles';

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
    Animated.timing(toastAnim, { toValue: 1, duration: 300, useNativeDriver: Platform.OS !== 'web' }).start();
    const timer = setTimeout(() => {
      Animated.timing(toastAnim, { toValue: 0, duration: 250, useNativeDriver: Platform.OS !== 'web' })
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

      <View style={h.header}>
        <TouchableOpacity
          onPress={() => router.navigate('/tabs/journal')}
          style={h.headerBtn}
        >
          <Text style={h.headerBtnText}>‹</Text>
        </TouchableOpacity>

        <Text style={h.headerDate}>{dateStr}</Text>

        <View style={h.headerRight}>
          <TouchableOpacity
            style={h.headerBtn}
            onPress={() =>
              Alert.alert('Xoá nhật ký?', 'Nội dung chưa được lưu sẽ mất.', [
                { text: 'Huỷ', style: 'cancel' },
                { text: 'Xoá', style: 'destructive', onPress: () => router.navigate('/tabs/journal') },
              ])
            }
          >
            <Text style={[h.headerBtnText, { color: J.deleteRed, fontSize: 18 }]}>X</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[h.saveBtn, !canSave && h.saveBtnOff]}
            onPress={handleSubmit}
            disabled={loading || !canSave}
          >
            <Text style={h.saveBtnText}>{loading ? '…' : '✓'}</Text>
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
          style={[t.toast, {
            opacity: toastAnim,
            transform: [{ translateY: toastAnim.interpolate({ inputRange: [0,1], outputRange: [20,0] }) }],
          }]}
        >
          <Text style={t.toastIcon}>OK</Text>
          <View>
            <Text style={t.toastTitle}>Đã lưu nhật ký!</Text>
            <Text style={t.toastSub}>Đang quay lại...</Text>
          </View>
        </Animated.View>
      )}

    </SafeAreaView>
  );
}
