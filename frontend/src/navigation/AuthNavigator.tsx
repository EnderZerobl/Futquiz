import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Image } from 'react-native';
import { AuthStackParamList } from './types'; 
import LoginScreen from '../screens/Auth/LoginScreen/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen/RegisterScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPassword/ForgotPassword';
import WelcomeScreen from '../screens/Auth/WelcomeScreen/WelcomeScreen';

const ArrowIcon = require('../../assets/icons/Arrow left-circle.png'); 


const Stack = createStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="WelcomeScreen" 
      screenOptions={{
        headerShown: false, 
      }}
    >
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen}
        options={({ navigation }) => ({
          headerShown: true, 
          headerStyle: {
            backgroundColor: '#33CA7F', 
            elevation: 0, 
            shadowOpacity: 0, 
            height: 100, 
          },
          headerTitleStyle: {
            color: 'white',
            fontWeight: 'bold',
            fontSize: 20,
            textAlign: 'left', 
            marginLeft: 10, 
          },
          headerTintColor: 'white',
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => navigation.goBack()} 
              style={{ marginLeft: 15, padding: 5 }}
            >
              <Image 
                source={ArrowIcon}
                style={{ width: 24, height: 24, tintColor: 'white' }}
              />
            </TouchableOpacity>
          ),
          headerTitle: 'Esqueci minha senha', 
        })}
      />

    </Stack.Navigator>
  );
}