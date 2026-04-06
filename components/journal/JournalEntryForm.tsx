import { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  Image, StyleSheet, Alert, Animated, Platform,
  Dimensions, ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import MoodWheel, { MOODS } from '../mood/MoodWheel';

const { width } = Dimensions.get('window');
const PHOTO_SIZE = (width - 48 - 12) / 3;

export const J = {
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
};

export const cardShadow: any = Platform.OS === 'web'
  ? { boxShadow: '0 2px 8px rgba(44,62,45,0.08)' }
  : { shadowColor: '#2C3E2D', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 };

export interface AudioItem {
  uri: string;
  label: string; // "Ghi âm 1", "Ghi âm 2", ...
}

export interface JournalFormData {
  mood:   typeof MOODS[0] | null;
  note:   string;
  photos: string[];
  audios: AudioItem[];
}

interface Props {
  initialMood?:   typeof MOODS[0] | null;
  initialNote?:   string;
  initialPhotos?: string[];
  initialAudios?: AudioItem[];
  onChange?: (data: JournalFormData) => void;
}

export default function JournalEntryForm({
  initialMood   = null,
  initialNote   = '',
  initialPhotos = [],
  initialAudios = [],
  onChange,
}: Props) {
  const [showWheel,    setShowWheel]    = useState(false);
  const [selectedMood, setSelectedMood] = useState<typeof MOODS[0] | null>(initialMood);
  const [note,         setNote]         = useState(initialNote);
  const [photos,       setPhotos]       = useState<string[]>(initialPhotos);
  const [audios,       setAudios]       = useState<AudioItem[]>(initialAudios);

  // Recording state
  const [recording,   setRecording]   = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const recordAnim = useRef(new Animated.Value(1)).current;

  // Playback state: which audio is currently playing
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  // Sync initialMood when parent loads data (edit mode)
  useEffect(() => {
    if (initialMood) setSelectedMood(initialMood);
  }, [initialMood?.name]);

  useEffect(() => {
    if (initialNote) setNote(initialNote);
  }, [initialNote]);

  useEffect(() => {
    if (initialPhotos.length) setPhotos(initialPhotos);
  }, [initialPhotos.length]);

  useEffect(() => {
    if (initialAudios.length) setAudios(initialAudios);
  }, [initialAudios.length]);

  // Notify parent of any change
  useEffect(() => {
    onChange?.({ mood: selectedMood, note, photos, audios });
  }, [selectedMood, note, photos, audios]);

  // Recording pulse animation
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

  // Cleanup sound on unmount
  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  /* ─── Actions ─── */

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
      setPhotos(prev => [...prev, ...uris].slice(0, 9));
    }
  };

  const removePhoto = (idx: number) =>
    setPhotos(prev => prev.filter((_, i) => i !== idx));

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Cần quyền microphone', 'Vui lòng cấp quyền truy cập microphone.');
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording: newRec } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(newRec);
      setIsRecording(true);
    } catch (e) {
      Alert.alert('Lỗi', 'Không thể bắt đầu thu âm.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      if (uri) {
        const label = `Ghi âm ${audios.length + 1}`;
        setAudios(prev => [...prev, { uri, label }]);
      }
    } catch (e) {
      console.error('Stop recording error:', e);
    } finally {
      setRecording(null);
      setIsRecording(false);
    }
  };

  const removeAudio = (idx: number) => {
    // Stop if playing this one
    if (playingIdx === idx) {
      soundRef.current?.stopAsync();
      setPlayingIdx(null);
    }
    setAudios(prev => {
      const next = prev.filter((_, i) => i !== idx);
      // Re-label remaining
      return next.map((a, i) => ({ ...a, label: `Ghi âm ${i + 1}` }));
    });
  };

  const togglePlay = async (idx: number) => {
    if (playingIdx === idx) {
      await soundRef.current?.stopAsync();
      await soundRef.current?.unloadAsync();
      soundRef.current = null;
      setPlayingIdx(null);
      return;
    }

    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });

      const { sound } = await Audio.Sound.createAsync(
        { uri: audios[idx].uri },
        { shouldPlay: true }
      );
      soundRef.current = sound;
      setPlayingIdx(idx);

      sound.setOnPlaybackStatusUpdate(status => {
        if (status.isLoaded && status.didJustFinish) {
          setPlayingIdx(null);
          sound.unloadAsync();
          soundRef.current = null;
        }
      });
    } catch {
      setPlayingIdx(null);
      Alert.alert('Lỗi', 'Không thể phát file âm thanh.');
    }
  };

  /* ─── Render ─── */

  return (
    <View style={{ gap: 14 }}>

      {/* Mood card */}
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
            <Text style={s.moodChange}>Đổi ›</Text>
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

      {/* Note */}
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

      {/* Photos */}
      <View style={s.card}>
        <Text style={s.cardTitle}>Ảnh của bạn</Text>
        <View style={s.photosGrid}>
          {photos.map((uri, i) => (
            <View key={i} style={s.photoWrap}>
              <Image source={{ uri }} style={s.photo} />
              <TouchableOpacity style={s.photoRemove} onPress={() => removePhoto(i)}>
                <Text style={s.photoRemoveText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
          {photos.length < 9 && (
            <TouchableOpacity style={s.photoAdd} onPress={pickImage}>
              <Text style={s.photoAddIcon}>🖼</Text>
              <Text style={s.photoAddLabel}>Thêm ảnh</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Voice recordings */}
      <View style={s.card}>
        <Text style={s.cardTitle}>Ghi âm</Text>

        {/* Existing recordings list */}
        {audios.length > 0 && (
          <View style={s.audioList}>
            {audios.map((audio, i) => (
              <View key={i} style={s.audioRow}>
                <TouchableOpacity style={s.audioPlayBtn} onPress={() => togglePlay(i)}>
                  <Text style={s.audioPlayIcon}>
                    {playingIdx === i ? '⏹' : '▶'}
                  </Text>
                </TouchableOpacity>
                <Text style={s.audioLabel}>{audio.label}</Text>
                <TouchableOpacity style={s.audioDeleteBtn} onPress={() => removeAudio(i)}>
                  <Text style={s.audioDeleteIcon}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Record button */}
        <View style={s.voiceWrap}>
          <Animated.View style={{ transform: [{ scale: recordAnim }] }}>
            <TouchableOpacity
              style={[s.micBtn, isRecording && s.micBtnActive]}
              onPress={isRecording ? stopRecording : startRecording}
              activeOpacity={0.85}
            >
              <Text style={s.micIcon}>🎙</Text>
            </TouchableOpacity>
          </Animated.View>
          <Text style={s.voiceHint}>
            {isRecording
              ? '● Đang thu âm… nhấn để dừng'
              : audios.length > 0
                ? `Nhấn để thêm ghi âm ${audios.length + 1}`
                : 'Nhấn để bắt đầu thu âm'}
          </Text>
        </View>
      </View>

      {/* MoodWheel overlay */}
      {showWheel && (
        <MoodWheel
          onConfirm={mood => { setSelectedMood(mood); setShowWheel(false); }}
          onClose={() => setShowWheel(false)}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
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

  // Mood
  moodCard:   { paddingVertical: 14 },
  moodRow:    { flexDirection: 'row', alignItems: 'center', gap: 12 },
  moodEmoji:  { fontSize: 36 },
  moodName:   { fontFamily: 'Nunito_700Bold', fontSize: 15, color: J.textPrimary },
  moodDesc:   { fontFamily: 'Nunito_400Regular', fontSize: 12, color: J.textMuted, marginTop: 2 },
  moodChange: { fontFamily: 'Nunito_600SemiBold', fontSize: 13, color: J.accent },
  moodChevron:{ fontSize: 22, color: J.placeholder },

  // Note
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
    width: PHOTO_SIZE, height: PHOTO_SIZE,
    borderRadius: 12,
    backgroundColor: J.bg,
    borderWidth: 1.5,
    borderColor: J.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  photoAddIcon:  { fontSize: 22 },
  photoAddLabel: { fontFamily: 'Nunito_400Regular', fontSize: 10, color: J.textMuted },

  // Audio list
  audioList: { gap: 8, marginBottom: 14 },
  audioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F7E8',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 10,
  },
  audioPlayBtn: {
    width: 32, height: 32,
    borderRadius: 16,
    backgroundColor: J.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioPlayIcon: { color: '#fff', fontSize: 12 },
  audioLabel: {
    flex: 1,
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 13,
    color: J.textPrimary,
  },
  audioDeleteBtn: {
    width: 28, height: 28,
    borderRadius: 14,
    backgroundColor: '#FADBD8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioDeleteIcon: { color: J.deleteRed, fontSize: 18, lineHeight: 22 },

  // Voice record
  voiceWrap: { alignItems: 'center', paddingTop: 4, gap: 10 },
  micBtn: {
    width: 60, height: 60,
    borderRadius: 30,
    backgroundColor: J.micBg,
    alignItems: 'center',
    justifyContent: 'center',
    ...cardShadow,
  },
  micBtnActive: { backgroundColor: J.micActive },
  micIcon:  { fontSize: 26 },
  voiceHint: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 13,
    color: J.textMuted,
  },
});
