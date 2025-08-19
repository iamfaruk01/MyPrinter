import { useContext, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import config from '../../../../config';
import { AuthContext } from '../../../context/AuthContext';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserType = '' | 'owner' | 'customer';

export const useHomeScreen = () => {
  const navigation = useNavigation<StackScreenProps<RootStackParamList>['navigation']>();
  const [userType, setUserType] = useState<UserType>('');
  const [printerModel, setPrinterModel] = useState('');
  const [upiId, setUpiId] = useState('');
  const [phone, setPhone] = useState('');
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const loadPhone = async () => {
      try {
        const stored = await AsyncStorage.getItem("phone");
        if (stored) {
          const { phone } = JSON.parse(stored);
          setPhone(phone);
        }
      } catch (error) {
        console.error("[useLoginHandler] Error loading phone from storage:", error);
      }
    };
    loadPhone();
  }, []);

  const handleOwnerSubmit = async () => {
    if (!phone || !userType || !printerModel || !upiId) {
      console.error('All fields are required');
      return;
    }

    try {
      const response = await fetch(config.API.SAVE_OWNER_PROFILE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone, userType, printerModel: printerModel, upiId: upiId })
      })

      const data = await response.json();
      console.log("[useHomeScreen] response: ", data);
      if (response.ok && data?.body?.success) {
        console.log('Owner Profile Saved. Navigating to dashboard...');
        navigation.reset({ index: 0, routes: [{ name: 'OwnerDashboard' }] });
      } else {
        console.error('Error saving owner profile:', data.message);
      }
    } catch (error) {
      console.error("Something went wrong")
    }
  };

  const handleCustomerSubmit = async () => {
    if (!phone || !userType) {
      console.error('All fields are required');
      return;
    }

    try {
      const response = await fetch(config.API.SAVE_CUSTOMER_PROFILE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone, userType })
      })

      const data = await response.json();
      console.log("[useHomeScreen] response: ", data);
      if (response.ok && data?.body?.success) {
        console.log('Customer Profile Saved. Navigating to dashboard...');
        navigation.reset({ index: 0, routes: [{ name: 'CustomerDashboard' }] });
      } else {
        console.error('Error saving profile:', data.message);
      }
    } catch (error) {
      console.error("Something went wrong")
    }
  };

  const checkIsProfileCompleted = async () => {
    if (!phone) {
      console.error("Phone number is required");
      return;
    }

    try {
      const response = await fetch(config.API.CHECK_IS_PROFILE_COMPLETED, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const datajson = await response.json();
      const data = datajson.body;
      console.log("[checkIsProfileCompleted] data:", data);

      if (response.ok) {
        if (data?.success) {
          const userType = data?.data?.userType;

          if (userType === "owner") {
            navigation.reset({ index: 0, routes: [{ name: "OwnerDashboard" }] });
          } else if (userType === "customer") {
            navigation.reset({ index: 0, routes: [{ name: "CustomerDashboard" }] });
          }
        }
      } else {
        console.error("Failed to check profile:", data?.message);
      }
    } catch (error) {
      console.error("Cannot fetch profile completion status:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }]
      })
      // Reset all local state
      setUserType('');
      setPrinterModel('');
      setUpiId('');
      setPhone('');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  return {
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
  };
};
