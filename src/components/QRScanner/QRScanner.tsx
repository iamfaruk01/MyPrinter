// QRScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Alert, StyleSheet, Dimensions } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface QRScreenProps {
    onClose: () => void;
}

const QRScreen: React.FC<QRScreenProps> = ({ onClose }) => {
    const device = useCameraDevice('back');
    const { hasPermission, requestPermission } = useCameraPermission();
    const [isCameraActive, setIsCameraActive] = useState(false);

    useEffect(() => {
        const initializeCamera = async () => {
            if (!hasPermission) {
                const granted = await requestPermission();
                if (granted) {
                    setIsCameraActive(true);
                } else {
                    Alert.alert(
                        'Camera Permission Required',
                        'Please enable camera permission to scan QR codes.',
                        [{ text: 'OK', onPress: onClose }]
                    );
                }
            } else {
                setIsCameraActive(true);
            }
        };

        initializeCamera();
    }, [hasPermission, requestPermission, onClose]);

    // Cleanup camera when component unmounts
    useEffect(() => {
        return () => {
            setIsCameraActive(false);
        };
    }, []);

    const handleClose = () => {
        setIsCameraActive(false);
        onClose();
    };

    if (!hasPermission) {
        return (
            <View style={qrStyles.errorContainer}>
                <Text style={qrStyles.messageText}>Camera permission is required to scan QR codes</Text>
                <TouchableOpacity style={qrStyles.closeButton} onPress={onClose}>
                    <Text style={qrStyles.closeButtonText}>Close</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!device) {
        return (
            <View style={qrStyles.errorContainer}>
                <Text style={qrStyles.messageText}>No camera device found</Text>
                <TouchableOpacity style={qrStyles.closeButton} onPress={onClose}>
                    <Text style={qrStyles.closeButtonText}>Close</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={qrStyles.container}>
            <Text style={qrStyles.instructionText}>Scan QR Code</Text>
            
            <View style={qrStyles.cameraWrapper}>
                <Camera
                    style={qrStyles.camera}
                    device={device}
                    isActive={isCameraActive}
                />
    
            </View>

            <TouchableOpacity
                style={qrStyles.closeButtonOverlay}
                onPress={handleClose}
            >
                <Text style={qrStyles.closeText}>✕</Text>
            </TouchableOpacity>
            
            <Text style={qrStyles.helperText}>
                Position the QR code within the frame to scan
            </Text>
        </View>
    );
};

// Styles for QRScreen
const qrStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingVertical: 20,
        backgroundColor: 'rgba(245, 245, 245, 0.95)',
        borderRadius: 16,
    },
    errorContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    instructionText: {
        fontSize: Math.max(screenWidth * 0.045, 16), // Responsive font size, min 16px
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
        textAlign: 'center',
    },
    cameraWrapper: {
        position: 'relative',
        marginBottom: 16,
    },
    camera: {
        width: Math.min(screenWidth * 0.7, 300), // 70% of screen width, max 300px
        height: Math.min(screenWidth * 0.7, 300), // Keep it square
        borderRadius: 16,
        overflow: 'hidden',
    },
    scannerFrame: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderWidth: 2,
        borderColor: '#007aff',
        borderRadius: 16,
        backgroundColor: 'transparent',
        // Add scanning animation effect
        borderStyle: 'dashed',
    },
    closeButtonOverlay: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        width: Math.max(screenWidth * 0.12, 44), // 12% of screen width, min 44px
        height: Math.max(screenWidth * 0.12, 44), // Keep it square
        borderRadius: Math.max(screenWidth * 0.06, 22), // Half of width/height
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        marginBottom: 12,
    },
    closeText: {
        fontSize: 20,
        color: '#333',
        fontWeight: 'bold',
    },
    helperText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        maxWidth: Math.min(screenWidth * 0.8, 320), // 80% of screen width, max 320px
        lineHeight: 20,
        paddingHorizontal: 16,
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
});

export default QRScreen;