import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Keyboard
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styles } from './LoginScreen.styles';
import { styles as stylesHome } from '../Home/Home.styles';
import { TextInput } from 'react-native-gesture-handler';
import useLoginHandler from './hooks/useLoginHandler';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type LoginScreenProps = StackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const {
    phoneNumber,
    setPhoneNumber,
    errorMessage,
    setErrorMessage,
    requestOtp
  } = useLoginHandler();

  const inputRef = useRef<TextInput>(null);

  // Focus the input to show the keyboard
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: 'white' }}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      extraScrollHeight={20}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      <View style={[styles.container]}>
        {/* Main Content */}
        <View style={{ flex: 1, paddingTop: 60 }}>
          <Text style={styles.title2}>What's your number?</Text>

          <View style={[styles.phoneInputContainer]}>
            <Text style={styles.countryCode}>+91</Text>
            <TextInput
              ref={inputRef} // Assign the ref to the TextInput
              style={styles.textInput}
              placeholder='0000000000'
              keyboardType='phone-pad'
              textContentType="telephoneNumber"
              autoComplete="tel-national"
              value={phoneNumber}
              onChangeText={(text) => {
                setPhoneNumber(text);
                if (errorMessage) setErrorMessage(null);
              }}
              maxLength={10}
              placeholderTextColor={'#A0A4A8'}
              returnKeyType='go'
              onSubmitEditing={requestOtp}
            />
          </View>
          {errorMessage && (
            <Text style={styles.errorMessageText}>{errorMessage}</Text>
          )}
        </View>

        {/* Footer - Always at bottom */}
        <View style={styles.footer}>
          <Text style={styles.termsText}>
            By continuing, you agree to the T&C and Privacy Policy
          </Text>
          <TouchableOpacity
            style={[
              styles.nextButton,
              phoneNumber.length === 10 ? styles.nextButtonEnabled : styles.nextButtonDisabled
            ]}
            onPress={() => {
              if (phoneNumber.length === 10) {
                requestOtp();
              } else {
                // keep/reopen the keyboard
                inputRef.current?.focus();
              }
            }}
            activeOpacity={phoneNumber.length === 10 ? 0.7 : 1} // prevent "press" animation when disabled
          >
            <Text
              style={[
                styles.buttonText,
                phoneNumber.length === 10
                  ? styles.buttonTextEnabled
                  : styles.buttonTextDisabled
              ]}
            >
              Next
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default LoginScreen;