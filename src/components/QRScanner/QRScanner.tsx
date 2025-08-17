// QRScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Alert, StyleSheet } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { styles } from '../../screens/Home/Home.styles';

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
                    // Alert.alert(
                    //     'Camera Permission Required',
                    //     'Please enable camera permission to scan QR codes.',
                    //     [{ text: 'OK', onPress: onClose }]
                    // );
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
            <View style={[styles.container, qrStyles.centerContainer]}>
                <StatusBar barStyle="light-content" backgroundColor="#1976D2" />
                <Text style={qrStyles.messageText}>Camera permission is required to scan QR codes</Text>
                <TouchableOpacity style={qrStyles.closeButton} onPress={onClose}>
                    <Text style={qrStyles.closeButtonText}>Close</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!device) {
        return (
            <View style={[styles.container, qrStyles.centerContainer]}>
                <StatusBar barStyle="light-content" backgroundColor="#1976D2" />
                <Text style={qrStyles.messageText}>No camera device found</Text>
                <TouchableOpacity style={qrStyles.closeButton} onPress={onClose}>
                    <Text style={qrStyles.closeButtonText}>Close</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={qrStyles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1976D2" />
            <View style={qrStyles.instructionContainer}>
                <Text style={qrStyles.instructionText}>
                    Scan the QR code to share the document
                </Text>
            </View>
            <View style={qrStyles.cameraContainer}>
                <Camera
                    style={qrStyles.camera}
                    device={device}
                    isActive={isCameraActive}
                // Add code scanner if available
                // codeScanner={codeScanner}
                />

                <TouchableOpacity
                    style={qrStyles.closeButtonOverlay}
                    onPress={handleClose}
                >
                    <Text style={qrStyles.closeText}>✕</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// Additional styles for QRScreen
const qrStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ebe5e5ff',
    },
    centerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    messageText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    cameraContainer: {
        flex: 1,
        margin: 20,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
    },
    camera: {
        flex: 1,
    },
    closeButtonOverlay: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    closeText: {
        fontSize: 18,
        color: '#333',
        fontWeight: 'bold',
    },
    instructionContainer: {
        padding: 20,
        backgroundColor: '#fff',
    },
    instructionText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
    },
    closeButton: {
        backgroundColor: '#1976D2',
        paddingHorizontal: 20,
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