import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  TextInput 
} from 'react-native';

import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParamList } from '../../../navigation/types'; 

type ForgotPasswordProps = StackScreenProps<AuthStackParamList, 'ForgotPassword'>;

const GREEN_COLOR = '#1EAD47';

const ForgotPasswordScreen: React.FC<ForgotPasswordProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');

  const handleRecover = () => {
    console.log('Solicitando recuperação para:', email);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        <Text style={styles.instructionText}>
          Insira seu e-mail cadastrado para recuperar sua senha:
        </Text>
        
        <TextInput 
          style={styles.input}
          placeholder="E-mail" 
          keyboardType="email-address"
          value={email} 
          onChangeText={setEmail} 
          placeholderTextColor="black"
        />
        
        <TouchableOpacity style={styles.recoverButton} onPress={handleRecover}>
          <Text style={styles.recoverButtonText}>Recuperar a senha</Text>
        </TouchableOpacity>
        
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    backgroundColor: 'white',
  },
  
  instructionText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 30,
    lineHeight: 22,
  },
  
  input: {
    width: '100%',
    backgroundColor: 'transparent',
    padding: 15,
    paddingBottom: 10,
    borderRadius: 0,
    borderWidth: 0,
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    marginBottom: 20,
    color: 'black',
    fontSize: 16,
  },

  recoverButton: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: GREEN_COLOR,
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
  },
  recoverButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ForgotPasswordScreen;