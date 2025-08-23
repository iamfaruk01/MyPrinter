import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import your screens and the MainTabNavigator
import LoginScreen from '../screens/Login/LoginScreen';
import OtpScreen from '../screens/Login/OtpScreen';
import HomeScreen from '../screens/Home/HomeScreen'; // This is your onboarding screen
import { MainTabNavigator } from './MainTabNavigator'; // Assuming your tab navigator is in this file

// Define the param lists for the stacks
export type AuthStackParamList = {
  Login: undefined;
  OtpScreen: { phone: string };
  Home: { phoneNumber: string };
};

export type RootStackParamList = {
  Auth: undefined; // Represents the entire auth flow
  Main: {userType: string}; // Represents the entire main app with tabs
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="OtpScreen" component={OtpScreen} />
    <AuthStack.Screen name="Home" component={HomeScreen} />
  </AuthStack.Navigator>
);

// The main AppNavigator now simply defines the two high-level flows of your app.
const AppNavigator = () => {
  return (
    <RootStack.Navigator
      initialRouteName="Auth" // Always start with the Auth flow
      screenOptions={{ headerShown: false }}
    >
      <RootStack.Screen name="Auth" component={AuthNavigator} />
      <RootStack.Screen name="Main" component={MainTabNavigator} />
    </RootStack.Navigator>
  );
};

export default AppNavigator;
