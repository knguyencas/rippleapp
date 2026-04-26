import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '../../../constants/colors';
import { commonStyles as c } from '../../../styles/shared/common.styles';
import { profileStyles as s } from '../../../styles/profile/profile.styles';
import {
  profileEditPageStyles as ps,
  profilePageStyles as p,
} from '../../../styles/profile/profile-pages.styles';
import api from '../../../services/core/api';
import { useAuthStore } from '../../../stores/auth.store';

const AGE_OPTIONS = ['< 18', '18-22', '23-27', '28-35', '35+'];

export default function EditProfileScreen() {
  const { user, token, updateUser } = useAuthStore();
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [ageGroup, setAgeGroup] = useState<string>(user?.ageGroup ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await api.put(
        '/users/me',
        {
          displayName: displayName.trim() || null,
          ageGroup: ageGroup || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await updateUser({
        displayName: res.data?.displayName ?? null,
        ageGroup: res.data?.ageGroup ?? null,
      });

      router.back();
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Không thể lưu. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={c.safe}>
      <KeyboardAvoidingView
        style={p.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={p.scrollBottom}
          showsVerticalScrollIndicator={false}
        >
          <View style={s.header}>
            <TouchableOpacity onPress={() => router.back()} style={p.backButton}>
              <Text style={p.backButtonText}>← Quay lại</Text>
            </TouchableOpacity>
            <Text style={s.headerTitle}>Chỉnh sửa hồ sơ</Text>
          </View>

          <View style={p.content}>
            <Text style={ps.label}>Tên hiển thị</Text>
            <Text style={ps.hint}>Tên mà Ripple sẽ dùng để gọi bạn.</Text>
            <TextInput
              style={ps.input}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder={user?.username || 'Nhập tên của bạn'}
              placeholderTextColor="#9BB5C4"
              maxLength={50}
            />

            <Text style={[ps.label, ps.labelTopSpacing]}>Nhóm tuổi</Text>
            <Text style={ps.hint}>Giúp cá nhân hóa phản hồi của AI.</Text>
            <View style={ps.ageRow}>
              {AGE_OPTIONS.map((option) => {
                const selected = ageGroup === option;
                return (
                  <TouchableOpacity
                    key={option}
                    style={[ps.ageChip, selected && ps.ageChipActive]}
                    onPress={() => setAgeGroup(selected ? '' : option)}
                  >
                    <Text style={[ps.ageChipText, selected && ps.ageChipTextActive]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {error ? <Text style={ps.error}>{error}</Text> : null}

            <TouchableOpacity
              style={[ps.saveBtn, saving && ps.saveBtnDisabled]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color={Colors.textLight} />
              ) : (
                <Text style={ps.saveBtnText}>Lưu thay đổi</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
