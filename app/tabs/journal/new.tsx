import { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, TextInput, Image, Dimensions, Alert, Animated, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { Colors } from '../../../constants/colors';
import MoodWheel, { MOODS } from '../../../components/mood/MoodWheel';

const cardShadow: any = Platform.OS === 'web'
  ? { boxShadow: '0 2px 8px rgba(44,62,45,0.08)' }
  : { shadowColor: '#2C3E2D', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 };
import { useAuthStore } from '../../../stores/auth.store';
import api from '../../../services/api';

const { width } = Dimensions.get('window');
const PHOTO_SIZE = (width - 48 - 12) / 3;

const J = {
  bg:          '#EEF3EA',
  card:        '#FFFFFF',
  textPrimary: '#2C3E2D',
  textMuted:   '#7A9B7D',
  placeholder: '#B5C9B7',
  accent:      '#5B8A5E',
  deleteRed:   '#C0392B',
  border:      '#DDE8DA',
  micBg:       '#6A9B6D',
  micActive:   '#C0392B',
  shadow: {
    shadowColor: '#2C3E2D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
};

export default function NewJournalScreen() {
  const [showWheel, setShowWheel]         = useState(false);
  const [selectedMood, setSelectedMood]   = useState<typeof MOODS[0] | null>(null);
  const [note, setNote]                   = useState('');
  const [photos, setPhotos]               = useState<string[]>([]);
  const [loading, setLoading]             = useState(false);

  const [recording, setRecording]         = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording]     = useState(false);
  const [audioUri, setAudioUri]           = useState<string | null>(null);
  const recordAnim                        = useRef(new Animated.Value(1)).current;

  const [toastVisible, setToastVisible]   = useState(false);
  const toastAnim                         = useRef(new Animated.Value(0)).current;

  const { token } = useAuthStore();
  const canSave = selectedMood !== null || note.trim().length > 0 || photos.length > 0 || !!audioUri;

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(recordAnim, { toValue: 1.18, duration: 600, useNativeDriver: true }),
          Animated.timing(recordAnim, { toValue: 1,    duration: 600, useNativeDriver: true }),
        ])
      ).start();
    } else {
      recordAnim.stopAnimation();
      recordAnim.setValue(1);
    }
  }, [isRecording]);

  useEffect(() => {
    if (toastVisible) {
      toastAnim.setValue(0);
      Animated.timing(toastAnim, {
        toValue: 1, duration: 300, useNativeDriver: false,
      }).start();
      const timer = setTimeout(() => {
        Animated.timing(toastAnim, {
          toValue: 0, duration: 250, useNativeDriver: false,
        }).start(() => {
          setToastVisible(false);
          router.navigate('/tabs/journal');
        });
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [toastVisible]);

  const showToast = () => setToastVisible(true);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Cần quyền truy cập', 'Vui lòng cấp quyền truy cập thư viện ảnh.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      const uris = result.assets.map(a => a.uri);
      setPhotos(prev => [...prev, ...uris].slice(0, 5));
    }
  };

  const toggleRecording = async () => {
    if (isRecording && recording) {
      try {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setAudioUri(uri ?? null);
        setRecording(null);
        setIsRecording(false);
      } catch (e) {
        console.error('Stop recording error:', e);
      }
    } else {
      try {
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Cần quyền microphone', 'Vui lòng cấp quyền truy cập microphone.');
          return;
        }
        await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
        const { recording: newRec } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        setRecording(newRec);
        setIsRecording(true);
        setAudioUri(null);
      } catch (e) {
        console.error('Start recording error:', e);
        Alert.alert('Lỗi', 'Không thể bắt đầu thu âm.');
      }
    }
  };

  const handleSubmit = async () => {
    if (!canSave) return;
    if (isRecording && recording) await toggleRecording();
    setLoading(true);
    try {
      await api.post('/logs', {
        mood:      selectedMood?.name  ?? 'neutral',
        moodScore: selectedMood?.score ?? 3,
        factors:   [],
        note:      note.trim() || null,
      });
      showToast();
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
        Alert.alert('Lỗi', `Không lưu được: ${error?.message ?? 'thử lại nhé!'}`);
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
        <TouchableOpacity onPress={() => router.navigate('/tabs/journal')} style={s.headerBtn}>
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
            <Text style={[s.saveBtnText, !canSave && s.saveBtnTextOff]}>
              {loading ? '…' : '✓'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        <TouchableOpacity
          style={[s.card, s.moodCard, selectedMood && { backgroundColor: selectedMood.color + '22' }]}
          onPress={() => setShowWheel(true)}
          activeOpacity={0.8}
        >
          {selectedMood ? (
            <View style={s.moodRow}>
              <Text style={s.moodEmoji}>{selectedMood.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.moodName}>{selectedMood.name}</Text>
                <Text style={s.moodDesc}>{selectedMood.desc}</Text>
              </View>
              <Text style={s.moodChange}>Đổi</Text>
            </View>
          ) : (
            <View style={s.moodRow}>
              <Text style={s.moodEmoji}>🎡</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.moodName}>Tâm trạng hôm nay</Text>
                <Text style={s.moodDesc}>Nhấn để chọn qua mood wheel</Text>
              </View>
              <Text style={s.moodChevron}>›</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={s.card}>
          <Text style={s.cardTitle}>Viết về ngày hôm nay</Text>
          <TextInput
            style={s.textInput}
            placeholder="Nhập những gì bạn đang nghĩ..."
            placeholderTextColor={J.placeholder}
            multiline
            value={note}
            onChangeText={setNote}
            textAlignVertical="top"
          />
          {note.length > 0 && (
            <Text style={s.charCount}>{note.length} ký tự</Text>
          )}
        </View>

        <View style={s.card}>
          <Text style={s.cardTitle}>Ảnh của bạn</Text>
          <View style={s.photosGrid}>
            {photos.map((uri, i) => (
              <View key={i} style={s.photoWrap}>
                <Image source={{ uri }} style={s.photo} />
                <TouchableOpacity
                  style={s.photoRemove}
                  onPress={() => setPhotos(prev => prev.filter((_, idx) => idx !== i))}
                >
                  <Text style={s.photoRemoveText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
            {photos.length < 5 && (
              <TouchableOpacity style={s.photoAdd} onPress={pickImage}>
                <Text style={s.photoAddIcon}>🖼</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={s.card}>
          <Text style={s.cardTitle}>Giọng nói của bạn</Text>
          <View style={s.voiceWrap}>
            <Animated.View style={{ transform: [{ scale: recordAnim }] }}>
              <TouchableOpacity
                style={[s.micBtn, isRecording && s.micBtnActive]}
                onPress={toggleRecording}
                activeOpacity={0.85}
              >
                <Text style={s.micIcon}>🎙</Text>
              </TouchableOpacity>
            </Animated.View>
            <Text style={s.voiceHint}>
              {isRecording
                ? '● Đang thu âm… nhấn để dừng'
                : audioUri
                  ? '✓ Đã thu âm xong'
                  : 'Nhấn để bắt đầu thu âm'}
            </Text>
          </View>
        </View>

        <View style={{ height: 48 }} />
      </ScrollView>

      {showWheel && (
        <MoodWheel
          onConfirm={(mood) => { setSelectedMood(mood); setShowWheel(false); }}
          onClose={() => setShowWheel(false)}
        />
      )}

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
            <Text style={s.toastTitle}>Đã lưu nhật ký!</Text>
            <Text style={s.toastSub}>Đang quay lại...</Text>
          </View>
        </Animated.View>
      )}

    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: J.bg,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerBtn: {
    padding: 6,
    minWidth: 36,
    alignItems: 'center',
  },
  headerBtnText: {
    fontSize: 26,
    color: J.textPrimary,
    fontFamily: 'Nunito_600SemiBold',
    lineHeight: 30,
  },
  headerDate: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 15,
    color: J.textPrimary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  saveBtn: {
    width: 34, height: 34,
    borderRadius: 17,
    backgroundColor: J.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnOff: {
    backgroundColor: J.border,
  },
  saveBtnText: {
    color: '#fff',
    fontFamily: 'Nunito_700Bold',
    fontSize: 17,
  },
  saveBtnTextOff: {
    color: J.placeholder,
  },

  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    gap: 14,
  },

  card: {
    backgroundColor: J.card,
    borderRadius: 20,
    padding: 18,
    ...cardShadow,
  },
  cardTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    color: J.textPrimary,
    marginBottom: 12,
  },

  moodCard: {
    paddingVertical: 14,
  },
  moodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  moodEmoji: { fontSize: 36 },
  moodName: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 15,
    color: J.textPrimary,
  },
  moodDesc: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: J.textMuted,
    marginTop: 2,
  },
  moodChange: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: J.accent,
  },
  moodChevron: {
    fontSize: 22,
    color: J.placeholder,
  },

  textInput: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: J.textPrimary,
    minHeight: 120,
    lineHeight: 22,
  },
  charCount: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 11,
    color: J.placeholder,
    textAlign: 'right',
    marginTop: 6,
  },

  // Photos
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  photoWrap: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: 12,
    overflow: 'hidden',
  },
  photo: { width: '100%', height: '100%' },
  photoRemove: {
    position: 'absolute',
    top: 4, right: 4,
    backgroundColor: 'rgba(0,0,0,0.45)',
    width: 20, height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoRemoveText: { color: '#fff', fontSize: 14, lineHeight: 20 },
  photoAdd: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: 12,
    backgroundColor: J.bg,
    borderWidth: 1.5,
    borderColor: J.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoAddIcon: { fontSize: 26 },

  // Voice
  voiceWrap: {
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  micBtn: {
    width: 64, height: 64,
    borderRadius: 32,
    backgroundColor: J.micBg,
    alignItems: 'center',
    justifyContent: 'center',
    ...cardShadow,
  },
  micBtnActive: {
    backgroundColor: J.micActive,
  },
  micIcon: { fontSize: 28 },
  voiceHint: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: J.textMuted,
  },

  // Toast
  toast: {
    position: 'absolute',
    bottom: 36,
    left: 20, right: 20,
    zIndex: 9999,
    backgroundColor: J.textPrimary,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...cardShadow,
  },
  toastIcon: { fontSize: 22 },
  toastTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    color: '#fff',
  },
  toastSub: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
});
