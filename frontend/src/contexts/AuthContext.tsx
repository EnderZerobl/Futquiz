import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import authService, { User, LoginCredentials, RegisterData } from '../services/authService';
import { Alert } from 'react-native';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const authenticated = await authService.isAuthenticated();
      // Se houver token válido, autentica (dados mockados na HomeScreen)
      setIsAuthenticated(authenticated);
      if (!authenticated) {
        setUser(null);
      }
    } catch (error) {
      // Em caso de erro, não autentica
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      // Limpa estado anterior em caso de erro
      setIsAuthenticated(false);
      setUser(null);
      
      await authService.login(credentials);
      
      // Após login bem-sucedido, autentica o usuário
      // Os dados na HomeScreen são mockados, então não precisamos buscar dados do usuário
      setIsAuthenticated(true);
    } catch (error: any) {
      // Garante que não está autenticado em caso de erro
      setIsAuthenticated(false);
      setUser(null);
      const errorMsg = error?.message || 'Erro ao fazer login';
      Alert.alert('Erro no Login', errorMsg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      const userData = await authService.register(data);
      // Salva os dados do usuário após o registro
      await authService.saveUser(userData);
      setUser(userData);
      // Após o registro, o usuário precisa fazer login para obter o token
      // Por enquanto, apenas salvamos os dados. O usuário será redirecionado para login
      // Se quiser autenticar automaticamente após registro, seria necessário
      // fazer login automaticamente aqui
    } catch (error: any) {
      const errorMsg = error?.message || 'Erro ao cadastrar usuário';
      Alert.alert('Erro no Cadastro', errorMsg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

