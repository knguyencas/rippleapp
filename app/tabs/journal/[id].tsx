import { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image,
  ActivityIndicator, Alert, Animated, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import JournalEntryForm, { JournalFormData, AudioItem } from '../../../components/journal/JournalEntryForm';
import {
  J,
  journalHeaderStyles as h,
  journalToastStyles as t,
  journalDetailStyles as s
} from '../../../styles/journal/journal.styles';
import { MOODS } from '../../../components/mood/MoodWheel';
import api from '../../../services/core/api';

export default function LogDetailScreen() {
  const router = useRouter();
  const { id, edit } = useLocalSearchParams<{ id: string; edit?: string }>();

  const [log,       setLog]       = useState<any>(null);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [isEditing, setIsEditing] = useState(edit === 'true');


  const [formData, setFormData] = useState<JournalFormData>({
    mood: null, note: '', photos: [], audios: [],
  });

  const [toastVisible, setToastVisible] = useState(false);
  const toastAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => { fetchLog(); }, [id]);

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

  const fetchLog = async (showErrorAlert = true) => {
    try {
      const res  = await api.get(`/logs/${id}`);
      const data = res.data;
      setLog(data);

      setFormData({
        mood:   MOODS.find(m => m.name === data.mood) ?? null,
        note:   data.note ?? '',
        photos: data.photos ?? [],
        audios: (data.audios ?? []) as AudioItem[],
      });
    } catch {
      if (showErrorAlert && loading) {
        Alert.alert('Lỗi', 'Không tải được nhật ký');
        router.navigate('/tabs/journal');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (): Promise<boolean> => {
    setSaving(true);
    try {
      await api.put(`/logs/${id}`, {
        mood:      formData.mood?.name  ?? log.mood,
        moodScore: formData.mood?.score ?? log.moodScore,
        factors:   log.factors ?? [],
        note:      formData.note.trim() || null,
      });
      setIsEditing(false);
      setToastVisible(true);
      fetchLog();
      return true;
    } catch {
      Alert.alert('Lỗi', 'Không lưu được, thử lại nhé!');
      return false;
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

  const isDirty = () => {
    if (!log) return false;
    const origNote = log.note ?? '';
    const origMood = log.mood ?? '';
    return formData.note !== origNote || (formData.mood?.name ?? '') !== origMood;
  };

  const handleBack = () => {
    if (isEditing && isDirty()) {
      Alert.alert(
        'Lưu thay đổi?',
        'Bạn đã chỉnh sửa nhật ký. Bạn có muốn lưu lại không?',
        [
          { text: 'Tiếp tục sửa', style: 'cancel' },
          {
            text: 'Không lưu', style: 'destructive',
            onPress: () => router.navigate('/tabs/journal'),
          },
          {
            text: 'Lưu',
            onPress: async () => {
              const ok = await handleSave();
              if (!ok) return;
            },
          },
        ]
      );
      return;
    }
    router.navigate('/tabs/journal');
  };

  if (loading) {
    return (
      <SafeAreaView style={s.safe}>
        <ActivityIndicator style={s.loadingIndicator} color={J.accent} />
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


      <View style={h.header}>
        <TouchableOpacity onPress={handleBack} style={h.headerBtn}>
          <Text style={h.headerBtnText}>‹</Text>
        </TouchableOpacity>

        <Text style={h.headerDate} numberOfLines={1}>{dateStr}</Text>

        <View style={h.headerRight}>
          <TouchableOpacity style={h.headerBtn} onPress={handleDelete}>
            <Text style={[h.headerBtnText, s.deleteIcon]}>🗑</Text>
          </TouchableOpacity>

          {isToday && (
            isEditing ? (
              <TouchableOpacity
                style={[h.saveBtn, saving && h.saveBtnOff]}
                onPress={handleSave}
                disabled={saving}
              >
                <Text style={h.saveBtnText}>{saving ? '…' : '✓'}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={h.editBtn} onPress={() => setIsEditing(true)}>
                <Text style={h.editBtnText}>E</Text>
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
        {isEditing ? (

          <JournalEntryForm
            initialMood={formData.mood}
            initialNote={formData.note}
            initialPhotos={formData.photos}
            initialAudios={formData.audios}
            onChange={setFormData}
          />
        ) : (

          <>

            <View style={[s.card, formData.mood && { backgroundColor: formData.mood.color + '33' }]}>
              <View style={s.moodRow}>
                <Text style={s.moodEmoji}>{formData.mood?.emoji ?? ''}</Text>
                <View style={s.flex1}>
                  <Text style={s.moodName}>{formData.mood?.name ?? log.mood ?? 'Chưa có tâm trạng'}</Text>
                  <Text style={s.moodDesc}>{formData.mood?.desc ?? ''}</Text>
                </View>
              </View>
            </View>


            <View style={s.card}>
              <Text style={s.cardTitle}>Nhật ký</Text>
              {formData.note ? (
                <Text style={s.noteText}>{formData.note}</Text>
              ) : (
                <Text style={s.noteEmpty}>Không có ghi chú</Text>
              )}
            </View>


            {formData.photos.length > 0 && (
              <View style={s.card}>
                <Text style={s.cardTitle}>Ảnh của bạn</Text>
                <View style={s.photosGrid}>
                  {formData.photos.map((photo, i) => (
                    <View key={i} style={s.photoWrap}>
                      <Image source={{ uri: photo.uri }} style={s.photo} />
                    </View>
                  ))}
                </View>
              </View>
            )}


            {formData.audios.length > 0 && (
              <View style={s.card}>
                <Text style={s.cardTitle}>Ghi âm</Text>
                {formData.audios.map((audio, i) => (
                  <View key={i} style={s.audioRow}>
                    <Text style={s.audioPlayIcon}>MIC</Text>
                    <Text style={s.audioLabel}>{audio.label}</Text>
                  </View>
                ))}
              </View>
            )}


            {log.nlpEmotion && (
              <View style={[s.card, s.nlpCard]}>
                <Text style={s.cardTitle}>AI phân tích cảm xúc</Text>
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
                    <Text style={[s.nlpValue, s.alertValue]}>{log.alertLevel}</Text>
                  </View>
                )}
              </View>
            )}
          </>
        )}

        <View style={s.bottomSpacer} />
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
            <Text style={t.toastTitle}>Đã lưu thay đổi!</Text>
            <Text style={t.toastSub}>Đang quay lại...</Text>
          </View>
        </Animated.View>
      )}

    </SafeAreaView>
  );
}


