import React from 'react';
import HomeScreen from '../screens/Home/HomeScreen';
import LoginScreen from '../screens/Login/LoginScreen';
import OtpScreen from '../screens/Login/OtpScreen';
import CustomerDashboard from '../screens/Customer/Customer.Dashboard';
import OwnerDashboard from '../screens/Owner/OwnerDashboard';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Define the navigation stack parameter list
export type RootStackParamList = {
  Login: undefined;
  OtpScreen: { phone: string };
  Home: { phoneNumber: string };
  CustomerDashboard: undefined;
  OwnerDashboard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator= () => {
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
        contentStyle: {
          backgroundColor: '#f5f5f5',
        },
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: 'Login' }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'My Profile',
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

      <Stack.Screen
        name="CustomerDashboard"
        component={CustomerDashboard}
        options={{ title: 'My Printer' }}
      />

      <Stack.Screen
        name='OwnerDashboard'
        component={OwnerDashboard}
        options={{ title: 'My Printer' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;