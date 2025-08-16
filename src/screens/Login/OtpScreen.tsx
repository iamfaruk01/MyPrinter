import React, { useRef } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { styles } from "./LoginScreen.styles";
import { styles as stylesHome } from "../Home/Home.styles";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import useLoginHandler from "./hooks/useLoginHandler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type OtpScreenProps = StackScreenProps<RootStackParamList, "OtpScreen">;

const OtpScreen: React.FC<OtpScreenProps> = ({ route }) => {
    const { phone } = route.params;
    const {
        Otp, setOtp,
        errorMessage, setErrorMessage,
        verifyOtp,
        handleOtpChange
    } = useLoginHandler()

    const inputsRef = useRef<(TextInput | null)[]>([]);

    return (
        <KeyboardAwareScrollView>
                    <View style={styles.container}>
            <View style={styles.inputBoxContainer}>
                {[0, 1, 2, 3].map((i) => (
                    <TextInput
                        key={i}
                        ref={(ref) => {inputsRef.current[i] = ref}}
                        style={styles.inputBox}
                        keyboardType='number-pad'
                        value={Otp[i] ?? ""}
                        onChangeText={(text) => { handleOtpChange(text, i, inputsRef.current) }}
                        maxLength={1}
                        placeholderTextColor={'black'}
                        autoFocus={i === 0}
                        returnKeyType='go'
                        onSubmitEditing={verifyOtp}
                    />
                ))}
            </View>

            <TouchableOpacity
                style={[stylesHome.actionButton, stylesHome.primaryButton]}
                onPress={verifyOtp}
            >
                <Text style={stylesHome.actionButtonText}>Submit OTP</Text>
            </TouchableOpacity>
            {errorMessage &&
                <Text style={styles.errorMessageText}>{errorMessage}</Text>
            }
        </View>
        </KeyboardAwareScrollView>
    )
}

export default OtpScreen;