import React, { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    StatusBar,
    Button,
    ActivityIndicator
} from "react-native";
import QRScreen from "../../components/QRScanner/QRScanner";
import { styles } from "./CustomerDashboard.styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOwnerDashboard } from "../Owner/hooks/useOwnerDashboard";
import FileTransferProgress from '../../components/Customer/FileTransferProgress';

const CustomerDashboard: React.FC = () => {
    // Local state to hold the name of the device we want to connect to
    const [targetDeviceName, setTargetDeviceName] = useState<string | null>(null);

    const {
        connectionStatus,
        connectionStatusLabel,
        connectedEndpoints,
        discoveredEndpoints,
        receivedMessages,
        handleStartDiscovery,
        handleConnectToEndpoint,
        handleStopAndReset,
        handleSendFile,
        fileTransfers,
        handleStopAndResetCustomer
    } = useOwnerDashboard();

    // Effect to connect automatically once the target device is discovered
    useEffect(() => {
        if (targetDeviceName && discoveredEndpoints.length > 0) {
            const endpoint = discoveredEndpoints.find(e => e.name === targetDeviceName);
            if (endpoint) {
                // Found the device, now attempt to connect
                handleConnectToEndpoint(endpoint.id);
                // Reset the target name to prevent re-connecting
                setTargetDeviceName(null);
            }
        }
    }, [discoveredEndpoints, targetDeviceName, handleConnectToEndpoint]);


    const onScanned = async (value: string) => {
        let parsedName: string | null = null;
        try {
            const parsed = JSON.parse(value);
            parsedName = parsed.deviceName ?? null;
        } catch (e) {
            Alert.alert('Scan Error', 'The scanned QR code is not valid.');
            return;
        }

        if (!parsedName) {
            Alert.alert('Scan Error', 'Scanned QR does not contain a device name.');
            return;
        }

        // Set the target device name and start searching for it
        setTargetDeviceName(parsedName);
        await handleStartDiscovery();
    };

    const handleDisconnect = () => {
        Alert.alert(
            "Disconnect",
            "Are you sure you want to disconnect?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Yes", onPress: handleStopAndResetCustomer },
            ],
            { cancelable: true }
        );
    };

    const renderSearchingContent = () => (
        <View style={styles.container}>
            <Button title="Cancel" onPress={handleStopAndReset} />
            <ActivityIndicator size="large" style={{ marginVertical: 20 }} />
            <Text>Searching for {targetDeviceName || 'device'}...</Text>
            <Text>{connectionStatusLabel}</Text>
        </View>
    );

    const renderQRScanner = () => (
        <QRScreen onScanned={onScanned} />
    );

    const renderConnectedContent = () => (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
            <View style={styles.connectedHeader}>
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

                {/* File Transfer Progress Section */}
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
            </View>
            <View style={styles.connectionActions}>
                <TouchableOpacity style={styles.secondaryActionButton} activeOpacity={0.9} onPress={handleDisconnect}>
                    <Text style={styles.secondaryActionText}>Disconnect</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    // --- Conditional Rendering Logic ---

    if (connectedEndpoints.length > 0) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
                {renderConnectedContent()}
            </SafeAreaView>
        );
    }

    if (connectionStatus === 'DISCOVERING') {
         return (
            <SafeAreaView style={styles.safeArea}>
                <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
                {renderSearchingContent()}
            </SafeAreaView>
        );
    }

    // Default view: Show the QR scanner
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle={'light-content'} backgroundColor={'black'} />
            <View style={styles.mainContainer}>
                {renderQRScanner()}

                <View style={styles.bottomPart}>
                    <View style={styles.instructionBox}>
                        <Text style={styles.scannerInstruction}>Instructions</Text>
                        <Text style={styles.scannerSubtext}>Step 1: Scan QR on the shopkeeper's device</Text>
                        <Text style={styles.scannerSubtext}>Step 2: Select a document to send</Text>
                        <Text style={styles.scannerSubtext}>Step 3: Pay the amount</Text>
                        <Text style={styles.scannerSubtext}>DONE!</Text>
                    </View>
                </View>
                <TouchableOpacity
                        activeOpacity={0.85}
                        style={styles.emergencyButton}
                        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                        accessibilityLabel="Emergency reset"
                        onPress={() =>
                          Alert.alert(
                            'Confirm reset',
                            'Are you sure you want to stop and reset immediately?',
                            [
                              { text: 'No', style: 'cancel' },
                              {
                                text: 'Yes',
                                style: 'destructive',
                                onPress: async () => {
                                  try {
                                    // setIsLoading(true);
                                    await handleStopAndReset();
                                  } catch (err) {
                                    console.error('Reset failed', err);
                                  } finally {
                                    // setIsLoading(false);
                                  }
                                },
                              },
                            ],
                            { cancelable: true }
                          )
                        }
                      >
                        <Text style={styles.emergencyButtonText}>Reset</Text>
                      </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default CustomerDashboard;