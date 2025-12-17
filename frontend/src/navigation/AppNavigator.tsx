import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Image } from 'react-native';
import HomeScreen from '../screens/App/HomeScreen/HomeScreen';
import AdminCreateScreen from '../screens/Admin/Create/AdminCreateScreen';
import CadastrarTimeScreen from '../screens/Admin/CadastrarTime/CadastrarTimeScreen';
import CadastrarPerguntaScreen from '../screens/Admin/CadastrarPergunta/CadastrarPerguntaScreen';
import CriarQuizStepOneScreen from '../screens/Admin/CriarQuiz/CriarQuizStepOneScreen';
import CriarQuizStepTwoScreen from '../screens/Admin/CriarQuiz/CriarQuizStepTwoScreen';
import QuizWaitingRoomScreen from '../screens/App/Quiz/QuizWaitingRoom/QuizWaitingRoomScreen';
import QuizCountdownScreen from '../screens/App/Quiz/QuizCountdown/QuizCountdownScreen';
import QuizQuestionScreen from '../screens/App/Quiz/QuizQuestion/QuizQuestionScreen';
import ProfileScreen from '../screens/App/Profile/ProfileScreen';
import ConvidarUsuarioScreen from '../screens/App/ConvidarUsuario/ConvidarUsuarioScreen';
import EditarDadosScreen from '../screens/App/EditarDados/EditarDadosScreen';
import { AppStackParamList } from './types';

const ArrowIcon = require('../../assets/icons/Arrow left-circle.png');

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
      <Stack.Screen name="CriarQuizStepOne" component={CriarQuizStepOneScreen} />
      <Stack.Screen name="CriarQuizStepTwo" component={CriarQuizStepTwoScreen} />
      <Stack.Screen name="QuizWaitingRoom" component={QuizWaitingRoomScreen} />
      <Stack.Screen name="QuizCountdown" component={QuizCountdownScreen} />
      <Stack.Screen name="QuizQuestion" component={QuizQuestionScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="EditarDados" component={EditarDadosScreen} />
      <Stack.Screen 
        name="ConvidarUsuario" 
        component={ConvidarUsuarioScreen}
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
          headerTitle: 'Convidar Usuário', 
        })}
      />
    </Stack.Navigator>
  );
}

