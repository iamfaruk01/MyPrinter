import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 50,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#6b7280',
        marginBottom: 4,
    },
    phoneNumber: {
        fontSize: 14,
        color: '#9ca3af',
    },
    title2: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 30,
        color: '#333',
        textAlign: 'center',
    },
    phoneInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#E1E5E9',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 4,
        marginBottom: 20,
        backgroundColor: '#FAFBFC',
        height: 56,
        // Focus state will be handled programmatically
    },
    phoneInputFocused: {
        borderColor: '#1976D2',
        backgroundColor: '#fff',
        shadowColor: '#1976D2',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    countryCode: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginRight: 8,
    },
    input: {
        flex: 1,
        height: 48,
        fontSize: 16,
        color: '#333',
        paddingVertical: 0, // Remove default padding for better alignment
    },
    inputBoxContainer: {
        flexDirection: "row"
    },
    inputBox: {
        width: 50,
        height: 50,
        borderWidth: 1,
        borderColor: "#333",
        textAlign: "center",
        fontSize: 20,
        margin: 5,
        borderRadius: 8
    },
    footer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 4,
        paddingBottom: 20,
        paddingTop: 20,
    },
    termsText: {
        textAlign: 'center',
        fontSize: 13,
        color: '#666',
        marginBottom: 24,
        lineHeight: 18,
        paddingHorizontal: 10,
    },
    nextButton: {
        width: '100%',
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 16,
    },
    nextButtonEnabled: {
        backgroundColor: '#1976D2',
        shadowColor: '#1976D2',
        shadowOpacity: 0.25,
    },
    nextButtonDisabled: {
        backgroundColor: '#E8EAF0',
        shadowColor: 'transparent',
        shadowOpacity: 0,
        elevation: 0,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    buttonTextEnabled: {
        color: '#FFFFFF',
    },
    buttonTextDisabled: {
        color: '#A0A4A8',
    },
    errorMessageText: {
        color: '#DC3545',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 8,
        fontWeight: '500',
        backgroundColor: '#FFF5F5',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#FECACA',
        width: '100%',
    },
    // Loading state for button
    nextButtonLoading: {
        backgroundColor: '#1565C0',
        opacity: 0.8,
    },
    // Additional utility styles
    textInput: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    // Accessibility improvements
    accessibilityFocus: {
        borderColor: '#1976D2',
        borderWidth: 2,
    },
    // Dark mode support (optional)
    containerDark: {
        backgroundColor: '#1A1A1A',
    },
    titleDark: {
        color: '#FFFFFF',
    },
    phoneInputContainerDark: {
        borderColor: '#404040',
        backgroundColor: '#2A2A2A',
    },
    inputDark: {
        color: '#FFFFFF',
    },
});