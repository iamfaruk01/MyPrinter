import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';

// Define the navigation stack parameter list
export type RootStackParamList = {
  Home: undefined;
  Print: undefined;
  Settings: undefined;
  PrinterList: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
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
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'My Printer',
          headerStyle: {
            backgroundColor: '#1976D2',
          },
        }}
      />
      {/* Add other screens here as you create them */}
      {/* 
      <Stack.Screen 
        name="Print" 
        component={PrintScreen}
        options={{ title: 'Print Document' }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
      <Stack.Screen 
        name="PrinterList" 
        component={PrinterListScreen}
        options={{ title: 'Available Printers' }}
      />
      */}
    </Stack.Navigator>
  );
};

export default AppNavigator;