const getApiUrl = (): string => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    console.log('🔗 Usando URL da variável de ambiente:', process.env.EXPO_PUBLIC_API_URL);
    return process.env.EXPO_PUBLIC_API_URL;
  }
  
  if (__DEV__) {
    try {
      const Constants = require('expo-constants').default || require('expo-constants');
      
      let ip: string | null = null;
      
      if (Constants.expoConfig?.hostUri) {
        ip = Constants.expoConfig.hostUri.split(':')[0];
        console.log('🔍 IP detectado via expoConfig.hostUri:', ip);
      }
      
      if (!ip && Constants.manifest?.debuggerHost) {
        ip = Constants.manifest.debuggerHost.split(':')[0];
        console.log('🔍 IP detectado via manifest.debuggerHost:', ip);
      }
      
      if (!ip && Constants.manifest2?.extra?.expoGo?.debuggerHost) {
        ip = Constants.manifest2.extra.expoGo.debuggerHost.split(':')[0];
        console.log('🔍 IP detectado via manifest2:', ip);
      }
      
      if (!ip && Constants.manifest?.hostUri) {
        ip = Constants.manifest.hostUri.split(':')[0];
        console.log('🔍 IP detectado via manifest.hostUri:', ip);
      }
      
      if (ip && ip.includes('.exp.direct')) {
        console.warn('⚠️ IP detectado é um domínio de tunnel, ignorando:', ip);
        ip = null;
      }
      
      if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
        const url = `http://${ip}:8000`;
        console.log('✅ URL do backend:', url);
        return url;
      } else {
        console.warn('⚠️ IP não detectado ou é localhost, usando fallback');
      }
    } catch (error) {
      console.error('❌ Erro ao detectar IP:', error);
    }
    
    console.log('🔗 Usando fallback: http://localhost:8000');
    return 'http://localhost:8000';
  }
  
  return 'https://sua-api-producao.com';
};

export const API_BASE_URL = getApiUrl();
console.log('🔗 API Base URL final:', API_BASE_URL);

