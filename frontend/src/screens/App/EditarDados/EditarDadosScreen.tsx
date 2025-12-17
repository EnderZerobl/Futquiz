import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Image,
  Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../../../navigation/types';
import { useAuth } from '../../../contexts/AuthContext';
import authService, { User } from '../../../services/authService';
import eyeIcon from '../../../../assets/icons/eye.png';
import eyeOffIcon from '../../../../assets/icons/eye-off.png';
import warningIcon from '../../../../assets/icons/warning.png';
import styles from './styles';

type NavigationProps = StackNavigationProp<AppStackParamList, 'EditarDados'>;

interface EditFormState {
  nomeCompleto: string;
  email: string;
  senha: string;
  confirmarSenha: string;
}

const EditarDadosScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState<EditFormState>({
    nomeCompleto: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasNumber: false,
    hasSymbol: false,
  });
  const [passwordError, setPasswordError] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSwitchingPasswordFields = useRef<boolean>(false);
  const senhaRef = useRef<TextInput>(null);
  const confirmarSenhaRef = useRef<TextInput>(null);

  useEffect(() => {
    if (user) {
      setForm({
        nomeCompleto: `${user.name} ${user.last_name}`.trim(),
        email: user.email,
        senha: '',
        confirmarSenha: '',
      });
    }
  }, [user]);

  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        setForm({
          nomeCompleto: `${user.name} ${user.last_name}`.trim(),
          email: user.email,
          senha: '',
          confirmarSenha: '',
        });
      }
    }, [user])
  );

  const handleChange = (name: keyof EditFormState, value: string): void => {
    setForm(prev => ({ ...prev, [name]: value }));
    
    if (name === 'senha') {
      validatePasswordRequirements(value);
      if (form.confirmarSenha) {
        setPasswordError(value !== form.confirmarSenha);
      }
    } else if (name === 'confirmarSenha') {
      setPasswordError(value !== form.senha);
    }
  };

  const clearField = (fieldName: keyof EditFormState) => {
    handleChange(fieldName, '');
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

  const handleSenhaFocus = (): void => {
    setIsPasswordFocused(true);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  const handleConfirmarSenhaFocus = (): void => {
    isSwitchingPasswordFields.current = true;
    setIsPasswordFocused(true);
    setTimeout(() => {
      isSwitchingPasswordFields.current = false;
    }, 200);
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  const handlePasswordBlur = (): void => {
    setIsPasswordFocused(false);
    setTimeout(() => {
      if (!isSwitchingPasswordFields.current) {
        centerScroll();
      }
    }, 150);
  };

  const handleOtherFieldFocus = (): void => {
    setIsPasswordFocused(false);
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

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setIsKeyboardVisible(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
        if (!isPasswordFocused) {
          centerScroll();
        }
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [isPasswordFocused]);

  const validatePasswordRequirements = (senha: string): void => {
    setPasswordRequirements({
      minLength: senha.length >= 8,
      hasNumber: /\d/.test(senha),
      hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(senha),
    });
  };

  const isPasswordValid = (): boolean => {
    if (form.senha.length === 0 && form.confirmarSenha.length === 0) {
      return true;
    }
    return passwordRequirements.minLength && 
           passwordRequirements.hasNumber && 
           passwordRequirements.hasSymbol &&
           form.senha === form.confirmarSenha;
  };

  const handleUpdate = async () => {
    if (!form.nomeCompleto.trim() || !form.email.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const nomeCompletoArray = form.nomeCompleto.trim().split(' ');
    const firstName = nomeCompletoArray[0] || '';
    const lastName = nomeCompletoArray.slice(1).join(' ') || '';
    const emailTrimmed = form.email.trim();

    const nomeIgual = user?.name === firstName && user?.last_name === lastName;
    const emailIgual = user?.email === emailTrimmed;
    const senhaPreenchida = form.senha && form.senha.length > 0;

    if (senhaPreenchida) {
      if (form.senha !== form.confirmarSenha) {
        Alert.alert('Erro', 'As senhas não coincidem!');
        return;
      }

      if (form.senha.length < 8) {
        Alert.alert('Erro', 'A senha deve ter no mínimo 8 caracteres');
        return;
      }

      if (!isPasswordValid()) {
        Alert.alert('Erro', 'A senha não atende aos requisitos mínimos');
        return;
      }
    }

    if (nomeIgual && emailIgual && !senhaPreenchida) {
      Alert.alert('Aviso', 'Nenhuma alteração foi feita nos dados');
      return;
    }

    setIsLoading(true);
    try {
      const updateData: any = {
        name: firstName,
        last_name: lastName,
        email: emailTrimmed,
      };

      if (senhaPreenchida) {
        updateData.password = form.senha;
      }

      const updatedUser = await authService.updateUser(updateData);
      updateUser(updatedUser);
      
      Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Ocorreu um erro ao atualizar os dados.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>EDITAR INFORMAÇÕES PESSOAIS</Text>
          <View style={styles.backButtonPlaceholder} />
        </View>

        <ScrollView 
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome Completo</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={form.nomeCompleto}
                onChangeText={(value) => handleChange('nomeCompleto', value)}
                placeholder="Nome Completo"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                autoCapitalize="words"
                onFocus={handleOtherFieldFocus}
              />
              {form.nomeCompleto.length > 0 && (
                <TouchableOpacity 
                  onPress={() => clearField('nomeCompleto')}
                  style={styles.clearButton}
                >
                  <Ionicons name="close-circle" size={24} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>E-mail</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={form.email}
                onChangeText={(value) => handleChange('email', value)}
                placeholder="E-mail"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={handleOtherFieldFocus}
              />
              {form.email.length > 0 && (
                <TouchableOpacity 
                  onPress={() => clearField('email')}
                  style={styles.clearButton}
                >
                  <Ionicons name="close-circle" size={24} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput 
                ref={senhaRef}
                style={[styles.input, !isPasswordValid() && form.senha.length > 0 && styles.inputError]} 
                placeholder="Senha" 
                secureTextEntry={!showPassword}
                value={form.senha} 
                onChangeText={(value) => {
                  handleChange('senha', value);
                  validatePasswordRequirements(value);
                  if (form.confirmarSenha) {
                    setPasswordError(value !== form.confirmarSenha);
                  }
                }}
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={handleSenhaSubmit}
                onFocus={handleSenhaFocus}
                onBlur={handlePasswordBlur}
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
              >
                <Image 
                  source={showPassword ? eyeOffIcon : eyeIcon} 
                  style={styles.eyeIcon} 
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput 
                ref={confirmarSenhaRef}
                style={[styles.input, passwordError && styles.inputError]} 
                placeholder="Confirmar Senha" 
                secureTextEntry={!showPassword}
                value={form.confirmarSenha} 
                onChangeText={(value) => {
                  handleChange('confirmarSenha', value);
                  setPasswordError(value !== form.senha);
                }}
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={handleUpdate}
                onFocus={handleConfirmarSenhaFocus}
                onBlur={handlePasswordBlur}
              />
            </View>
          </View>

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
            style={[styles.button, isLoading && styles.buttonDisabled]} 
            onPress={handleUpdate}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Atualizar dados</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditarDadosScreen;

