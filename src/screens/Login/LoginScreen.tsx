import React, { useRef, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styles } from './LoginScreen.styles';
import { TextInput } from 'react-native-gesture-handler';
import useLoginHandler from './hooks/useLoginHandler';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { AuthContext } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

type LoginScreenProps = StackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<LoginScreenProps> = () => {
  const navigation = useNavigation<StackScreenProps<RootStackParamList>['navigation']>();
  const { login, token, loading } = useContext(AuthContext);
  const inputRef = useRef<TextInput>(null);

  const {
    phone,
    setPhone,
    errorMessage,
    setErrorMessage,
    requestOtp
  } = useLoginHandler();

  // Focus the input to show the keyboard
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (token) {
      navigation.reset({
        index: 0,
        routes: [{
          name: 'Home',
          params: { phone: phone }
        }]
      });
    }
  }, [loading, token, navigation, phone]);
  
  // Conditional return must come after all hook calls
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1976D2" />
      </View>
    );
  }

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
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
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
              phone.length === 10 ? styles.nextButtonEnabled : styles.nextButtonDisabled
            ]}
            onPress={() => {
              if (phone.length === 10) {
                requestOtp();
              } else {
                // keep/reopen the keyboard
                inputRef.current?.focus();
              }
            }}
            activeOpacity={phone.length === 10 ? 0.7 : 1} // prevent "press" animation when disabled
          >
            <Text
              style={[
                styles.buttonText,
                phone.length === 10
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