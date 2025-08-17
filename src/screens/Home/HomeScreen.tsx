import React, { use, useEffect } from 'react';
import { View, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { styles } from './Home.styles';
import { useHomeScreen } from './hooks/useHomeScreen';
import ProfileSelection from '../../components/HomeScreen/ProfileSelection';
import OwnerProfileSetup from '../../components/HomeScreen/OwnerProfileSetup';
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { Text } from 'react-native-gesture-handler';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  route: { params: { phoneNumber: string } };
}

const HomeScreen: React.FC<HomeScreenProps> = ({ route }) => {
  const { phoneNumber } = route.params;
  console.log("[HomeScreen] phoneNumber:", phoneNumber);
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
    handleLogout
  } = useHomeScreen();

  // Automatically navigate if customer is selected
  useEffect(() => {
    if (userType === 'customer') {
      handleCustomerSubmit();
      navigation.reset({ index: 0, routes: [{ name: 'CustomerDashboard' }] }); // your dashboard route
    }
  }, [userType]);

  useEffect(()  => {
    if (phoneNumber) {
      setPhone(phoneNumber);
    }
  }),[];

  const renderProfileSetup = () => {
    if (userType === '') {
      return <ProfileSelection setUserType={setUserType} />;
    } else if (userType === 'owner') {
      return (
        <OwnerProfileSetup
          printerModel={printerModel}
          setPrinterModel={setPrinterModel}
          upiId={upiId}
          setUpiId={setUpiId}
          handleOwnerSubmit={handleOwnerSubmit}
        />
      );
    }
    // We no longer render CustomerProfile for customer
    return null;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1976D2" />
      <TouchableOpacity onPress={handleLogout}>
        <View>
          <Text>Logout</Text>
        </View>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderProfileSetup()}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
