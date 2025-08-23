import React from 'react';
import { View, Text, TouchableOpacity, Button, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHomeScreen } from '../Home/hooks/useHomeScreen';
import { useOwnerDashboard } from '../Owner/hooks/useOwnerDashboard';

const ProfileScreen = () => {
 
  const {
    handleLogout
  } = useHomeScreen()

  return (
    <SafeAreaView>
      <TouchableOpacity onPress={handleLogout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ProfileScreen;