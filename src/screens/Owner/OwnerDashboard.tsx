// OwnerDashboard.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { useHomeScreen } from '../Home/hooks/useHomeScreen';
import { useOwnerDashboard } from './hooks/useOwnerDashboard';
import { styles } from './OwnerDashboard.styles';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

const OwnerDashboard = () => {
  const { handleLogout } = useHomeScreen();
  const [isLoading, setIsLoading] = useState(false);

  const {
    connectionStatus,
    connectionStatusLabel,
    discoveredEndpoints,
    connectedEndpoints,
    messageToSend,
    setMessageToSend,
    fileTransfers,
    receivedMessages,
    handleStartAdvertising,
    handleStartDiscovery,
    handleConnectToEndpoint,
    handleDisconnectFromEndpoint,
    handleStopAndReset,
    handleSendFile,
    handleSendMessage,
    qrData,
  } = useOwnerDashboard();

  const isAdvertising = connectionStatus === 'ADVERTISING';
  const isConnected = connectedEndpoints.length > 0;
  const showQr = isAdvertising || isConnected;

  // ---- Small renderers ----
  const renderQrCard = () => (
    <View style={styles.qrCodePlaceholder}>
      {showQr ? (
        <>
          {qrData ? (
            <QRCode value={qrData} size={200} />
          ) : (
            <View style={styles.backgroundQr}>
              <QRCode
                value={'device'}
                size={200}
                color="black"
                backgroundColor="transparent"
              />
            </View>
          )}
          <Text style={styles.qrTitle}>Ask the customers to scan</Text>
        </>
      ) : (
        <>
          <View style={styles.backgroundQr}>
            <QRCode
              value="Hello! this is Faruk."
              size={200}
              color="black"
              backgroundColor="transparent"
            />
          </View>
          <Text style={styles.qrPlaceholderText}>Tap Start to generate QR</Text>
        </>
      )}
    </View>
  );

  const renderConnectedPanel = () => (
    <>
      <Text style={styles.title}>Connected Customers</Text>
      <ScrollView style={{ width: '100%', maxHeight: 150 }}>
        {connectedEndpoints.map((endpoint, index) => (
          <View key={endpoint.id} style={styles.deviceItemContainer}>
            <Text style={styles.deviceItemText}>{`${index + 1}. ${endpoint.name}`}</Text>
            <TouchableOpacity
              style={styles.disconnectButton}
              onPress={() => handleDisconnectFromEndpoint(endpoint.id)}
            >
              <Text style={styles.disconnectButtonText}>Disconnect</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={{ width: '100%', flex: 1, marginTop: 10 }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 12 }}>
          {fileTransfers.map((transfer) => (
            <View key={transfer.payloadId} style={styles.transferContainer}>
              <Text>{transfer.filename}</Text>
              <Text>
                {transfer.status} - {(transfer.progress * 100).toFixed(0)}%
              </Text>
            </View>
          ))}

          {receivedMessages.map((msg, i) => (
            <View key={i} style={styles.messageContainer}>
              <Text
                style={
                  msg.startsWith('You:')
                    ? styles.sentMessage
                    : styles.receivedMessage
                }
              >
                {msg}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </>
  );

  const renderControlPanel = () => {
    if (isConnected) return renderConnectedPanel();

    return (
      <>
        {!isAdvertising && !isLoading && (
          <TouchableOpacity
            style={[styles.startButton]}
            onPress={async () => {
              if (isLoading || isAdvertising) return;
              try {
                setIsLoading(true);
                await handleStartAdvertising();
              } catch (err) {
                console.error('Start failed', err);
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={isLoading}
          >
            <Text style={styles.startButtonText}>Start</Text>
          </TouchableOpacity>
        )}

        {!isAdvertising && isLoading && (
          <View
            style={[
              styles.startButton,
              styles.disabledButton,
              { justifyContent: 'center', alignItems: 'center' },
            ]}
          >
            <ActivityIndicator size="large" color="white" />
          </View>
        )}

        {isAdvertising && (
          <TouchableOpacity
            style={[styles.startButton, styles.stopButton]}
            onPress={async () => {
              try {
                setIsLoading(true);
                await handleStopAndReset();
              } catch (err) {
                console.error('Stop failed', err);
              } finally {
                setIsLoading(false);
              }
            }}
          >
            <Text style={styles.startButtonText}>Stop</Text>
          </TouchableOpacity>
        )}
      </>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={styles.topPanel}>{renderQrCard()}</View>
      <View style={styles.divider} />
      <View style={styles.bottomPanel}>{renderControlPanel()}</View>

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
                    setIsLoading(true);
                    await handleStopAndReset();
                  } catch (err) {
                    console.error('Reset failed', err);
                  } finally {
                    setIsLoading(false);
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
    </SafeAreaView>
  );
};

export default OwnerDashboard;
