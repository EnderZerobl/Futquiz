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
  updateUser: (user: User) => void;
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
      setIsAuthenticated(authenticated);
      if (authenticated) {
        const savedUser = await authService.getUser();
        setUser(savedUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setIsAuthenticated(false);
      setUser(null);
      
      const loginResponse = await authService.login(credentials);
      
      setIsAuthenticated(true);
      setUser(loginResponse.user);
    } catch (error: any) {
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

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
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
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

