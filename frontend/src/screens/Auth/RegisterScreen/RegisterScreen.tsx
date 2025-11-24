import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image,
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TextInput, 
  TouchableOpacity 
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParamList } from '../../../navigation/types';
import logoSoccerQuiz from '../../../../assets/images/SOCCER QUIZ.png';
import warningIcon from '../../../../assets/icons/warning.png';

interface RegisterFormState {
  nome: string;
  sobrenome: string;
  cpf: string;
  dataNascimento: string;
  email: string;
  senha: string;
  confirmarSenha: string;
}

type RegisterScreenProps = StackScreenProps<AuthStackParamList, 'RegisterScreen'>;

const GREEN_COLOR = '#00C853';

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [form, setForm] = useState<RegisterFormState>({
    nome: '', sobrenome: '', cpf: '', dataNascimento: '',
    email: '', senha: '', confirmarSenha: '',
  });

  const handleChange = (name: keyof RegisterFormState, value: string): void => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = () => {
    if (form.senha !== form.confirmarSenha) {
        console.error("As senhas não coincidem!");
        return;
    }
    console.log('Cadastro realizado com:', form);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Image source={logoSoccerQuiz} style={styles.logo} resizeMode="contain" />
        </View>
        
        <TextInput style={styles.input} placeholder="Nome" value={form.nome} onChangeText={(t) => handleChange('nome', t)} placeholderTextColor="white" />
        
        <TextInput style={styles.input} placeholder="Sobrenome" value={form.sobrenome} onChangeText={(t) => handleChange('sobrenome', t)} placeholderTextColor="white" />
        
        <TextInput style={styles.input} placeholder="CPF" keyboardType="numeric" value={form.cpf} onChangeText={(t) => handleChange('cpf', t)} placeholderTextColor="white" />
        
        <TextInput style={styles.input} placeholder="DD/MM/AAAA" keyboardType="numeric" value={form.dataNascimento} onChangeText={(t) => handleChange('dataNascimento', t)} placeholderTextColor="white" />
        <View style={styles.hintContainer}>
          <Image source={warningIcon} style={styles.warningIcon} />
          <Text style={styles.hint}>Você precisa ser maior de 18 anos para usar o app.</Text>
        </View>

        <TextInput style={styles.input} placeholder="E-mail" keyboardType="email-address" value={form.email} onChangeText={(t) => handleChange('email', t)} placeholderTextColor="white" />

        <TextInput style={styles.input} placeholder="Senha" secureTextEntry value={form.senha} onChangeText={(t) => handleChange('senha', t)} placeholderTextColor="white" />

        <TextInput style={styles.input} placeholder="Confirme a Senha" secureTextEntry value={form.confirmarSenha} onChangeText={(t) => handleChange('confirmarSenha', t)} placeholderTextColor="white" />
        <View style={styles.hintContainer}>
          <Image source={warningIcon} style={styles.warningIcon} />
          <View style={styles.hintTextContainer}>
            <Text style={styles.hint}>A senha precisa ter:</Text>
            <Text style={styles.hintListItem}>• No mínimo 6 caracteres</Text>
            <Text style={styles.hintListItem}>• Um número</Text>
            <Text style={styles.hintListItem}>• Um símbolo</Text>
          </View>
        </View>
        
        <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleRegister}>
          <Text style={styles.primaryButtonText}>Finalizar o Cadastro</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#33CA7F', 
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 30,
    justifyContent: 'center',
    paddingVertical: 50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 320,
    height: 100,
  },
  
  input: {
    width: '100%',
    backgroundColor: 'transparent',
    padding: 15,
    paddingBottom: 10,
    borderRadius: 0,
    borderWidth: 0,
    borderBottomWidth: 2,
    borderBottomColor: 'white',
    marginVertical: 4,
    color: 'white',
    fontSize: 16,
  },

  button: {
    width: '100%',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 20,
  },
  primaryButton: {
    backgroundColor: '#1D8B54',
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  label: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  warningIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
    marginTop: 2,
  },
  hintTextContainer: {
    flex: 1,
  },
  hint: {
    color: '#E0E0E0', 
    fontSize: 12,
    marginBottom: 4,
  },
  hintListItem: {
    color: '#E0E0E0', 
    fontSize: 12,
    marginLeft: 4,
  },
});

export default RegisterScreen;