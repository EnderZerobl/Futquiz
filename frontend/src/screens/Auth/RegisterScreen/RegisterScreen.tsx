import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image,
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator,
  Alert
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParamList } from '../../../navigation/types';
import { useAuth } from '../../../contexts/AuthContext';
import logoSoccerQuiz from '../../../../assets/images/SOCCER QUIZ.png';
import warningIcon from '../../../../assets/icons/warning.png';
import eyeIcon from '../../../../assets/icons/eye.png';
import eyeOffIcon from '../../../../assets/icons/eye-off.png';

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

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const { register } = useAuth();
  const [form, setForm] = useState<RegisterFormState>({
    nome: '', sobrenome: '', cpf: '', dataNascimento: '',
    email: '', senha: '', confirmarSenha: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const [dataError, setDataError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasNumber: false,
    hasSymbol: false,
  });
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSwitchingPasswordFields = useRef<boolean>(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const sobrenomeRef = useRef<TextInput>(null);
  const cpfRef = useRef<TextInput>(null);
  const dataRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const senhaRef = useRef<TextInput>(null);
  const confirmarSenhaRef = useRef<TextInput>(null);

  const handleChange = (name: keyof RegisterFormState, value: string): void => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validatePasswordRequirements = (senha: string): void => {
    setPasswordRequirements({
      minLength: senha.length >= 8,
      hasNumber: /\d/.test(senha),
      hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(senha),
    });
  };

  const isPasswordValid = (): boolean => {
    return passwordRequirements.minLength && 
           passwordRequirements.hasNumber && 
           passwordRequirements.hasSymbol;
  };

  const validatePasswords = (senha: string, confirmarSenha: string): void => {
    if (senha && confirmarSenha) {
      setPasswordError(senha !== confirmarSenha);
    } else {
      setPasswordError(false);
    }
  };

  const handleSenhaChange = (value: string): void => {
    handleChange('senha', value);
    validatePasswordRequirements(value);
    validatePasswords(value, form.confirmarSenha);
  };

  const handleConfirmarSenhaChange = (value: string): void => {
    handleChange('confirmarSenha', value);
    validatePasswords(form.senha, value);
  };

  const formatCPF = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    const limited = numbers.slice(0, 11);
    
    if (limited.length <= 3) {
      return limited;
    } else if (limited.length <= 6) {
      return `${limited.slice(0, 3)}.${limited.slice(3)}`;
    } else if (limited.length <= 9) {
      return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6)}`;
    } else {
      return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6, 9)}-${limited.slice(9)}`;
    }
  };

  const handleCPFChange = (value: string): void => {
    const formatted = formatCPF(value);
    handleChange('cpf', formatted);
  };

  const formatDate = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    const limited = numbers.slice(0, 8);
    
    if (limited.length <= 2) {
      return limited;
    } else if (limited.length <= 4) {
      return `${limited.slice(0, 2)}/${limited.slice(2)}`;
    } else {
      return `${limited.slice(0, 2)}/${limited.slice(2, 4)}/${limited.slice(4)}`;
    }
  };

  const validateAge = (dateString: string): boolean => {
    if (dateString.length !== 10) return false;
    
    const [day, month, year] = dateString.split('/').map(Number);
    
    if (!day || !month || !year || month > 12 || day > 31) return false;
    
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    
    if (birthDate.getFullYear() !== year || 
        birthDate.getMonth() !== month - 1 || 
        birthDate.getDate() !== day) {
      return false;
    }
    
    let age = today.getFullYear() - year;
    const monthDiff = today.getMonth() - (month - 1);
    const dayDiff = today.getDate() - day;
    
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
    
    return age >= 18;
  };

  const handleDateChange = (value: string): void => {
    const formatted = formatDate(value);
    handleChange('dataNascimento', formatted);
    
    if (formatted.length === 10) {
      const isValid = validateAge(formatted);
      setDataError(!isValid);
    } else {
      setDataError(false);
    }
  };

  const handleDateSubmit = (): void => {
    if (dataError || form.dataNascimento.length !== 10 || !validateAge(form.dataNascimento)) {
      return;
    }
    emailRef.current?.focus();
  };

  const handleSenhaSubmit = (): void => {
    if (!isPasswordValid()) {
      return;
    }
    confirmarSenhaRef.current?.focus();
  };

  const centerScroll = (): void => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, 100);
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setIsKeyboardVisible(true);
        // Não faz scroll automático aqui - apenas quando os campos de senha recebem foco
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
        // Só volta para o centro se não estiver nos campos de senha
        if (!isPasswordFocused) {
          centerScroll();
        }
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [isPasswordFocused]);

  const handleSenhaFocus = (): void => {
    isSwitchingPasswordFields.current = true;
    setIsPasswordFocused(true);
    setTimeout(() => {
      isSwitchingPasswordFields.current = false;
    }, 200);
    // Scroll para o final quando o campo de senha recebe foco
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  const handleConfirmarSenhaFocus = (): void => {
    isSwitchingPasswordFields.current = true;
    setIsPasswordFocused(true);
    setTimeout(() => {
      isSwitchingPasswordFields.current = false;
    }, 200);
    // Scroll para o final quando o campo de confirmar senha recebe foco
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  const handlePasswordBlur = (): void => {
    setIsPasswordFocused(false);
    setTimeout(() => {
      if (!isSwitchingPasswordFields.current) {
        // Volta para o centro quando sai dos campos de senha
        centerScroll();
      }
    }, 150);
  };

  const handleOtherFieldFocus = (): void => {
    setIsPasswordFocused(false);
    // Mantém a posição central para outros campos
    centerScroll();
  };

  const handleScroll = (event: any): void => {
    const currentY = event.nativeEvent.contentOffset.y;
    
    if (!isPasswordFocused && currentY > 100) {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      scrollTimeoutRef.current = setTimeout(() => {
        if (!isPasswordFocused) {
          centerScroll();
        }
      }, 500);
    }
  };

  const convertDateToISO = (dateString: string): string => {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  };

  const removeCPFFormatting = (cpf: string): string => {
    return cpf.replace(/[.-]/g, '');
  };

  const handleRegister = async () => {
    if (!form.nome.trim() || !form.sobrenome.trim() || !form.cpf.trim() || 
        !form.dataNascimento.trim() || !form.email.trim() || !form.senha.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos');
      return;
    }

    if (form.senha !== form.confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem!');
      return;
    }

    if (form.senha.length < 8) {
      Alert.alert('Erro', 'A senha deve ter no mínimo 8 caracteres');
      return;
    }

    if (dataError || !validateAge(form.dataNascimento)) {
      Alert.alert('Erro', 'Data de nascimento inválida ou você deve ter pelo menos 18 anos');
      return;
    }

    if (!isPasswordValid()) {
      Alert.alert('Erro', 'A senha não atende aos requisitos mínimos');
      return;
    }

    setIsLoading(true);
    try {
      const registerData = {
        email: form.email.trim().toLowerCase(),
        password: form.senha,
        name: form.nome.trim(),
        last_name: form.sobrenome.trim(),
        cpf: removeCPFFormatting(form.cpf),
        birth_date: convertDateToISO(form.dataNascimento),
      };

      await register(registerData);
      
      Alert.alert(
        'Cadastro Efetuado com Sucesso',
        'Seu cadastro foi realizado com sucesso! Faça login para continuar.',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('LoginScreen');
            },
          },
        ]
      );
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={[
            styles.scrollContainer,
            isKeyboardVisible && styles.scrollContainerKeyboardVisible
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          scrollEnabled={true}
          nestedScrollEnabled={true}
        >
        <View style={styles.header}>
          <Image source={logoSoccerQuiz} style={styles.logo} resizeMode="contain" />
        </View>
        
        <TextInput 
          style={styles.input} 
          placeholder="Nome" 
          value={form.nome} 
          onChangeText={(t) => handleChange('nome', t)} 
          placeholderTextColor="white"
          returnKeyType="next"
          onSubmitEditing={() => sobrenomeRef.current?.focus()}
          onFocus={handleOtherFieldFocus}
        />
        
        <TextInput 
          ref={sobrenomeRef}
          style={styles.input} 
          placeholder="Sobrenome" 
          value={form.sobrenome} 
          onChangeText={(t) => handleChange('sobrenome', t)} 
          placeholderTextColor="white"
          returnKeyType="next"
          onSubmitEditing={() => cpfRef.current?.focus()}
          onFocus={handleOtherFieldFocus}
        />
        
        <TextInput 
          ref={cpfRef}
          style={styles.input} 
          placeholder="CPF" 
          keyboardType="numeric" 
          value={form.cpf} 
          onChangeText={handleCPFChange} 
          placeholderTextColor="white"
          returnKeyType="next"
          onSubmitEditing={() => dataRef.current?.focus()}
          maxLength={14}
          onFocus={handleOtherFieldFocus}
        />
        
        <TextInput 
          ref={dataRef}
          style={[styles.input, dataError && styles.inputError]} 
          placeholder="DD/MM/AAAA" 
          keyboardType="numeric" 
          value={form.dataNascimento} 
          onChangeText={handleDateChange} 
          placeholderTextColor="white"
          returnKeyType="next"
          onSubmitEditing={handleDateSubmit}
          maxLength={10}
          onFocus={handleOtherFieldFocus}
        />
        <View style={styles.hintContainer}>
          <Image source={warningIcon} style={styles.warningIcon} />
          <Text style={styles.hint}>Você precisa ser maior de 18 anos para usar o app.</Text>
        </View>

        <TextInput 
          ref={emailRef}
          style={styles.input} 
          placeholder="E-mail" 
          keyboardType="email-address" 
          value={form.email} 
          onChangeText={(t) => handleChange('email', t)} 
          placeholderTextColor="white"
          returnKeyType="next"
          onSubmitEditing={() => senhaRef.current?.focus()}
          onFocus={handleOtherFieldFocus}
        />

        <View style={styles.inputContainer}>
          <TextInput 
            ref={senhaRef}
            style={[styles.input, !isPasswordValid() && form.senha.length > 0 && styles.inputError]} 
            placeholder="Senha" 
            secureTextEntry={!showPassword}
            value={form.senha} 
            onChangeText={handleSenhaChange} 
            placeholderTextColor="white"
            returnKeyType="next"
            onSubmitEditing={handleSenhaSubmit}
            onFocus={handleSenhaFocus}
            onBlur={handlePasswordBlur}
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

        <TextInput 
          ref={confirmarSenhaRef}
          style={[styles.input, passwordError && styles.inputError]} 
          placeholder="Confirme a Senha" 
          secureTextEntry={!showPassword}
          value={form.confirmarSenha} 
          onChangeText={handleConfirmarSenhaChange} 
          placeholderTextColor="white"
          returnKeyType="done"
          onSubmitEditing={handleRegister}
          onFocus={handleConfirmarSenhaFocus}
          onBlur={handlePasswordBlur}
        />
        {passwordError ? (
          <View style={styles.hintContainer}>
            <Image source={warningIcon} style={styles.warningIcon} />
            <Text style={[styles.hint, styles.errorText]}>As senhas não coincidem.</Text>
          </View>
        ) : (
          <View style={styles.hintContainer}>
            <Image source={warningIcon} style={styles.warningIcon} />
            <View style={styles.hintTextContainer}>
              <Text style={styles.hint}>A senha precisa ter:</Text>
              <Text style={[
                styles.hintListItem, 
                form.senha.length > 0 && !passwordRequirements.minLength && styles.errorText
              ]}>
                • No mínimo 8 caracteres
              </Text>
              <Text style={[
                styles.hintListItem, 
                form.senha.length > 0 && !passwordRequirements.hasNumber && styles.errorText
              ]}>
                • Um número
              </Text>
              <Text style={[
                styles.hintListItem, 
                form.senha.length > 0 && !passwordRequirements.hasSymbol && styles.errorText
              ]}>
                • Um símbolo
              </Text>
            </View>
          </View>
        )}
        
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton, isLoading && styles.buttonDisabled]} 
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.primaryButtonText}>Finalizar o Cadastro</Text>
          )}
        </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#33CA7F', 
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 30,
    justifyContent: 'center',
    paddingVertical: 50,
    paddingBottom: 150,
  },
  scrollContainerKeyboardVisible: {
    justifyContent: 'flex-start',
    paddingBottom: 250,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 320,
    height: 100,
  },
  
  inputContainer: {
    position: 'relative',
    width: '100%',
  },
  input: {
    width: '100%',
    backgroundColor: 'transparent',
    padding: 15,
    paddingBottom: 10,
    paddingRight: 45,
    borderRadius: 0,
    borderWidth: 0,
    borderBottomWidth: 2,
    borderBottomColor: 'white',
    marginVertical: 4,
    color: 'white',
    fontSize: 16,
  },
  inputError: {
    borderBottomColor: '#FF5252',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    bottom: 15,
    padding: 5,
  },
  eyeIconImage: {
    width: 20,
    height: 20,
    tintColor: 'white',
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
  buttonDisabled: {
    opacity: 0.6,
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
  errorText: {
    color: '#FF5252',
  },
});

export default RegisterScreen;