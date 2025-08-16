import { useState } from "react";
import { TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import config from "../../../../config";

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

export default function useLoginHandler() {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const [phoneNumber, setPhoneNumberState] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [Otp, setOtp] = useState("");

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
        if (Otp.length !== 4) {
            setErrorMessage("OTP must be exactly 4 digits");
            return;
        }

        try {
            setErrorMessage(null);
            const response = await fetch(config.API.VERIFY_OTP, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: phoneNumber, otp: Otp }),
            });

            const data = await response.json();
            console.log("[useLoginHandler] data:", data);

            if (response.ok && data?.body?.success) {
                navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
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
            const otpArray = Otp.split("");
            otpArray[index] = text;

            const newOtp = otpArray.join("").padEnd(4, "");
            setOtp(newOtp);

            if (index < 3) {
                inputsRef[index + 1]?.focus();
            }
        } else if (text === "") {
            const otpArray = Otp.split("");
            otpArray[index] = "";

            const newOtp = otpArray.join("").padEnd(4, "");
            setOtp(newOtp);

            if (index > 0) {
                inputsRef[index - 1]?.focus();
            }
        }

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
        handleOtpChange
    };
}
