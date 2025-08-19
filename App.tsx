import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { initialize } from 'react-native-wifi-p2p';

export default function App() {
  useEffect(() => {
    initialize()
      .then(success => console.log("✅ WifiP2P initialized once:", success))
      .catch(err => console.error("❌ Initialization failed:", err));
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
