import { useState, useEffect } from 'react';
import { Alert, NativeModules, NativeEventEmitter, Platform, Linking } from 'react-native';
import Device from 'react-native-device-info';
import { PERMISSIONS, requestMultiple, checkMultiple, RESULTS, Permission } from 'react-native-permissions';

const { NearbyModule } = NativeModules;

interface Endpoint {
  id: string;
  name: string;
}

// Event interfaces to match native code
interface EndpointFoundEvent {
    endpointId: string;
    endpointName: string;
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
  const [connectedEndpoint, setConnectedEndpoint] = useState<Endpoint | null>(null);
  const [messageToSend, setMessageToSend] = useState('');
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);
  const [nearbyEventEmitter, setNearbyEventEmitter] = useState<NativeEventEmitter | null>(null);
  const [qrData, setQrData] = useState<string | null>(null);

  useEffect(() => {
    Device.getDeviceName().then(name => {
      console.log('[useOwnerDashboard] device name fetched:', name);
      setDeviceName(name);
    });

    if (NearbyModule) {
      console.log('[useOwnerDashboard] NearbyModule available, creating event emitter');
      setNearbyEventEmitter(new NativeEventEmitter(NearbyModule));
    } else {
      console.warn('[useOwnerDashboard] NearbyModule not available');
      Alert.alert('Error', 'Nearby functionality is not available on this device');
    }
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
      const isBlocked = Object.values(requestResults).some(s => s === RESULTS.BLOCKED);
      if (isBlocked) {
        Alert.alert(
          'Permissions Required',
          'Permissions were permanently denied. Please enable them in settings.',
          [{ text: 'Cancel', style: 'cancel' }, { text: 'Open Settings', onPress: () => Linking.openSettings() }]
        );
      } else {
        Alert.alert('Permissions Denied', 'All required permissions must be granted.');
      }
      return false;
    } catch (error) {
      console.error('[useOwnerDashboard] Permission error:', error);
      return false;
    }
  };

  useEffect(() => {
    if (!nearbyEventEmitter) return;
    const listeners = [
      // --- CORRECTED to use endpointId and endpointName ---
      nearbyEventEmitter.addListener('onEndpointFound', (event: EndpointFoundEvent) => {
        setDiscoveredEndpoints(prev =>
          prev.some(e => e.id === event.endpointId) ? prev : [...prev, { id: event.endpointId, name: event.endpointName }]
        );
      }),
      nearbyEventEmitter.addListener('onEndpointLost', (event: { endpointId: string }) => {
        setDiscoveredEndpoints(prev => prev.filter(e => e.id !== event.endpointId));
      }),
      // --- CORRECTED to use endpointId and endpointName ---
      nearbyEventEmitter.addListener('onConnectionInitiated', (event: EndpointFoundEvent) => {
        Alert.alert(
          'Connection Request',
          `Accept connection from ${event.endpointName}?`,
          [
            { text: 'Reject', style: 'cancel', onPress: () => NearbyModule?.rejectConnection(event.endpointId) },
            { text: 'Accept', onPress: () => NearbyModule?.acceptConnection(event.endpointId) }
          ]
        );
      }),
      nearbyEventEmitter.addListener('onConnectionResult', (event: { success: boolean, endpointId: string }) => {
        const endpoint = discoveredEndpoints.find(e => e.id === event.endpointId) || { id: event.endpointId, name: 'Peer' };
        if (event.success) {
          setStatus('Connected');
          setConnectedEndpoint(endpoint);
          setDiscoveredEndpoints([]);
        } else {
          setStatus('Connection Failed');
          setConnectedEndpoint(null);
        }
      }),
      nearbyEventEmitter.addListener('onDisconnected', (event: { endpointId: string }) => {
        setStatus('Disconnected');
        setConnectedEndpoint(null);
      }),
      nearbyEventEmitter.addListener('onPayloadReceived', (event: { message: string }) => {
        setReceivedMessages(prev => [...prev, `Peer: ${event.message}`]);
      }),
    ];
    return () => listeners.forEach(l => l.remove());
  }, [nearbyEventEmitter, discoveredEndpoints]);

  const handleStartAdvertising = async () => {
    if (!NearbyModule || !deviceName) return;
    if (await handlePermissions()) {
      setStatus('Advertising...');
      try {
        const result = await NearbyModule.startAdvertising(deviceName);
        setQrData(JSON.stringify(result));
      } catch (e) {
        setStatus('Advertising failed');
      }
    }
  };

  const handleStartDiscovery = async () => {
    if (!NearbyModule) return;
    if (await handlePermissions()) {
      setStatus('Discovering...');
      setDiscoveredEndpoints([]);
      try {
        await NearbyModule.startDiscovery();
      } catch (e) {
        setStatus('Discovery failed');
      }
    }
  };
  
  const handleConnect = async (targetDeviceName: string) => {
    if (!NearbyModule || !deviceName) return;
    if (!(await handlePermissions())) return;
    setStatus(`Searching for ${targetDeviceName}...`);
    setDiscoveredEndpoints([]);
    await NearbyModule.startDiscovery();
    const findEndpointPromise = new Promise<Endpoint>((resolve, reject) => {
      let listener: { remove: () => void; } | undefined;
      const timeout = setTimeout(() => {
        listener?.remove();
        reject(new Error("Device not found. Please try again."));
      }, 20000);
      // --- CORRECTED to use endpointName from the event ---
      listener = nearbyEventEmitter?.addListener('onEndpointFound', (event: EndpointFoundEvent) => {
        // Ensure endpointName is not null or undefined before calling startsWith
        if (event.endpointName && event.endpointName.startsWith(targetDeviceName)) {
          clearTimeout(timeout);
          listener?.remove();
          // Resolve with the correct Endpoint interface
          resolve({ id: event.endpointId, name: event.endpointName });
        }
      });
    });
    try {
      const targetEndpoint = await findEndpointPromise;
      // await NearbyModule.stopDiscovery();
      setStatus(`Connecting to ${targetEndpoint.name}...`);
      await NearbyModule.connectToEndpoint(targetEndpoint.id, deviceName);
    } catch (error: any) {
      Alert.alert('Connection Error', error.message);
      await handleStopAndReset();
    }
  };

  const handleSendMessage = async () => {
    if (!NearbyModule || !connectedEndpoint || !messageToSend.trim()) return;
    try {
      await NearbyModule.sendPayload(connectedEndpoint.id, messageToSend.trim());
      setReceivedMessages(prev => [...prev, `You: ${messageToSend.trim()}`]);
      setMessageToSend('');
    } catch (e) {
      console.error('[useOwnerDashboard] sendPayload failed:', e);
    }
  };

  const handleStopAndReset = async () => {
    if (!NearbyModule) return;
    try {
      await NearbyModule.stopAllEndpoints();
    } catch (e) {
      console.error('[useOwnerDashboard] stopAllEndpoints failed:', e);
    } finally {
      setStatus('Idle');
      setDiscoveredEndpoints([]);
      setConnectedEndpoint(null);
      setReceivedMessages([]);
      setQrData(null);
    }
  };

  return {
    status, deviceName, discoveredEndpoints, connectedEndpoint, messageToSend,
    setMessageToSend, receivedMessages, handleStartAdvertising, handleStartDiscovery,
    handleConnect, handleSendMessage, handleStopAndReset, qrData
  };
};