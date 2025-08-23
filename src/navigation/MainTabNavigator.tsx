import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

import CustomerDashboard from '../screens/Customer/Customer.Dashboard';
import OwnerDashboard from '../screens/Owner/OwnerDashboard';
import HistoryScreen from '../screens/History/HistoryScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Camera, House, User, History } from 'lucide-react-native';

// Define Param List for the Tabs
export type TabParamList = {
  Dashboard: { userType?: string };
  History: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export const MainTabNavigator = () => {
  const route = useRoute<RouteProp<{ Main: { userType?: string } }, 'Main'>>()
  const [userType, setUserType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detemineUserType = async () => {
      try {
        const paramUserType = route.params?.userType
        if (paramUserType) {
          console.log("UserType from navigation params:", paramUserType);
          setUserType(paramUserType);
          // Save to AsyncStorage for future use
          await AsyncStorage.setItem('userType', paramUserType);
        }
      } catch (e) {
        console.error("Failed to fetch userType", e);
        // Handle error, default to customer view
        // setUserType('customer');
      } finally {
        setIsLoading(false);
      }
    };
    detemineUserType();
  }, [route.params?.userType]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Once loaded, render the navigator with the correct dashboard
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Dashboard') {
            return <House color={color} size={size} />;
          } else if (route.name === 'History') {
            return <History color={color} size={size} />;
          } else if (route.name === 'Profile') {
            return <User color={color} size={size} />;
          }
          return <Camera color={color} size={size} />; // fallback
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={userType === 'owner' ? OwnerDashboard : CustomerDashboard}
      />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
