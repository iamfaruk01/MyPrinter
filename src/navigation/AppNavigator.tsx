import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/Home/HomeScreen';
import LoginScreen from '../screens/Login/LoginScreen';
import OtpScreen from '../screens/Login/OtpScreen';

// Define the navigation stack parameter list
export type RootStackParamList = {
  Login: undefined;
  OtpScreen: {phone: string};
  Home: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        cardStyle: {
          backgroundColor: '#f5f5f5',
        },
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ 
          title: 'Login', 
          
        }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'My Printer',
          headerStyle: {
            backgroundColor: '#1976D2',
          },
        }}
      />
      <Stack.Screen 
        name="OtpScreen" 
        component={OtpScreen}
        options={{ title: 'Verify OTP' }}
      />

    </Stack.Navigator>
  );
};

export default AppNavigator;