import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthNavigator } from './src/navigation';
import HomeScreen from './src/screens/App/HomeScreen/HomeScreen';

const App = () => {
  return (
    <HomeScreen />
    // <NavigationContainer>
    //   <AuthNavigator />
    // </NavigationContainer>
  );
};

export default App;