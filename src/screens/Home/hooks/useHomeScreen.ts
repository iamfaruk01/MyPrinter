import { useContext, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import config from '../../../../config';
import { AuthContext } from '../../../context/AuthContext';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/AppNavigator';

export type UserType = '' | 'owner' | 'customer';

export const useHomeScreen = () => {
  const navigation = useNavigation<StackScreenProps<RootStackParamList>['navigation']>();
  const [userType, setUserType] = useState<UserType>('');
  const [printerModel, setPrinterModel] = useState('');
  const [upiId, setUpiId] = useState('');
  const [phone, setPhone] = useState('');
  const { logout } = useContext(AuthContext);

  console.log("[useHomeScreen] usertype: ", userType);
  console.log("[useHomeScreen] phone: ", phone);

  const handleOwnerSubmit = async () => {
    const response = await fetch(config.API.SAVE_OWNER_PROFILE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: phone, userType, printerModel: printerModel, upiId: upiId })
    })

  };

  const handleCustomerSubmit = () => {
    // Logic to save customer profile, e.g., API call
    console.log('Customer Profile Saved. Navigating to dashboard...');
    // Navigate to customer's dashboard here
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
    handleLogout
  };
};
