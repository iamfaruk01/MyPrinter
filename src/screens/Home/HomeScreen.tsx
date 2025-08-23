import React, { useEffect } from 'react';
import { View, ScrollView, StatusBar, TouchableOpacity, Text } from 'react-native';
import { styles } from './Home.styles';
import { useHomeScreen } from './hooks/useHomeScreen';
import CombinedProfileSetup from '../../components/HomeScreen/CombinedProfileSetup';
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList, RootStackParamList } from "../../navigation/AppNavigator";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CompositeNavigationProp } from '@react-navigation/native';

// Update the navigation type to handle nested navigation
type HomeScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<AuthStackParamList, 'Home'>,
  StackNavigationProp<RootStackParamList>
>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const {
    phone, 
    setPhone,
    userType,
    setUserType,
    printerModel,
    setPrinterModel,
    upiId,
    setUpiId,
    handleOwnerSubmit,
    handleCustomerSubmit,
    handleLogout,
    checkIsProfileCompleted
  } = useHomeScreen();

  useEffect(() => {
    if (phone) {
      const checkProfile = async () => {
        await checkIsProfileCompleted();
      };
      checkProfile();
    }
  }, [phone]);

  console.log("[HomeScreen] phone from storage: ", AsyncStorage.getItem("phone"));

  // Handle navigation after profile completion
  useEffect(() => {
    if (userType === 'customer') {
      handleCustomerSubmit();
      // Navigate to the Main navigator which contains the tab navigator
      navigation.getParent()?.navigate('Main');
    }
  }, [userType, handleCustomerSubmit, navigation]);

  // Handle owner profile completion
  const handleOwnerComplete = async () => {
    await handleOwnerSubmit();
    // After owner profile is completed, navigate to Main
    navigation.getParent()?.navigate('Main');
  };

  // Handle logout - navigate back to Auth flow
  const onLogout = async () => {
    await handleLogout();
    // Reset to Login screen in Auth stack
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <CombinedProfileSetup
            userType={userType}
            setUserType={setUserType}
            printerModel={printerModel}
            setPrinterModel={setPrinterModel}
            upiId={upiId}
            setUpiId={setUpiId}
            handleOwnerSubmit={handleOwnerComplete} // Use the wrapper function
          />
          <TouchableOpacity onPress={onLogout}>
          <View>
            <Text>Logout</Text>
          </View>
        </TouchableOpacity>
        </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;