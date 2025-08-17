import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { styles } from "./LoginScreen.styles";
import { styles as stylesHome } from "../Home/Home.styles";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import useLoginHandler from "./hooks/useLoginHandler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type OtpScreenProps = StackScreenProps<RootStackParamList, "OtpScreen">;

const OtpScreen: React.FC<OtpScreenProps> = ({ route }) => {
    const {
        Otp, setOtp,
        phoneNumber, setPhoneNumber,
        errorMessage, setErrorMessage,
        verifyOtp,
        handleOtpChange, handleOtpBackspace
    } = useLoginHandler();

    const { phone } = route.params;
    const inputsRef = useRef<(TextInput | null)[]>([]);

    // Calculate how many digits are actually filled
    const filledDigits = Otp.replace(/\s/g, "").length;

    const focusCurrentOtpBox = () => {
        const currentIndex = filledDigits < 4 ? filledDigits : 3;
        inputsRef.current[currentIndex]?.focus();
    };

    const activeIndex = (() => {
        const firstEmpty = Otp.split("").findIndex(val => val === " ");
        return firstEmpty === -1 ? 3 : firstEmpty;
    })();

    useEffect(() => {
        setPhoneNumber(phone);
    }, [phone, setPhoneNumber]);

    useEffect(() => {
        // Focus the first input when component mounts
        if (inputsRef.current[0]) {
            setTimeout(() => {
                inputsRef.current[0]?.focus();
            }, 100);
        }
    }, []);

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
                                style={[
                                    styles.inputBox,
                                    activeIndex === i && { borderColor: "#1976D2", borderWidth: 1 },
                                    Otp[i] && Otp[i] !== " " && { borderColor: "#1976D2", borderWidth: 1 }

                                ]}
                                keyboardType="number-pad"
                                value={Otp[i] === " " ? "" : Otp[i] || ""} // Show empty string instead of space
                                onChangeText={(text) => handleOtpChange(text, i, inputsRef.current)}
                                maxLength={1}
                                placeholderTextColor="black"
                                returnKeyType={"go"}
                                onSubmitEditing={() => {
                                    if (filledDigits === 4) {
                                        verifyOtp();
                                    }
                                }}
                                onKeyPress={({ nativeEvent }) => {
                                    if (nativeEvent.key === "Backspace") {
                                        handleOtpBackspace(i, inputsRef.current);
                                    }
                                }}
                                onFocus={() => {
                                    if (i !== activeIndex) {
                                        inputsRef.current[activeIndex]?.focus();
                                    }
                                }}
                                caretHidden={true} // Show cursor for better UX
                                selectTextOnFocus={true}
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
                            filledDigits === 4 // Use filled digits count instead of total length
                                ? styles.nextButtonEnabled
                                : styles.nextButtonDisabled,
                        ]}
                        onPress={() => {
                            if (filledDigits === 4) {
                                verifyOtp();
                            } else {
                                focusCurrentOtpBox();
                            }
                        }}
                        activeOpacity={filledDigits === 4 ? 0.7 : 1}
                    >
                        <Text style={stylesHome.actionButtonText}>Submit OTP</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
};

export default OtpScreen;