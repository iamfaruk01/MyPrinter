import React, { useEffect } from 'react';
import { View, ScrollView, StatusBar, TouchableOpacity, Text } from 'react-native';
import { styles } from './Home.styles';
import { useHomeScreen } from './hooks/useHomeScreen';
import CombinedProfileSetup from '../../components/HomeScreen/CombinedProfileSetup';
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import AsyncStorage from '@react-native-async-storage/async-storage';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

// interface HomeScreenProps {
//   route: { params: { phoneNumber: string } };
// }

const HomeScreen: React.FC = ({ }) => {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const {
    phone, setPhone,
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
  }, [phone]);  // run only when phone is available


  console.log("[HomeScreen] phone from storage: ", AsyncStorage.getItem("phone"))

  // Automatically navigate if customer is selected
  useEffect(() => {
    if (userType === 'customer') {
      handleCustomerSubmit();
      navigation.reset({ index: 0, routes: [{ name: 'CustomerDashboard' }] });
    }
  }, [userType, handleCustomerSubmit, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1976D2" />
      <TouchableOpacity onPress={handleLogout}>
        <View>
          <Text>Logout</Text>
        </View>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <CombinedProfileSetup
          userType={userType}
          setUserType={setUserType}
          printerModel={printerModel}
          setPrinterModel={setPrinterModel}
          upiId={upiId}
          setUpiId={setUpiId}
          handleOwnerSubmit={handleOwnerSubmit}
        />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;