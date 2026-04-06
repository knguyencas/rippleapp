import axios from 'axios';
import { Platform } from 'react-native';
import { useAuthStore } from '../stores/auth.store';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  let token = useAuthStore.getState().token;

  if (!token && Platform.OS === 'web') {
    token = localStorage.getItem('token');
    if (token) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        useAuthStore.setState({
          token,
          user: JSON.parse(userStr),
        });
      }
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;