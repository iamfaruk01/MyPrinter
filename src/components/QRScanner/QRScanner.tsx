import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';
import { styles } from "./QRScanner.styles"

interface QRScreenProps {
    onScanned: (value: string) => void; // new prop
}

const QRScreen: React.FC<QRScreenProps> = ({ onScanned }) => {
    const device = useCameraDevice('back');
    const { hasPermission, requestPermission } = useCameraPermission();
    const [isCameraActive, setIsCameraActive] = useState(false);

    // one-shot guard to prevent multiple fires
    const scannedRef = useRef(false);
    const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const codeScanner = useCodeScanner({
        codeTypes: ['qr', 'ean-13'],
        onCodeScanned: (codes) => {
            if (scannedRef.current) return; // already handled
            if (codes.length === 0) return;

            const value = codes[0]?.value;
            if (!value) return;

            // mark scanned to prevent repeats
            scannedRef.current = true;

            console.log('Scanned:', value);

            // notify parent
            try {
                onScanned(value);
            } catch (e) {
                console.warn('onScanned handler error', e);
            }
        },
    });

    useEffect(() => {
        const initializeCamera = async () => {
            if (!hasPermission) {
                const granted = await requestPermission();
                if (granted) setIsCameraActive(true);
                else {
                    Alert.alert('Camera Permission Required', 'Please enable camera permission to scan QR codes.', [{ text: 'OK', onPress: onClose }]);
                }
            } else setIsCameraActive(true);
        };
        initializeCamera();

        // reset guard when component unmounts / mounts again
        scannedRef.current = false;

        return () => { setIsCameraActive(false); scannedRef.current = false; };
    }, [hasPermission, requestPermission]);

    // Cleanup camera when component unmounts
    useEffect(() => {
        return () => {
            setIsCameraActive(false);
        };
    }, []);

    useEffect(() => {
        if (isCameraActive) {
            idleTimerRef.current = setTimeout(() => {
                console.log('Camera has been idle for 7 seconds. Deactivating.');
                setIsCameraActive(false);
            }, 10000)
        }
        return () => {
            if (idleTimerRef.current) {
                clearTimeout(idleTimerRef.current);
            }
        };
    }, [isCameraActive])

    const handleClose = () => {
        setIsCameraActive(false);
    };

    const handleScreenTap = () => {
        if (!isCameraActive) {
            console.log('Reactivating camera on tap.');
            scannedRef.current = false; // Reset the guard to allow a new scan
            setIsCameraActive(true);
        }
    };

    if (!hasPermission) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.messageText}>Camera permission is required to scan QR codes</Text>
                <TouchableOpacity style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!device) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.messageText}>No camera device found</Text>
                <TouchableOpacity style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <>
            <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
            <TouchableOpacity style={styles.cameraWrapper} onPress={handleScreenTap} activeOpacity={1}>
                {isCameraActive ? (
                    <>
                        <Camera
                            style={StyleSheet.absoluteFill}
                            device={device}
                            isActive={isCameraActive}
                            codeScanner={codeScanner}
                        />
                        <View style={styles.overlay}>
                            <View style={styles.overlayTopRow} />
                            <View style={styles.topPart}>
                                <Text style={styles.instructionsText}>Align QR within the frame</Text>
                            </View>
                            <View style={styles.overlayCenterRow}>
                                <View style={styles.overlaySide} />
                                <View style={styles.scanBox} />
                                <View style={styles.overlaySide} />
                            </View>
                            <View style={styles.overlayBottomRow} />
                        </View>
                    </>
                ) : (
                    <View style={styles.inactiveContainer}>
                        <Text style={styles.inactiveText}>Tap here to Scan</Text>
                    </View>
                )}

            </TouchableOpacity>
        </>
    );
};



export default QRScreen;