import { TouchableOpacity, View } from "react-native";
import { Text } from 'react-native'
import { styles } from "./LoginScreen.styles"
import React from "react";
import { TextInput } from "react-native-gesture-handler";
import { styles as stylesHome } from "../Home/Home.styles";
import useLoginHandler from "./hooks/useLoginHandler";

const OtpScreen: React.FC = () => {
    const {
        Otp, setOtp,
        errorMessage, setErrorMessage,
        handleOtp
    } = useLoginHandler()
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder='Enter the OTP'
                keyboardType='number-pad'
                value={Otp}
                onChangeText={(text) => {
                    setOtp(text)
                    if (errorMessage) setErrorMessage(null)
                }}
                maxLength={4}
                placeholderTextColor={'black'}
                autoFocus={true}
                returnKeyType='go'
                onSubmitEditing={handleOtp}
            />
            <TouchableOpacity
                style={[stylesHome.actionButton, stylesHome.primaryButton]}
                onPress={handleOtp}
            >
                <Text style={stylesHome.actionButtonText}>Submit OTP</Text>
            </TouchableOpacity>
            {errorMessage && 
                <Text style={styles.errorMessageText}>{errorMessage}</Text>
            }
        </View>
    )
}

export default OtpScreen;