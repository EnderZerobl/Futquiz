import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/App/HomeScreen/HomeScreen';
import AdminCreateScreen from '../screens/Admin/Create/AdminCreateScreen';
import CadastrarTimeScreen from '../screens/Admin/CadastrarTime/CadastrarTimeScreen';
import CadastrarPerguntaScreen from '../screens/Admin/CadastrarPergunta/CadastrarPerguntaScreen';
import { AppStackParamList } from './types';

const Stack = createStackNavigator<AppStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="AdminCreate" component={AdminCreateScreen} />
      <Stack.Screen name="CadastrarTime" component={CadastrarTimeScreen} />
      <Stack.Screen name="CadastrarPergunta" component={CadastrarPerguntaScreen} />
    </Stack.Navigator>
  );
}

