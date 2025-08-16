import React, { useEffect, useRef } from "react";
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
    useEffect(() => {
        setPhoneNumber(phone)
    })
    const {
        Otp, setOtp,
        phoneNumber, setPhoneNumber,
        errorMessage, setErrorMessage,
        verifyOtp,
        handleOtpChange
    } = useLoginHandler();

    const inputsRef = useRef<(TextInput | null)[]>([]);

    const focusFirstEmpty = () => {
        const firstEmptyIndex = Otp.split("").findIndex((digit) => !digit);
        const indexToFocus = firstEmptyIndex === -1 ? 0 : firstEmptyIndex;
        inputsRef.current[indexToFocus]?.focus();
    };

    const focusCurrentOtpBox = () => {
        // Otp might be a string (e.g. "12") or an array, depending on your hook.
        // Adjusting for string here:
        const currentIndex = Otp.length < 4 ? Otp.length : 3;
        inputsRef.current[currentIndex]?.focus();
    };

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1, backgroundColor: "white" }}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            enableOnAndroid={true}
            extraScrollHeight={20}
            showsVerticalScrollIndicator={false}
            bounces={false}
        >
            <View style={[styles.container]}>
                <View style={styles.header}>
                    <Text style={[styles.subtitle, { paddingTop: 30 }]}>
                        Enter verification code
                    </Text>
                    <Text style={styles.phoneNumber}>
                        Sent to +91 {phone || "your number"}
                    </Text>

                    <View style={[styles.inputBoxContainer, { paddingTop: 30, paddingBottom: 30 }]}>
                        {[0, 1, 2, 3].map((i) => (
                            <TextInput
                                key={i}
                                ref={(ref) => {
                                    inputsRef.current[i] = ref;
                                }}
                                style={styles.inputBox}
                                keyboardType="number-pad"
                                value={Otp[i] ?? ""}
                                onChangeText={(text) =>
                                    handleOtpChange(text, i, inputsRef.current)
                                }
                                maxLength={1}
                                placeholderTextColor="black"
                                autoFocus={i === 0}
                                returnKeyType={"go"}
                                onSubmitEditing={() => {
                                    verifyOtp()
                                }}
                            />
                        ))}
                    </View>
                    {errorMessage && (
                        <Text style={styles.errorMessageText}>{errorMessage}</Text>
                    )}
                </View>

                {/* Footer - Always at bottom */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[
                            styles.nextButton,
                            Otp.length === 4
                                ? styles.nextButtonEnabled
                                : styles.nextButtonDisabled,
                        ]}
                        onPress={() => {
                            if (Otp.length === 4) {
                                verifyOtp();
                            } else {
                                focusCurrentOtpBox();
                            }
                        }}
                        activeOpacity={Otp.length === 4 ? 0.7 : 1}

                    >
                        <Text style={stylesHome.actionButtonText}>Submit OTP</Text>
                    </TouchableOpacity>


                </View>
            </View>
        </KeyboardAwareScrollView>
    );
};

export default OtpScreen;
