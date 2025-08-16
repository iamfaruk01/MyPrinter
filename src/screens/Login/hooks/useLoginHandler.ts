import { useState } from "react";
import { TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../navigation/AppNavigator";
import config from "../../../../config";
import { set } from "mongoose";

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

export default function useLoginHandler() {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const [phoneNumber, setPhoneNumberState] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [Otp, setOtp] = useState("");

    // This ensures only numbers (0-9) are stored
    const setPhoneNumber = (text: string) => {
        console.log("Setting phone number:", text);
        const digitsOnly = text.replace(/[^0-9]/g, ""); // remove everything except digits
        setPhoneNumberState(digitsOnly);
    };

    const requestOtp = async () => {
        if (phoneNumber.length !== 10) {
            setErrorMessage("Phone number must be exactly 10 digits");
        } else {
            setErrorMessage(null);
            const response = await fetch(config.API.REQUEST_OTP, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ phone: phoneNumber }),
            });

            const responseText = await response.text();
            const data = JSON.parse(responseText);

            if (data.body.success) {
                console.log("OTP sent successfully");
                navigation.navigate('OtpScreen', {phone: phoneNumber});
            } else {
                setErrorMessage(data.message || "Failed to send OTP");
            }
        }
    };

    const verifyOtp = () => {
        if (Otp.length !== 4) {
            setErrorMessage("OTP must be exactly 4 digits");
        } else {
            setErrorMessage(null);
            navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
        }
    }

    const handleOtpChange = (
        text: string,
        index: number,
        inputsRef: (TextInput | null)[]
    ) => {
        if(/^\d$/.test(text)) {
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

        if(errorMessage) {
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
