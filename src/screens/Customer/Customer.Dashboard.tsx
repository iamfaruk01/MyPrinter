import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View, StatusBar, TextInput, Button, ActivityIndicator } from "react-native";
import { useHomeScreen } from "../Home/hooks/useHomeScreen";
import QRScreen from "../../components/QRScanner/QRScanner";
import { styles } from "./CustomerDashboard.styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOwnerDashboard } from "../Owner/hooks/useOwnerDashboard";
import FileTransferProgress from '../../components/Customer/FileTransferProgress'

const CustomerDashboard: React.FC = () => {
    const { handleLogout } = useHomeScreen();
    const {
        status,
        connectedEndpoint,
        messageToSend,
        setMessageToSend,
        receivedMessages,
        handleConnect,
        handleSendMessage,
        handleStopAndReset,
        handleSendFile,
        fileTransfers
    } = useOwnerDashboard();

    const [showQRScreen, setShowQRScreen] = useState(false);

    const onScanned = async (value: string) => {
        let targetDeviceName: string | null = null;
        try {
            const parsed = JSON.parse(value);
            // We now look for the deviceName in the QR code
            targetDeviceName = parsed.deviceName ?? null;
            console.log("Parsed QR -> Target Device Name:", targetDeviceName);
        } catch (e) {
            // This fallback is less likely to work now, but we keep it
            targetDeviceName = value;
        }

        if (!targetDeviceName) {
            Alert.alert('Scan Error', 'Scanned QR does not contain a valid device name.');
            return;
        }

        setShowQRScreen(false);
        // Call handleConnect with the TARGET's name
        await handleConnect(targetDeviceName);
    };

    const handleDisconnect = () => {
        Alert.alert(
            "Disconnect",
            "Are you sure you want to disconnect?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Yes", onPress: handleStopAndReset },
            ],
            { cancelable: true }
        );
    };

    const renderSearchingContent = () => (
        <View style={styles.container}>
            <Button title="Close" onPress={handleStopAndReset}></Button>
            <Text>Searching...</Text>
            <Text>{status}</Text>
        </View>
    );

    const renderIdleContent = () => (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Share Documents</Text>
                <TouchableOpacity style={styles.profileButton} onPress={handleLogout} activeOpacity={0.7}>
                    <View><Text>Logout</Text></View>
                </TouchableOpacity>
            </View>
            <View style={styles.mainContent}>
                <TouchableOpacity style={styles.scanCard} onPress={() => setShowQRScreen(true)} activeOpacity={0.95}>
                    <View style={styles.scanIcon}><View style={styles.qrIconFrame} /></View>
                    <Text style={styles.scanCardTitle}>Scan QR code</Text>
                    <Text style={styles.scanCardSubtitle}>Scan to connect and share documents securely</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderQRScanner = () => (
        <View style={styles.scannerContainer}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />
            <View style={styles.scannerHeader}>
                <TouchableOpacity style={styles.backButton} onPress={() => setShowQRScreen(false)} activeOpacity={0.7}>
                    <Text style={styles.backButtonText}>×</Text>
                </TouchableOpacity>
                <Text style={styles.scannerTitle}>Scan QR code</Text>
                <View style={styles.headerSpacer} />
            </View>
            <View style={styles.cameraWrapper}>
                <QRScreen onClose={() => setShowQRScreen(false)} onScanned={onScanned} />
                <View style={styles.scannerOverlay}><View style={styles.scanFrame} /></View>
            </View>
            <View style={styles.scannerBottom}>
                <Text style={styles.scannerInstruction}>Point your camera at a QR code</Text>
            </View>
        </View>
    );

    const renderConnectingContent = () => (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.statusTextLarge}>Connecting...</Text>
            <Text style={styles.subtitle}>Please wait while we establish a secure connection.</Text>
        </View>
    );

    const renderConnectedContent = () => (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
            <View style={styles.connectedHeader}>
                <Text style={styles.connectedTitle}>Connected to {connectedEndpoint?.name || 'Peer'}</Text>
                <View style={styles.connectionStatus}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>Secure Connection</Text>
                </View>
            </View>
            <View style={styles.chatContainer}>
                <ScrollView style={styles.messageScrollView} showsVerticalScrollIndicator={false}>
                    {receivedMessages.map((msg, i) => (
                        <Text key={i} style={styles.messageText}>{msg}</Text>
                    ))}
                </ScrollView>
                
                {/* File Transfer Progress Section - Improved Styling */}
                {fileTransfers.length > 0 && (
                    <View style={styles.transferSection}>
                        <Text style={styles.transferSectionTitle}>File Transfers</Text>
                        <ScrollView 
                            style={styles.transferScrollView} 
                            showsVerticalScrollIndicator={false}
                            nestedScrollEnabled={true}
                        >
                            {fileTransfers.map(transfer => (
                                <FileTransferProgress 
                                    key={transfer.payloadId} 
                                    transfer={transfer} 
                                />
                            ))}
                        </ScrollView>
                    </View>
                )}
                
                {/* Send File Button */}
                <View style={styles.actionButtonContainer}>
                    <TouchableOpacity 
                        style={styles.sendFileButton} 
                        onPress={handleSendFile}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.sendFileButtonText}>📎 Send File</Text>
                    </TouchableOpacity>
                </View>
                
                {/* Message Input */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={messageToSend}
                        onChangeText={setMessageToSend}
                        placeholder="Type a message..."
                        multiline={false}
                        returnKeyType="send"
                        onSubmitEditing={handleSendMessage}
                    />
                    <TouchableOpacity 
                        style={[styles.sendButton, { opacity: messageToSend.trim() ? 1 : 0.5 }]} 
                        onPress={handleSendMessage} 
                        disabled={!messageToSend.trim()}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.sendButtonText}>Send</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.connectionActions}>
                <TouchableOpacity style={styles.secondaryActionButton} activeOpacity={0.9} onPress={handleDisconnect}>
                    <Text style={styles.secondaryActionText}>Disconnect</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    // --- MAIN RENDER LOGIC ---

    if (showQRScreen) {
        return <SafeAreaView style={styles.safeArea}>{renderQRScanner()}</SafeAreaView>;
    }

    if (connectedEndpoint) {
        return <SafeAreaView style={styles.safeArea}>{renderConnectedContent()}</SafeAreaView>;
    }
    if (status.startsWith('Searching')) {
        return <SafeAreaView style={styles.safeArea}>{renderSearchingContent()}</SafeAreaView>;
    }

    if (status.startsWith('Connecting')) {
        return <SafeAreaView style={styles.safeArea}>{renderConnectingContent()}</SafeAreaView>;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            {renderIdleContent()}
        </SafeAreaView>
    );
};

export default CustomerDashboard;