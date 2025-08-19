import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Animated } from 'react-native';
import { styles } from '../../screens/Home/Home.styles';

interface CombinedProfileSetupProps {
    userType: string;
    setUserType: (type: 'owner' | 'customer') => void;
    printerModel: string;
    setPrinterModel: (value: string) => void;
    upiId: string;
    setUpiId: (value: string) => void;
    handleOwnerSubmit: () => void;
}

const CombinedProfileSetup: React.FC<CombinedProfileSetupProps> = ({
    userType,
    setUserType,
    printerModel,
    setPrinterModel,
    upiId,
    setUpiId,
    handleOwnerSubmit,
}) => {
    const [currentStep, setCurrentStep] = useState(1);

    const fadeAnim1 = useRef(new Animated.Value(0)).current;
    const fadeAnim2 = useRef(new Animated.Value(0)).current;
    const fadeAnim3 = useRef(new Animated.Value(0)).current;
    const fadeAnim4 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Animate step 1 on mount
        Animated.timing(fadeAnim1, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    useEffect(() => {
        if (userType === 'owner' && currentStep === 1) {
            setCurrentStep(2);
            // Animate step 2 after owner selection
            Animated.timing(fadeAnim2, {
                toValue: 1,
                duration: 500,
                delay: 200,
                useNativeDriver: true,
            }).start();

            // Animate step 3 after step 2
            Animated.timing(fadeAnim3, {
                toValue: 1,
                duration: 500,
                delay: 700,
                useNativeDriver: true,
            }).start();

            // Animate step 4 after step 3
            Animated.timing(fadeAnim4, {
                toValue: 1,
                duration: 500,
                delay: 1200,
                useNativeDriver: true,
            }).start();
        }
    }, [userType]);

    const handleUserTypeSelection = (type: 'owner' | 'customer') => {
        setUserType(type);
    };

    const handleEditUserType = () => {
        setUserType('' as 'owner' | 'customer');
        // Reset animations for steps 2-4
        fadeAnim2.setValue(0);
        fadeAnim3.setValue(0);
        fadeAnim4.setValue(0);
        setCurrentStep(1);
    };

    return (
        <View style={styles.card}>
            {/* Step 1: Who are you? */}
            <Animated.View
                style={{
                    opacity: fadeAnim1,
                    transform: [{ translateY: fadeAnim1.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
                    marginBottom: 16,
                }}
            >
                <Text style={styles.title}>Complete your profile</Text>
                <Text style={styles.title2}>1. Who are you?</Text>

                {userType === '' ? (
                    // Show selection buttons
                    <>
                        <TouchableOpacity
                            style={[styles.button, styles.secondaryButton]}
                            onPress={() => handleUserTypeSelection('owner')}
                        >
                            <Text style={styles.buttonTextSecondary}>Printer Owner</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.secondaryButton]}
                            onPress={() => handleUserTypeSelection('customer')}
                        >
                            <Text style={styles.buttonTextSecondary}>Customer</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    // Show selected option with edit button
                    <TouchableOpacity onPress={handleEditUserType} style={{ padding: 4 }}>
                        <View style={[styles.button, styles.secondaryButton, styles.secondaryButtonPencil]}>
                            <Text style={[styles.buttonTextSecondary]}>
                                {userType === 'owner' ? 'Printer Owner' : 'Customer'}
                            </Text>
                            <Text style={{ fontSize: 16, color: '#666' }}>✏️</Text>
                        </View>
                    </TouchableOpacity>
                )}
            </Animated.View>

            {/* Step 2: Printer Model (only for owners) */}
            {userType === 'owner' && (
                <Animated.View
                    style={{
                        opacity: fadeAnim2,
                        transform: [{ translateY: fadeAnim2.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
                        marginBottom: 16,
                    }}
                >
                    <Text style={styles.title2}>2. Select your printer model:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Printer Model Name"
                        value={printerModel}
                        onChangeText={setPrinterModel}
                        placeholderTextColor={'gray'}
                    />
                </Animated.View>
            )}

            {/* Step 3: UPI ID (only for owners) */}
            {userType === 'owner' && (
                <Animated.View
                    style={{
                        opacity: fadeAnim3,
                        transform: [{ translateY: fadeAnim3.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
                        marginBottom: 16,
                    }}
                >
                    <Text style={styles.title2}>3. Enter your UPI ID:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="UPI ID"
                        value={upiId}
                        onChangeText={setUpiId}
                        placeholderTextColor={'gray'}
                    />
                </Animated.View>
            )}

            {/* Step 4: Save Button (only for owners) */}
            {userType === 'owner' && (
                <Animated.View
                    style={{
                        opacity: fadeAnim4,
                        transform: [{ translateY: fadeAnim4.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
                        marginBottom: 16,
                    }}
                >
                    <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleOwnerSubmit}>
                        <Text style={styles.buttonText}>Save Profile</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}
        </View>
    );
};

export default CombinedProfileSetup;