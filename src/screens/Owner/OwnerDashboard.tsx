import React from 'react';
import { View, Text, TouchableOpacity, Button, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { useHomeScreen } from '../Home/hooks/useHomeScreen';
import { useOwnerDashboard } from './hooks/useOwnerDashboard';
import { styles } from './OwnerDashboard.styles';
import QRCode from 'react-native-qrcode-svg';

const OwnerDashboard = () => {
  const { handleLogout } = useHomeScreen();
  const {
    status,
    discoveredEndpoints,
    connectedEndpoint,
    messageToSend,
    setMessageToSend,
    receivedMessages,
    handleStartAdvertising,
    handleStartDiscovery,
    handleConnect,
    handleSendMessage,
    handleStopAndReset,
    qrData
  } = useOwnerDashboard();

  const renderIdleContent = () => (
    <>
      <Text style={styles.title}>File Sharing Dashboard</Text>
      <TouchableOpacity onPress={handleStartAdvertising} style={styles.button}>
        <Text style={styles.buttonText}>Receive a File (Advertise)</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleStartDiscovery} style={[styles.button, styles.discoverButton]}>
        <Text style={styles.buttonText}>Send a File (Discover)</Text>
      </TouchableOpacity>
    </>
  );

  // This function now correctly handles both advertising (showing QR) and discovering
  const renderActionContent = () => (
    <>
      <Text style={styles.title}>{status}...</Text>
      
      {/* Show QR code only when advertising */}
      {status === 'Advertising...' && qrData && (
        <View style={styles.qrContainer}>
          <QRCode value={qrData} size={200} />
          <Text style={styles.qrHelperText}>Ask the other user to scan this code.</Text>
        </View>
      )}

      {/* Show discovery list only when discovering */}
      {status === 'Discovering...' && (
        discoveredEndpoints.length === 0 ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.infoText}>Searching for nearby devices...</Text>
          </View>
        ) : (
          <ScrollView style={{ width: '100%' }}>
            {discoveredEndpoints.map(endpoint => (
              <View key={endpoint.id} style={styles.device}>
                <Text>{endpoint.name} ({endpoint.id})</Text>
                <Button title="Connect" onPress={() => handleConnect(endpoint.id)} />
              </View>
            ))}
          </ScrollView>
        )
      )}
    </>
  );

  // This function now correctly displays the connected device's name
  const renderConnectedContent = () => (
    <View style={{ width: '100%', alignItems: 'center' }}>
      <Text style={styles.title}>Connected!</Text>
      {/* Display the name of the device you are connected to */}
      <Text style={styles.subtitle}>
        Connection established with {connectedEndpoint?.name || 'peer'}.
      </Text>
      <TextInput
        style={styles.input}
        value={messageToSend}
        onChangeText={setMessageToSend}
        placeholder="Type a message"
      />
      <Button title="Send" onPress={handleSendMessage} disabled={!messageToSend.trim()} />
      <ScrollView style={styles.messageScrollView}>
        {receivedMessages.map((msg, i) => (
          <Text key={i} style={styles.messageText}>{msg}</Text>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.statusText}>Current Status: {status}</Text>
      
      {/* Main rendering logic based on connection and status */}
      {connectedEndpoint
        ? renderConnectedContent()
        : (status === 'Discovering...' || status === 'Advertising...')
          ? renderActionContent()
          : renderIdleContent()
      }
      
      {status !== 'Idle' && (
        <TouchableOpacity onPress={handleStopAndReset} style={[styles.button, styles.stopButton]}>
          <Text style={styles.buttonText}>Stop & Reset</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OwnerDashboard;