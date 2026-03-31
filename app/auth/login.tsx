import { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';
import { authStyles as styles } from '../../styles/auth.styles';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import api from '../../services/api';
import { useAuthStore } from '../../stores/auth.store';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { username, password });
      await setAuth(res.data.token, res.data.user);
      router.replace('/tabs/home');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.wave1} />
        <View style={styles.wave2} />

        <View style={styles.headerCentered}>
          <Text style={styles.emoji}>🌊</Text>
          <Text style={styles.titleCentered}>Ripple</Text>
          <Text style={styles.subtitleCentered}>Chào mừng trở lại</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Tên người dùng"
            value={username}
            onChangeText={setUsername}
            placeholder="username"
            autoCapitalize="none"
          />

          <Input
            label="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button
            title={loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            onPress={handleLogin}
            disabled={loading}
          />

          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => router.push('/auth/register')}
          >
            <Text style={styles.btnSecondaryText}>
              Chưa có tài khoản?{' '}
              <Text style={{ color: Colors.teal, fontWeight: '600' }}>Đăng ký</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}