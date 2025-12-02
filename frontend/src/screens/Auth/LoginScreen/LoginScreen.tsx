import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  Image,
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator,
  Alert
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParamList } from '../../../navigation/types';
import { useAuth } from '../../../contexts/AuthContext';
import logoSoccerQuiz from '../../../../assets/images/SOCCER QUIZ.png';
import eyeIcon from '../../../../assets/icons/eye.png';
import eyeOffIcon from '../../../../assets/icons/eye-off.png';

type LoginScreenProps = StackScreenProps<AuthStackParamList, 'LoginScreen'>;

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const passwordRef = useRef<TextInput>(null);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);
    try {
      await login({ email: email.trim().toLowerCase(), password });
      // Se o login for bem-sucedido, o App.tsx automaticamente redireciona
      // para a HomeScreen através da mudança de isAuthenticated
    } catch (error) {
      // Em caso de erro, o Alert já é mostrado no AuthContext
      // O usuário permanece na mesma tela de login
      // Não fazemos nada aqui, apenas capturamos o erro para não quebrar
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image source={logoSoccerQuiz} style={styles.logo} resizeMode="contain" />
        
        <Text style={styles.label}>Email</Text>
        <TextInput 
          style={styles.input}
          placeholder="Digite seu email" 
          keyboardType="email-address"
          value={email} 
          onChangeText={setEmail} 
          placeholderTextColor="#B3B3B3"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
        
        <Text style={styles.label}>Senha</Text>
        <View style={styles.inputContainer}>
          <TextInput 
            ref={passwordRef}
            style={styles.input}
            placeholder="Digite sua senha" 
            secureTextEntry={!showPassword}
            value={password} 
            onChangeText={setPassword} 
            placeholderTextColor="#B3B3B3"
            returnKeyType="done"
            onSubmitEditing={handleLogin}
          />
          <TouchableOpacity 
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
            activeOpacity={0.7}
          >
            <Image 
              source={showPassword ? eyeOffIcon : eyeIcon} 
              style={styles.eyeIconImage} 
            />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton, isLoading && styles.buttonDisabled]} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.primaryButtonText}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.linkButton} 
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={styles.linkText}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => navigation.navigate('RegisterScreen')}>
          <Text style={styles.secondaryButtonText}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#33CA7F', 
  },
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 380,
    height: 120,
    marginTop: 40,
    marginBottom: 30,
  },
  
  label: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    alignSelf: 'flex-start',
    width: '100%',
  },
  
  inputContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
    padding: 15,
    paddingRight: 45,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  eyeIconImage: {
    width: 20,
    height: 20,
    tintColor: '#1D8B54',
  },

  button: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  primaryButton: {
    backgroundColor: '#1D8B54',
  },
  secondaryButton: {
    backgroundColor: 'transparent', 
    borderColor: '#1D8B54',
    borderWidth: 2,
    marginTop: 30,
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#1D8B54',
    fontWeight: 'bold',
  },

  linkButton: {
    marginVertical: 10,
  },
  linkText: {
    color: 'black',
    textDecorationLine: 'underline',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default LoginScreen;