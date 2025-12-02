import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

console.log('📡 Configurando API com baseURL:', API_BASE_URL);

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('@auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      const fullUrl = (config.baseURL || '') + (config.url || '');
      console.log('📤 Requisição:', config.method?.toUpperCase(), config.url, '->', fullUrl);
    } catch (error) {
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('✅ Resposta:', response.status, response.config.url);
    return response;
  },
  async (error: AxiosError) => {
    console.error('❌ Erro na requisição:', error.config?.url);
    console.error('   Status:', error.response?.status);
    console.error('   Mensagem:', error.message);
    const fullUrl = (error.config?.baseURL || '') + (error.config?.url || '');
    console.error('   URL completa:', fullUrl);
    if (error.request) {
      console.error('   Erro de conexão - backend não alcançável');
    }
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('@auth_token');
    }
    return Promise.reject(error);
  }
);

export default api;

