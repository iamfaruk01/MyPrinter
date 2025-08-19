import React, { useState, useEffect } from 'react';
import {
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    PermissionsAndroid,
    Alert,
    ActivityIndicator,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import {
    subscribeOnConnectionInfoUpdates,
    createGroup,
    removeGroup,
    getGroupInfo,
    WifiP2pInfo,
    GroupInfo,
} from 'react-native-wifi-p2p';

import { useHomeScreen } from "../Home/hooks/useHomeScreen";

const OwnerDashboard = () => {
    const { handleLogout } = useHomeScreen();

    const [connectionInfo, setConnectionInfo] = useState<WifiP2pInfo | null>(null);
    const [groupInfo, setGroupInfo] = useState<GroupInfo | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const requestPermissions = async () => {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Permission to use Wifi P2P',
                        message: 'This app needs access to your location to discover nearby devices.',
                        buttonPositive: 'OK',
                    },
                );
                console.log("🔑 Location permission status:", granted);

                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    Alert.alert('Permissions not granted', 'Cannot create network.');
                }
            } catch (e) {
                console.error("⚠️ requestPermissions error:", e);
            }
        };

        requestPermissions();

        // Listen for connection updates
        const connectionInfoSubscription = subscribeOnConnectionInfoUpdates(async (info) => {
            console.log("📡 Connection info update:", info);

            if (info.groupFormed && info.isGroupOwner) {
                console.log("✅ Group formed. You are the owner.");
                setConnectionInfo(info);
                setIsLoading(false);

                try {
                    const details = await getGroupInfo();
                    console.log("📋 Group details:", details);
                    setGroupInfo(details);
                } catch (error) {
                    console.error("❌ Failed to get group info", error);
                }
            }
        });

        return () => {
            console.log("🧹 Cleaning up: unsubscribing");
            connectionInfoSubscription.remove();
        };
    }, []);

    // ---- Group creation with retry ----
    const handleCreateGroup = async () => {
        console.log("🚀 Creating group...");
        setIsLoading(true);

        try {
            await createGroup();
            console.log("✅ Group created successfully.");
        } catch (err: any) {
            if (err.code === 2) {
                console.log("⏳ Framework busy, retrying in 3s...");
                setTimeout(async () => {
                    try {
                        await createGroup();
                        console.log("✅ Group created successfully (retry).");
                    } catch (retryErr) {
                        console.error("❌ Still failed to create group:", retryErr);
                        Alert.alert("Error", "Could not create network. Please try again.");
                        setIsLoading(false);
                    }
                }, 3000);
            } else {
                console.error("❌ Error creating group:", err);
                Alert.alert("Error", "Could not create network.");
                setIsLoading(false);
            }
        }
    };

    const handleRemoveGroup = () => {
        console.log("🛑 Removing group...");
        removeGroup()
            .then(() => {
                console.log("✅ Group removed.");
                setConnectionInfo(null);
                setGroupInfo(null);
                setIsLoading(false);
            })
            .catch(err => console.error('❌ Failed to remove group.', err));
    };

    const getQrData = () => {
        console.log("🔍 Preparing QR data...");
        if (!connectionInfo?.groupOwnerAddress?.hostAddress || !groupInfo) {
            console.log("⚠️ Missing connectionInfo or groupInfo for QR code.");
            return null;
        }

        const data = {
            ssid: groupInfo.networkName,
            passphrase: groupInfo.passphrase,
            ip: connectionInfo.groupOwnerAddress.hostAddress,
        };
        console.log("📦 QR Data:", data);
        return JSON.stringify(data);
    };

    const qrData = getQrData();

    return (
        <View style={styles.container}>
            {!qrData ? (
                <>
                    <Text style={styles.title}>Receive a File</Text>
                    <Text style={styles.subtitle}>
                        Press the button to generate a QR code for the customer to scan.
                    </Text>
                    <TouchableOpacity
                        onPress={handleCreateGroup}
                        style={[styles.button, isLoading && styles.buttonDisabled]}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.buttonText}>Generate Connection Code</Text>
                        )}
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <Text style={styles.title}>Scan to Connect</Text>
                    <Text style={styles.subtitle}>
                        The customer can now scan this code to connect and send files directly.
                    </Text>
                    <View style={styles.qrContainer}>
                        <QRCode value={qrData} size={250} />
                    </View>
                    <TouchableOpacity onPress={handleRemoveGroup} style={[styles.button, styles.stopButton]}>
                        <Text style={styles.buttonText}>Stop Receiving</Text>
                    </TouchableOpacity>
                </>
            )}

            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 40,
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginBottom: 20,
    },
    buttonDisabled: {
        backgroundColor: '#a2a2a2',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    stopButton: {
        backgroundColor: '#ff9500',
    },
    qrContainer: {
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        marginBottom: 30,
    },
    logoutButton: {
        position: 'absolute',
        bottom: 40,
        backgroundColor: '#ff3b30',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
    },
    logoutButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default OwnerDashboard;
