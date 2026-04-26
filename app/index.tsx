import { useEffect, useRef, useState } from 'react';
import { View, Text, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../stores/auth.store';
import { splashStyles as s } from '../styles/layout/splash.styles';

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const { token, loadToken } = useAuthStore();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadToken().then(() => setReady(true));
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(() => {
      if (token) {
        router.replace('/tabs/home');
      } else {
        router.replace('/auth/login');
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [ready, token]);

  return (
    <View style={s.container}>
      <View style={s.wave1} />
      <View style={s.wave2} />
      <View style={s.wave3} />

      <Animated.View
        style={[
          s.content,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
        ]}
      >

        <Text style={s.title}>Ripple</Text>
        <Text style={s.subtitle}>Your emotional ocean</Text>
      </Animated.View>
    </View>
  );
}
