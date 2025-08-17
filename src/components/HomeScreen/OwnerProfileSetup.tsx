import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Animated } from 'react-native';
import { styles } from '../../screens/Home/Home.styles';

interface OwnerProfileSetupProps {
    printerModel: string;
    setPrinterModel: (value: string) => void;
    upiId: string;
    setUpiId: (value: string) => void;
    handleOwnerSubmit: () => void;
}

const OwnerProfileSetup: React.FC<OwnerProfileSetupProps> = ({
    printerModel,
    setPrinterModel,
    upiId,
    setUpiId,
    handleOwnerSubmit,
}) => {
    const [step, setStep] = useState(1); // Step 1 active by default

    const fadeAnim1 = useRef(new Animated.Value(0)).current;
    const fadeAnim2 = useRef(new Animated.Value(0)).current;
    const fadeAnim3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Animate step 1 on mount
        Animated.timing(fadeAnim1, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();

        // Animate step 2 automatically after step 1
        Animated.timing(fadeAnim2, {
            toValue: 1,
            duration: 500,
            delay: 500,
            useNativeDriver: true,
        }).start();

        // Animate step 3 automatically after step 2
        Animated.timing(fadeAnim3, {
            toValue: 1,
            duration: 500,
            delay: 1000,
            useNativeDriver: true,
        }).start();
    }, []);

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

                {/* Selected option */}
                <View style={[styles.button, styles.secondaryButton]}>
                    <Text style={[styles.buttonTextSecondary]}>Printer Owner</Text>
                </View>
            </Animated.View>


            {/* Step 2: Printer Model */}
            {step >= 1 && (
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

            {/* Step 3: UPI ID */}
            {step >= 1 && (
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
                    <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleOwnerSubmit}>
                        <Text style={styles.buttonText}>Save Profile</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}
        </View>
    );
};

export default OwnerProfileSetup;
