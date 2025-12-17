import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UpdateUserData {
  name?: string;
  last_name?: string;
  email?: string;
  password?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  last_name: string;
  cpf: string;
  birth_date: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface User {
  id: number;
  email: string;
  name: string;
  last_name: string;
  cpf: string;
  birth_date: string;
  is_admin: boolean;
}

class AuthService {
  private readonly TOKEN_KEY = '@auth_token';
  private readonly USER_KEY = '@auth_user';

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      const { access_token, user } = response.data;
      
      await AsyncStorage.setItem(this.TOKEN_KEY, access_token);
      await this.saveUser(user);
      
      return response.data;
    } catch (error: any) {
      let errorMessage = 'Erro ao fazer login';
      
      if (error.response) {
        errorMessage = error.response.data?.detail || error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão e se o backend está rodando.';
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      throw new Error(errorMessage);
    }
  }

  async register(userData: RegisterData): Promise<User> {
    try {
      const response = await api.post<User>('/auth/register', userData);
      return response.data;
    } catch (error: any) {
      let errorMessage = 'Erro ao cadastrar usuário';
      
      if (error.response) {
        errorMessage = error.response.data?.detail || error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão e se o backend está rodando.';
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      throw new Error(errorMessage);
    }
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem(this.TOKEN_KEY);
    await AsyncStorage.removeItem(this.USER_KEY);
  }

  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem(this.TOKEN_KEY);
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  async saveUser(user: User): Promise<void> {
    await AsyncStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  async getUser(): Promise<User | null> {
    const userJson = await AsyncStorage.getItem(this.USER_KEY);
    if (userJson) {
      return JSON.parse(userJson);
    }
    return null;
  }

  async getCurrentUser(): Promise<User> {
    const savedUser = await this.getUser();
    if (savedUser) {
      return savedUser;
    }
    
    throw new Error('Dados do usuário não encontrados. Faça o registro primeiro.');
  }

  async updateUser(updateData: UpdateUserData): Promise<User> {
    try {
      const response = await api.put<User>('/users/me', updateData);
      const updatedUser = response.data;
      
      await this.saveUser(updatedUser);
      
      return updatedUser;
    } catch (error: any) {
      let errorMessage = 'Erro ao atualizar dados do usuário';
      
      if (error.response) {
        errorMessage = error.response.data?.detail || error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão e se o backend está rodando.';
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      throw new Error(errorMessage);
    }
  }
}

export default new AuthService();

