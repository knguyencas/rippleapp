import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { authStyles as styles } from '../../styles/auth.styles';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Colors } from '../../constants/colors';
import api from '../../services/api';
import { useAuthStore } from '../../stores/auth.store';

export default function DisplayNameScreen() {
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuthStore();

  const handleSave = async () => {
    if (!displayName.trim()) {
      router.replace('/(tabs)/home');
      return;
    }
    setLoading(true);
    try {
      await api.put('/users/me', { displayName }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      router.replace('/(tabs)/home');
    } catch {
      router.replace('/(tabs)/home');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.wave1} />
      <View style={styles.wave2} />

      <View style={[styles.headerCentered, { paddingTop: 120 }]}>
        <Text style={styles.emoji}>👋</Text>
        <Text style={styles.titleCentered}>Bạn muốn được gọi là gì?</Text>
        <Text style={styles.subtitleCentered}>
          Có thể để trống, mình sẽ dùng username của bạn
        </Text>
      </View>

      <View style={[styles.form, { paddingHorizontal: 20 }]}>
        <Input
          label="Tên hiển thị"
          value={displayName}
          onChangeText={setDisplayName}
          placeholder={user?.username || 'Tên của bạn'}
        />

        <Button
          title={loading ? 'Đang lưu...' : 'Tiếp tục'}
          onPress={handleSave}
          disabled={loading}
        />

        <TouchableOpacity
          style={styles.btnSecondary}
          onPress={() => router.replace('/(tabs)/home')}
        >
          <Text style={[styles.btnSecondaryText, { color: Colors.muted }]}>
            Bỏ qua
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}