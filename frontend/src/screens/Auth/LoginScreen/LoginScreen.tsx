import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image,
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  TextInput 
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParamList } from '../../../navigation/types';
import logoSoccerQuiz from '../../../../assets/images/SOCCER QUIZ.png'; 

type LoginScreenProps = StackScreenProps<AuthStackParamList, 'LoginScreen'>;

const GREEN_COLOR = '#00C853';

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = () => {
    console.log('Login com:', email, password);
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
        />
        
        <Text style={styles.label}>Senha</Text>
        <TextInput 
          style={styles.input}
          placeholder="Digite sua senha" 
          secureTextEntry
          value={password} 
          onChangeText={setPassword} 
          placeholderTextColor="#B3B3B3"
        />
        
        <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleLogin}>
          <Text style={styles.primaryButtonText}>Login</Text>
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
  
  input: {
    width: '100%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8,
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
});

export default LoginScreen;