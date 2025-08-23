import { Dimensions, StyleSheet } from "react-native";
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
import { theme } from "../../theme"

const scanBoxSize = 300

export const styles = StyleSheet.create({
    errorContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.md,
        backgroundColor: theme.colors.surface.main,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    messageText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 22,
    },
    closeButton: {
        backgroundColor: '#007aff',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    cameraWrapper: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "black", // fallback background
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'column',
    },
    overlayTopRow: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)', // semi-transparent
    },
    overlayCenterRow: {
        flex: 3,
        flexDirection: 'row',
    },
    overlayBottomRow: {
        flex: 5,
        backgroundColor: 'rgba(0,0,0,0.5)', // semi-transparent
    },
    overlaySide: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    scanBox: {
        width: scanBoxSize,
        height: scanBoxSize,
        backgroundColor: 'transparent',
    },
    inactiveContainer: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        marginTop: theme.spacing.xl,
        backgroundColor: '#000000a0', // Semi-transparent black
    },
    inactiveText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        backgroundColor: '#00000080',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
    },

});