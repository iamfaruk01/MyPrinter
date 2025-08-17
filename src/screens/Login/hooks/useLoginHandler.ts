import { useState } from "react";
import { TextInput } from "react-native";
import { useNavigation, createStaticNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {createNativeStackNavigator} from "@react-navigation/native-stack"
import { RootStackParamList } from "../../../navigation/AppNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../../../../config";

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

export default function useLoginHandler() {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const [phoneNumber, setPhoneNumberState] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [Otp, setOtp] = useState("    "); // 4 spaces initially

    const setPhoneNumber = (text: string) => {
        const digitsOnly = text.replace(/[^0-9]/g, "");
        setPhoneNumberState(digitsOnly);
    };

    const requestOtp = async () => {
        if (phoneNumber.length !== 10) {
            setErrorMessage("Phone number must be exactly 10 digits");
            return;
        }

        try {
            setErrorMessage(null);
            const response = await fetch(config.API.REQUEST_OTP, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: phoneNumber }),
            });

            const data = await response.json();

            if (response.ok && data?.body?.success) {
                navigation.navigate('OtpScreen', { phone: phoneNumber });
            } else {
                setErrorMessage(data?.body?.message || "Failed to send OTP");
            }
        } catch (error) {
            setErrorMessage("Something went wrong. Please try again.");
        }
    };

    const verifyOtp = async () => {
        // Check if OTP has 4 actual digits (not spaces)
        const otpDigits = Otp.replace(/\s/g, ""); // Remove all spaces
        if (otpDigits.length !== 4) {
            setErrorMessage("OTP must be exactly 4 digits");
            return;
        }

        try {
            setErrorMessage(null);
            const response = await fetch(config.API.VERIFY_OTP, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: phoneNumber, otp: otpDigits }), // Send only digits
            });

            const data = await response.json();
            console.log("[useLoginHandler] data:", data);

            if (response.ok && data?.body?.success) {
                if (data.body.token) {
                    await AsyncStorage.setItem("authToken", data.body.token);
                    console.log("[useLoginHandler] Token saved:", data.body.token);
                }
                navigation.reset({
                    index: 0, routes: [{
                        name: 'Home',
                        params: { phone: phoneNumber }
                    }]
                });
            } else {
                setErrorMessage(data?.body?.message || "Failed to verify OTP");
            }
        } catch (error) {
            setErrorMessage("Something went wrong. Please try again.");
        }
    };

    const handleOtpChange = (
        text: string,
        index: number,
        inputsRef: (TextInput | null)[]
    ) => {
        if (/^\d$/.test(text)) {
            // Valid digit entered
            const otpArray = Otp.split("");
            otpArray[index] = text;
            setOtp(otpArray.join(""));

            // Move to next input if not the last one
            if (index < 3) {
                setTimeout(() => {
                    inputsRef[index + 1]?.focus();
                }, 10);
            }
        } else if (text === "") {
            // Clear current digit
            const otpArray = Otp.split("");
            otpArray[index] = " ";
            setOtp(otpArray.join(""));
        }

        // Clear error message when user starts typing
        if (errorMessage) {
            setErrorMessage(null);
        }
    };

    const handleOtpBackspace = (
        index: number,
        inputsRef: (TextInput | null)[]
    ) => {
        const otpArray = Otp.split("");

        if (Otp[index] && Otp[index] !== " ") {
            // Clear current digit
            otpArray[index] = " ";
            setOtp(otpArray.join(""));
        } else if (index > 0) {
            // Move to previous input and clear it
            otpArray[index - 1] = " ";
            setOtp(otpArray.join(""));
            setTimeout(() => {
                inputsRef[index - 1]?.focus();
            }, 10);
        }

        // Clear error message
        if (errorMessage) {
            setErrorMessage(null);
        }
    };

    return {
        phoneNumber, setPhoneNumber,
        errorMessage, setErrorMessage,
        Otp, setOtp,
        requestOtp,
        verifyOtp,
        handleOtpChange, handleOtpBackspace
    };
}