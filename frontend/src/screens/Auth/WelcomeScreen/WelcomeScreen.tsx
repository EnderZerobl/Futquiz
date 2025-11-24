import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Image,
  ImageBackground
} from 'react-native';

import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParamList } from '../../../navigation/types'; 

const GoogleIcon = require('../../../../assets/icons/google-icon.png');
const LoginArrowIcon = require('../../../../assets/icons/login-arrow.png');
import logoSoccerQuiz from '../../../../assets/images/SOCCER QUIZ.png';
import shootImage from '../../../../assets/images/shoot.png'; 

type WelcomeScreenProps = StackScreenProps<AuthStackParamList, 'WelcomeScreen'>;

const PRIMARY_BUTTON_COLOR = 'white'; 
const PRIMARY_BUTTON_TEXT_COLOR = '#333';

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  
  const handleAuthNavigation = () => {
    navigation.navigate('LoginScreen');
  };

  const handleGoogleLogin = () => {
    console.log('Botão Entrar com a Google clicado. Funcionalidade pendente.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground 
        source={shootImage} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <View style={styles.backgroundContainer}>
          
          <View style={styles.logoContainer}>
            <Image source={logoSoccerQuiz} style={styles.logo} resizeMode="contain" />
          </View>

          <View style={styles.buttonContainer}>
            
            <TouchableOpacity 
              style={[styles.button, styles.primaryButton]} 
              onPress={handleAuthNavigation}
            >
              <Text style={styles.primaryButtonText}>Login / Cadastre-se</Text>
              <Image 
                source={LoginArrowIcon}
                style={styles.arrowIcon}
              />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.googleButton]} 
              onPress={handleGoogleLogin} 
            >
              <Text style={styles.googleButtonText}>Entre com a Google</Text>
              <Image 
                source={GoogleIcon}
                style={styles.googleIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#33CA7F', 
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#33CA7F',
    opacity: 0.7,
  },
  backgroundContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  
  logoContainer: {
    marginTop: 150,
  },
  logo: {
    width: 380,
    height: 120,
  },

  buttonContainer: {
    width: '100%',
    marginBottom: 40,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 15,
    borderRadius: 20,
    marginVertical: 10,
  },
  
  primaryButton: {
    backgroundColor: PRIMARY_BUTTON_COLOR,
    justifyContent: 'center',
    paddingHorizontal: 25,
    position: 'relative',
  },
  primaryButtonText: {
    color: PRIMARY_BUTTON_TEXT_COLOR,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  arrowIcon: {
    width: 20,
    height: 20,
    position: 'absolute',
    right: 25,
  },
  
  googleButton: {
    backgroundColor: PRIMARY_BUTTON_COLOR, 
    borderColor: '#ccc',
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    position: 'relative',
  },
  googleButtonText: {
    color: PRIMARY_BUTTON_TEXT_COLOR,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  googleIcon: {
    width: 20,
    height: 20,
    position: 'absolute',
    right: 25,
  },
});

export default WelcomeScreen;