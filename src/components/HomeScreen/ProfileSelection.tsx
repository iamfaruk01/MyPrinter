import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../../screens/Home/Home.styles';

interface ProfileSelectionProps {
    setUserType: (type: 'owner' | 'customer') => void;
}

const ProfileSelection: React.FC<ProfileSelectionProps> = ({ setUserType }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>Complete your profile</Text>
            <Text style={[styles.title2]}>Who are you?</Text>
            <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={() => setUserType('owner')}
            >
                <Text style={styles.buttonTextSecondary}>Printer Owner</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={() => setUserType('customer')}
            >
                <Text style={styles.buttonTextSecondary}>Customer</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ProfileSelection;
