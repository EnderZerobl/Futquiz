import React, { useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  TextInput
} from 'react-native';
import styles from './styles';

const ConvidarUsuarioScreen: React.FC = () => {
  const [nome, setNome] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const handleInvite = () => {
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.instructionText}>
            Insira o nome e e-mail do amigo(a) que deseja convidar!
          </Text>
          
          <TextInput 
            style={styles.input}
            placeholder="Nome" 
            value={nome} 
            onChangeText={setNome} 
            placeholderTextColor="black"
          />
          
          <TextInput 
            style={styles.input}
            placeholder="E-mail" 
            keyboardType="email-address"
            autoCapitalize="none"
            value={email} 
            onChangeText={setEmail} 
            placeholderTextColor="black"
          />
        </View>
        
        <TouchableOpacity style={styles.inviteButton} onPress={handleInvite}>
          <Text style={styles.inviteButtonText}>Convidar Usuário</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ConvidarUsuarioScreen;

