import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, TextInput, Image, Dimensions, Alert
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../../../constants/colors';
import MoodWheel, { MOODS } from '../../../components/mood/MoodWheel';
import { useAuthStore } from '../../../stores/auth.store';
import api from '../../../services/api';

const { width } = Dimensions.get('window');

const PROMPTS = [
  'Hôm nay bạn cảm thấy thế nào?',
  'Điều gì làm bạn vui nhất hôm nay?',
  'Bạn đang lo lắng về điều gì?',
  'Bạn tự hào về điều gì hôm nay?',
];

export default function NewJournalScreen() {
  const [showWheel, setShowWheel] = useState(false);
  const [selectedMood, setSelectedMood] = useState<typeof MOODS[0] | null>(null);
  const [note, setNote] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [activePrompt] = useState(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
  const { token } = useAuthStore();

  // Cho phép lưu nếu có bất kỳ thay đổi nào
  const canSave = selectedMood !== null || note.trim().length > 0 || photos.length > 0;

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
      setPhotos(prev => [...prev, ...uris].slice(0, 6));
    }
  };

  const handleSubmit = async () => {
    if (!canSave) return;
    setLoading(true);
    try {
      await api.post('/logs', {
        moodScore: selectedMood?.score ?? null,
        moodName: selectedMood?.name ?? null,
        moodEmoji: selectedMood?.emoji ?? null,
        note: note.trim() || null,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      router.back();
    } catch {
      router.back();
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Text style={s.backText}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>
          {new Date().toLocaleDateString('vi-VN', {
            weekday: 'long', day: 'numeric', month: 'long'
          })}
        </Text>
        <TouchableOpacity
          style={[s.saveBtn, !canSave && s.saveBtnDisabled]}
          onPress={handleSubmit}
          disabled={loading || !canSave}
        >
          <Text style={s.saveText}>{loading ? '...' : '✓'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Mood selector */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Tâm trạng hôm nay</Text>
          <TouchableOpacity
            style={[s.moodBtn, selectedMood && { backgroundColor: selectedMood.color }]}
            onPress={() => setShowWheel(true)}
          >
            {selectedMood ? (
              <View style={s.moodSelected}>
                <Text style={s.moodSelectedEmoji}>{selectedMood.emoji}</Text>
                <Text style={s.moodSelectedName}>{selectedMood.name}</Text>
                <Text style={s.moodChange}>Nhấn để thay đổi</Text>
              </View>
            ) : (
              <View style={s.moodPlaceholder}>
                <Text style={s.moodPlaceholderEmoji}>🎡</Text>
                <Text style={s.moodPlaceholderText}>Chọn tâm trạng</Text>
                <Text style={s.moodPlaceholderSub}>Nhấn để mở mood wheel</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Journal */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Ghi chú</Text>
          <View style={s.promptCard}>
            <Text style={s.promptText}>💭 {activePrompt}</Text>
          </View>
          <TextInput
            style={s.textInput}
            placeholder="Viết gì đó về ngày hôm nay..."
            placeholderTextColor={Colors.placeholder}
            multiline
            value={note}
            onChangeText={setNote}
            textAlignVertical="top"
          />
          {note.length > 0 && (
            <Text style={s.charCount}>{note.length} ký tự • NLP sẽ phân tích cảm xúc</Text>
          )}
        </View>

        {/* Photos — optional */}
        <View style={s.section}>
          <View style={s.sectionRow}>
            <Text style={s.sectionTitle}>Ảnh</Text>
            <Text style={s.optionalTag}>Tùy chọn</Text>
          </View>
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
            {photos.length < 6 && (
              <TouchableOpacity style={s.photoAdd} onPress={pickImage}>
                <Text style={s.photoAddIcon}>📸</Text>
                <Text style={s.photoAddText}>Thêm ảnh</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {showWheel && (
        <MoodWheel
          onConfirm={(mood) => {
            setSelectedMood(mood);
            setShowWheel(false);
          }}
          onClose={() => setShowWheel(false)}
        />
      )}
    </SafeAreaView>
  );
}

const PHOTO_SIZE = (width - 48 - 16) / 3;

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.foam },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: { padding: 4 },
  backText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
    color: Colors.teal,
  },
  headerTitle: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: Colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  saveBtn: {
    backgroundColor: Colors.teal,
    width: 32, height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnDisabled: { backgroundColor: Colors.border },
  saveText: {
    color: Colors.textLight,
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
  },
  scroll: { flex: 1 },
  section: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  optionalTag: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 11,
    color: Colors.textSecondary,
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 10,
  },

  // Mood
  moodBtn: {
    borderRadius: 16,
    backgroundColor: Colors.surface,
    padding: 20,
    alignItems: 'center',
  },
  moodSelected: { alignItems: 'center' },
  moodSelectedEmoji: { fontSize: 48, marginBottom: 8 },
  moodSelectedName: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 18,
    color: Colors.textLight,
    marginBottom: 4,
  },
  moodChange: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  moodPlaceholder: { alignItems: 'center' },
  moodPlaceholderEmoji: { fontSize: 40, marginBottom: 8 },
  moodPlaceholderText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  moodPlaceholderSub: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
  },

  // Journal
  promptCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  promptText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  textInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    fontFamily: 'Nunito_400Regular',
    fontSize: 15,
    color: Colors.textPrimary,
    minHeight: 140,
    lineHeight: 22,
  },
  charCount: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 6,
    textAlign: 'right',
  },

  // Photos
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  photoWrap: {
    width: PHOTO_SIZE, height: PHOTO_SIZE,
    borderRadius: 10,
    overflow: 'hidden',
  },
  photo: { width: '100%', height: '100%' },
  photoRemove: {
    position: 'absolute',
    top: 4, right: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 20, height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoRemoveText: {
    color: '#fff', fontSize: 14, lineHeight: 20,
  },
  photoAdd: {
    width: PHOTO_SIZE, height: PHOTO_SIZE,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  photoAddIcon: { fontSize: 24 },
  photoAddText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 11,
    color: Colors.textSecondary,
  },
});