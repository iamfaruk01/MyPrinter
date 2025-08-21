import { useState, useEffect } from 'react';
import { Alert, NativeModules, NativeEventEmitter, Platform } from 'react-native';
import Device from 'react-native-device-info';
import { PERMISSIONS, requestMultiple, checkMultiple, RESULTS, Permission } from 'react-native-permissions';

const { NearbyModule } = NativeModules;

interface Endpoint {
  id: string;
  name: string;
}

const getRequiredPermissions = (): Permission[] => {
  const permissions: Permission[] = [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION];
  const androidVersion = typeof Platform.Version === 'string' ? parseInt(Platform.Version, 10) : Platform.Version;

  if (androidVersion >= 31) {
    permissions.push(
      PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
      PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE,
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
      PERMISSIONS.ANDROID.NEARBY_WIFI_DEVICES,
    );
  }

  return permissions;
};

export const useOwnerDashboard = () => {
  const [deviceName, setDeviceName] = useState('');
  const [status, setStatus] = useState('Idle');
  const [discoveredEndpoints, setDiscoveredEndpoints] = useState<Endpoint[]>([]);
  const [connectedEndpoint, setConnectedEndpoint] = useState<string | null>(null);
  const [messageToSend, setMessageToSend] = useState('');
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);
  const [nearbyEventEmitter, setNearbyEventEmitter] = useState<NativeEventEmitter | null>(null);

  useEffect(() => {
    Device.getDeviceName().then(setDeviceName);
    if (NearbyModule) setNearbyEventEmitter(new NativeEventEmitter(NearbyModule));
    else Alert.alert('Error', 'Nearby functionality is not available on this device');
  }, []);

  const handlePermissions = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;

    try {
      const requiredPermissions = getRequiredPermissions();
      const statuses = await checkMultiple(requiredPermissions);
      const allGranted = Object.values(statuses).every(s => s === RESULTS.GRANTED);

      if (allGranted) return true;

      const requestResults = await requestMultiple(requiredPermissions);
      const wereAllGranted = Object.values(requestResults).every(s => s === RESULTS.GRANTED);

      if (wereAllGranted) return true;

      Alert.alert(
        'Permissions Required',
        'Some permissions are missing. Please enable them in settings.',
        [{ text: 'OK' }]
      );

      return false;
    } catch (error) {
      console.log('Permission error:', error);
      Alert.alert('Error', 'Failed to request permissions');
      return false;
    }
  };

  useEffect(() => {
    if (!nearbyEventEmitter) return;

    const listeners = [
      nearbyEventEmitter.addListener('onEndpointFound', event => {
        setDiscoveredEndpoints(prev =>
          prev.some(e => e.id === event.endpointId)
            ? prev
            : [...prev, { id: event.endpointId, name: event.endpointName }]
        );
      }),
      nearbyEventEmitter.addListener('onEndpointLost', event => {
        setDiscoveredEndpoints(prev => prev.filter(e => e.id !== event.endpointId));
      }),
      nearbyEventEmitter.addListener('onConnectionInitiated', event => {
        setStatus(`Accepting connection from ${event.endpointName}`);
        NearbyModule?.acceptConnection(event.endpointId);
      }),
      nearbyEventEmitter.addListener('onConnectionResult', event => {
        if (event.success) {
          setStatus(`Connected to endpoint ${event.endpointId}`);
          setConnectedEndpoint(event.endpointId);
          setDiscoveredEndpoints([]);
        } else {
          setStatus('Connection Failed');
        }
      }),
      nearbyEventEmitter.addListener('onDisconnected', () => {
        setStatus('Disconnected');
        setConnectedEndpoint(null);
      }),
      nearbyEventEmitter.addListener('onPayloadReceived', event => {
        setReceivedMessages(prev => [...prev, `From ${event.endpointId}: ${event.message}`]);
      }),
    ];

    return () => listeners.forEach(l => l.remove());
  }, [nearbyEventEmitter]);

  const handleStartAdvertising = async () => {
    if (!NearbyModule) return;
    if (await handlePermissions()) {
      setStatus('Advertising...');
      await NearbyModule.startAdvertising(deviceName);
    }
  };

  const handleStartDiscovery = async () => {
    if (!NearbyModule) return;
    if (await handlePermissions()) {
      setStatus('Discovering...');
      setDiscoveredEndpoints([]);
      await NearbyModule.startDiscovery();
    }
  };

  const handleConnect = async (endpointId: string) => {
    if (!NearbyModule) return;
    setStatus(`Connecting to ${endpointId}...`);
    await NearbyModule.connectToEndpoint(endpointId);
  };

  const handleSendMessage = async () => {
    if (!NearbyModule || !connectedEndpoint || !messageToSend.trim()) return;
    await NearbyModule.sendPayload(connectedEndpoint, messageToSend.trim());
    setMessageToSend('');
  };

  const handleStopAndReset = async () => {
    if (!NearbyModule) return;
    await NearbyModule.stopAllEndpoints();
    setStatus('Idle');
    setDiscoveredEndpoints([]);
    setConnectedEndpoint(null);
    setReceivedMessages([]);
  };

  return {
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
  };
};
