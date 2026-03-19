import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';
import { authStyles as styles } from '../../styles/auth.styles';
import api from '../../services/api';
import { useAuthStore } from '../../stores/auth.store';

export default function RegisterScreen() {
  const [form, setForm] = useState({
    email: '',
    username: '',
    password: '',
    city: '',
    ageGroup: '18-22',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setAuth = useAuthStore((state) => state.setAuth);

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleRegister = async () => {
    if (!form.email || !form.username || !form.password) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/register', form);
      await setAuth(res.data.token, res.data.user);
      router.replace('/(tabs)/home');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  const ageGroups = ['< 18', '18-22', '23-27', '28-35', '35+'];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.wave1} />
        <View style={styles.wave2} />

        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>← Quay lại</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Tạo tài khoản</Text>
          <Text style={styles.subtitle}>Bắt đầu hành trình cảm xúc của bạn</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="email@example.com"
              placeholderTextColor={Colors.placeholder}
              value={form.email}
              onChangeText={(v) => update('email', v)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tên người dùng</Text>
            <TextInput
              style={styles.input}
              placeholder="username"
              placeholderTextColor={Colors.placeholder}
              value={form.username}
              onChangeText={(v) => update('username', v)}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mật khẩu</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={Colors.placeholder}
              value={form.password}
              onChangeText={(v) => update('password', v)}
              secureTextEntry
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Thành phố (không bắt buộc)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ho Chi Minh City"
              placeholderTextColor={Colors.placeholder}
              value={form.city}
              onChangeText={(v) => update('city', v)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Độ tuổi</Text>
            <View style={styles.ageRow}>
              {ageGroups.map((age) => (
                <TouchableOpacity
                  key={age}
                  style={[styles.ageBtn, form.ageGroup === age && styles.ageBtnActive]}
                  onPress={() => update('ageGroup', age)}
                >
                  <Text style={[
                    styles.ageBtnText,
                    form.ageGroup === age && styles.ageBtnTextActive
                  ]}>
                    {age}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.btnPrimary, loading && styles.btnDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.btnText}>
              {loading ? 'Đang tạo tài khoản...' : 'Đăng ký'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.btnSecondaryText}>
              Đã có tài khoản?{' '}
              <Text style={{ color: Colors.teal, fontWeight: '600' }}>Đăng nhập</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}