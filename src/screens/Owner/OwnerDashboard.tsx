import React from 'react';
import { View, Text, TouchableOpacity, Button, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { useHomeScreen } from '../Home/hooks/useHomeScreen';
import { useOwnerDashboard } from './hooks/useOwnerDashboard';
import { styles } from './OwnerDashboard.styles';

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

  const renderActionContent = () => (
    <>
      <Text style={styles.title}>{status}...</Text>
      {discoveredEndpoints.length === 0 ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <ScrollView style={{ width: '100%' }}>
          {discoveredEndpoints.map(endpoint => (
            <View key={endpoint.id} style={styles.device}>
              <Text>{endpoint.name}</Text>
              <Button title="Connect" onPress={() => handleConnect(endpoint.id)} />
            </View>
          ))}
        </ScrollView>
      )}
    </>
  );

  const renderConnectedContent = () => (
    <View style={{ width: '100%', alignItems: 'center' }}>
      <Text style={styles.title}>Connected!</Text>
      <TextInput
        style={styles.input}
        value={messageToSend}
        onChangeText={setMessageToSend}
        placeholder="Type a message"
      />
      <Button title="Send" onPress={handleSendMessage} disabled={!messageToSend.trim()} />
      <ScrollView>
        {receivedMessages.map((msg, i) => (
          <Text key={i}>{msg}</Text>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.statusText}>Current Status: {status}</Text>
      {connectedEndpoint
        ? renderConnectedContent()
        : status === 'Discovering...' || status === 'Advertising...'
        ? renderActionContent()
        : renderIdleContent()}
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
