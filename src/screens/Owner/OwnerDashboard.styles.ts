import { StyleSheet, Platform } from "react-native";
import { theme } from "../../theme";

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: theme.colors.background.default
    },
    topPanel: {
        flex: 1,
        width: '100%',
        justifyContent: 'center', // Center content vertically
        alignItems: 'center', // Center content horizontally
        // backgroundColor: 'blue'
    },
    divider: {
        height: 1,
        width: '100%',
        backgroundColor: theme.colors.divider,
    },
    bottomPanel: {
        flex: 1.5,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'yellow'

    },

    connectedPanelContainer: {
        flex: 1, // CHANGED: Now it just fills its parent (bottomPanel)
        width: '100%',
        alignItems: 'center',
        paddingTop: theme.spacing.lg, // Add some space at the top
    },
    // REMOVED: stopButtonContainer is no longer needed for layout

    qrCodePlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    // add to OwnerDashboard.styles.js
    emergencyButton: {
        position: 'absolute',
        bottom: 10,
        right: 12,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#e53935', // red for emergency - change as needed
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6, // android shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        zIndex: 1000,
    },

    emergencyButtonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 12,
        letterSpacing: 0.5,
    },

    qrCard: {
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: theme.spacing.xl,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 12,
        width: '90%',
        maxWidth: 350,
    },
    qrTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: theme.spacing.sm,
        textAlign: 'center',
    },

    backgroundQr: {
        position: 'relative',
        opacity: 0.1,
        marginBottom: theme.spacing.sm,
    },
    qrPlaceholderText: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.common.white,
        padding: 8,
        borderRadius: 8,
        backgroundColor: 'black',
        marginBottom: theme.spacing.xs,
        textAlign: 'center',
    },
    deviceItemContainer: {
        flexDirection: 'row', // Aligns items horizontally
        justifyContent: 'space-between', // Pushes name to the left and button to the right
        alignItems: 'center', // Vertically centers the text and button
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: theme.colors.surface.main,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        borderRadius: 8,
        marginBottom: 8,
        shadowColor: theme.colors.common.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 4,
    },
    deviceItemText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    disconnectButton: {
        backgroundColor: '#ff4d4d', // A clear, destructive red color
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20, // Makes it a pill-shaped button
    },
    disconnectButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    transferContainer: {
        backgroundColor: '#e6f7ff', // A light blue to indicate an info state
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#91d5ff',
    },
    startButton: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: theme.colors.status.success,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 8,

        // --- Centering ---
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center', // Center the button horizontally
        marginBottom: 20
    },
    disabledButton: {
        opacity: 0.6,
    },
    startButtonText: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold'
    },
    qrSubText: {
        fontSize: 14,
        color: '#6c757d',
        textAlign: 'center',
    },
    qrDescription: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 22,
        maxWidth: '85%',
    },
    instructionsOverlay: {
        position: 'absolute',
        bottom: 0,
        zIndex: 10,
        borderTopLeftRadius: 40,
        borderTopEndRadius: 40,
        backgroundColor: theme.colors.primary.light,
        width: "100%",
        height: "40%",
        padding: theme.spacing.md
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 10,
        textAlign: 'center'
    },
    stopButton: {
        backgroundColor: theme.colors.status.error, // Or a direct color like '#ff3b30'
    },
    resetButton: {
        height: 80,
        width: 80
    },
    messageContainer: {
        marginVertical: 4,
    },
    sentMessage: {
        backgroundColor: '#007AFF',
        color: '#ffffff',
        alignSelf: 'flex-end',
    },
    receivedMessage: {
        backgroundColor: '#E5E5EA',
        color: '#000000',
        alignSelf: 'flex-start',
    },
});