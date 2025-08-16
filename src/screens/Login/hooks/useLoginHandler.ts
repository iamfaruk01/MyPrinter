import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../navigation/AppNavigator";

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

    const handleLogin = () => {
        if (phoneNumber.length !== 10) {
            setErrorMessage("Phone number must be exactly 10 digits");
        } else {
            setErrorMessage(null);
            navigation.navigate("OtpScreen")
        }
    };

    const handleOtp = () => {
        if (Otp.length !== 4) {
            setErrorMessage("OTP must be exactly 4 digits");
        } else {
            setErrorMessage(null);
            navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
        }
    }

    return {
        phoneNumber, setPhoneNumber,
        errorMessage, setErrorMessage,
        Otp, setOtp,
        handleLogin,
        handleOtp
    };
}
