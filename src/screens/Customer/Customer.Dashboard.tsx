import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useHomeScreen } from "../Home/hooks/useHomeScreen";
import QRScreen from "../../components/QRScanner/QRScanner";
import { styles } from "./CustomerDashboard.styles";
import { SafeAreaView } from "react-native-safe-area-context";

const CustomerDashboard: React.FC = () => {
    const { handleLogout } = useHomeScreen();
    const [showQRScreen, setShowQRScreen] = useState(false);
    const openQR = () => setShowQRScreen(true);
    const closeQR = () => setShowQRScreen(false);
    
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Camera positioned at top center when QR is active */}
                {showQRScreen && (
                    <View style={styles.cameraContainer}>
                        <QRScreen onClose={closeQR} />
                    </View>
                )}
                
                {/* Center content - always visible */}
                <View style={styles.centerContent}>
                    {!showQRScreen && (
                        <>
                            <Text style={styles.title}>Customer Dashboard</Text>
                            <TouchableOpacity
                                style={styles.primaryButton}
                                onPress={openQR}
                                accessibilityLabel="Open QR scanner"
                                activeOpacity={0.8}
                            >
                                <Text style={styles.primaryButtonText}>
                                    Scan QR to share document
                                </Text>
                            </TouchableOpacity>
                            <Text style={styles.helperText}>
                                Tap the button above to scan the QR code and share documents securely.
                            </Text>
                        </>
                    )}
                </View>
                
                {/* Footer - always at bottom */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={handleLogout}
                        accessibilityLabel="Logout"
                        activeOpacity={0.8}
                    >
                        <Text style={styles.logoutButtonText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default CustomerDashboard;