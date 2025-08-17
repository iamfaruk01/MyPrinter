import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../../screens/Home/Home.styles';

interface CustomerProfileProps {
  handleCustomerSubmit: () => void;
}

const CustomerProfile: React.FC<CustomerProfileProps> = ({ handleCustomerSubmit }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.description}>
        Your profile setup is complete. Proceed to your dashboard.
      </Text>
      <TouchableOpacity 
        style={[styles.button, styles.primaryButton]}
        onPress={handleCustomerSubmit}
      >
        <Text style={styles.buttonText}>Go to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomerProfile;
