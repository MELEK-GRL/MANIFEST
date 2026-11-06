import axios from 'axios';
import {Platform} from 'react-native';
import {useAuthStore} from '../store/useAuthStore';

const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

export const api = axios.create({
  baseURL: `http://${host}:5100`,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
  },
});

api.interceptors.request.use(config => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
