import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, NativeEventEmitter, NativeModules, Platform, Linking } from 'react-native';
import Device from 'react-native-device-info';
import { PERMISSIONS, requestMultiple, checkMultiple, RESULTS, Permission } from 'react-native-permissions';
import { pick, DocumentPickerResponse } from '@react-native-documents/picker';

import { NearbyModuleType } from "../types/nearby";
import {
  ConnectionStatus,
  FileTransferStatus,
  connectionStatusLabels,
  fileTransferStatusLabels, // ✅ FIX: Add the missing import here
} from "../types/connection";
import {
  Endpoint,
  EndpointFoundEvent,
  FileTransferUpdateEvent,
  FileTransferStatusNative
} from "../types/nearby";

// Native module instance
const NativeNearby = NativeModules.NearbyModule as NearbyModuleType;

// File transfer local state interface
interface FileTransferState {
  payloadId: number;
  filename: string;
  status: FileTransferStatusNative;
  progress: number;
  bytesTransferred?: number;
  totalBytes?: number;
}

const getRequiredPermissions = (): Permission[] => {
  const permissions: Permission[] = [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION];
  const androidVersion = typeof Platform.Version === 'string'
    ? parseInt(Platform.Version, 10)
    : Platform.Version;

  if (androidVersion >= 31) {
    permissions.push(
      PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
      PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE,
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
      PERMISSIONS.ANDROID.NEARBY_WIFI_DEVICES,
    );
  }

  if (androidVersion <= 28) {
    permissions.push(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
  }

  return permissions;
};

export const useOwnerDashboard = () => {
  // State declarations
  const [deviceName, setDeviceName] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('IDLE');
  const [fileTransferStatus, setFileTransferStatus] = useState<FileTransferStatus>('IDLE');
  const [discoveredEndpoints, setDiscoveredEndpoints] = useState<Endpoint[]>([]);
  const [connectedEndpoints, setConnectedEndpoints] = useState<Endpoint[]>([]);
  const [messageToSend, setMessageToSend] = useState<string>('');
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);
  const [nearbyEventEmitter, setNearbyEventEmitter] = useState<NativeEventEmitter | null>(null);
  const [qrData, setQrData] = useState<string | null>(null);
  const [fileTransfers, setFileTransfers] = useState<FileTransferState[]>([]);

  // Refs to avoid stale closures in event listeners
  const connectedEndpointsRef = useRef<Endpoint[]>([]);
  const discoveredEndpointsRef = useRef<Endpoint[]>([]);

  // Keep refs in sync with state
  useEffect(() => {
    connectedEndpointsRef.current = connectedEndpoints;
  }, [connectedEndpoints]);

  useEffect(() => {
    discoveredEndpointsRef.current = discoveredEndpoints;
  }, [discoveredEndpoints]);

  // Initialize device name and event emitter
  useEffect(() => {
    const initializeDevice = async () => {
      try {
        const name = await Device.getDeviceName();
        setDeviceName(name);
      } catch (error: any) {
        console.warn('[useOwnerDashboard] Failed to get device name:', error);
        setDeviceName('Unknown Device');
      }
    };

    initializeDevice();

    if (NativeNearby) {
      setNearbyEventEmitter(new NativeEventEmitter(NativeNearby as any));
    } else {
      Alert.alert('Error', 'Nearby functionality is not available on this device');
    }

    // Cleanup function
    return () => {
      if (NativeNearby?.stopAllEndpoints) {
        NativeNearby.stopAllEndpoints().catch((error: any) => {
          console.warn('[useOwnerDashboard] Failed to stop endpoints on cleanup:', error);
        });
      }
    };
  }, []);

  // Permission handling
  const handlePermissions = useCallback(async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;

    try {
      const requiredPermissions = getRequiredPermissions();
      const statuses = await checkMultiple(requiredPermissions);
      const allGranted = Object.values(statuses).every(status => status === RESULTS.GRANTED);

      if (allGranted) return true;

      const requestResults = await requestMultiple(requiredPermissions);
      const wereAllGranted = Object.values(requestResults).every(status => status === RESULTS.GRANTED);

      if (wereAllGranted) return true;

      const isBlocked = Object.values(requestResults).some(status => status === RESULTS.BLOCKED);

      if (isBlocked) {
        Alert.alert(
          'Permissions Required',
          'Permissions were permanently denied. Please enable them in settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() }
          ]
        );
      } else {
        Alert.alert('Permissions Denied', 'All required permissions must be granted.');
      }

      return false;
    } catch (error: any) {
      console.error('[useOwnerDashboard] Permission error:', error);
      Alert.alert('Permission Error', 'Failed to handle permissions. Please try again.');
      return false;
    }
  }, []);

  // Event listeners setup
  useEffect(() => {
    if (!nearbyEventEmitter) return;

    const listeners = [
      // Endpoint discovery
      nearbyEventEmitter.addListener('onEndpointFound', (event: EndpointFoundEvent) => {
        setDiscoveredEndpoints(prev => {
          const exists = prev.some(endpoint => endpoint.id === event.endpointId);
          if (exists) return prev;
          return [...prev, { id: event.endpointId, name: event.endpointName }];
        });
      }),

      nearbyEventEmitter.addListener('onEndpointLost', (event: { endpointId: string }) => {
        setDiscoveredEndpoints(prev => prev.filter(endpoint => endpoint.id !== event.endpointId));
      }),

      // Connection management
      nearbyEventEmitter.addListener('onConnectionInitiated', (event: EndpointFoundEvent) => {
        if (NativeNearby?.acceptConnection) {
          NativeNearby.acceptConnection(event.endpointId).catch((error: any) => {
            console.warn('[useOwnerDashboard] Failed to accept connection:', error);
          });
        }
      }),

      nearbyEventEmitter.addListener('onConnectionResult', (event: { success: boolean; endpointId: string }) => {
        const endpoint = discoveredEndpointsRef.current.find(e => e.id === event.endpointId) || {
          id: event.endpointId,
          name: 'Unknown Peer'
        };

        if (event.success) {
          setConnectedEndpoints(prev => {
            const updated = [...prev, endpoint];
            connectedEndpointsRef.current = updated;
            return updated;
          });
          setConnectionStatus('CONNECTED');
          
          // ✅ FIXED: Stop discovery when connected (for customer devices)
          if (NativeNearby?.stopDiscovery) {
            NativeNearby.stopDiscovery().catch((error: any) => {
              console.warn('[useOwnerDashboard] Failed to stop discovery after connection:', error);
            });
          }
        } else {
          setConnectionStatus('FAILED');
          Alert.alert('Connection Failed', `Failed to connect to ${endpoint.name}`);
          setTimeout(() => {
            setConnectionStatus(connectedEndpointsRef.current.length > 0 ? 'CONNECTED' : 'ADVERTISING');
          }, 2000);
        }
      }),

      nearbyEventEmitter.addListener('onDisconnected', (event: { endpointId: string }) => {
        setConnectedEndpoints(prev => {
          const updated = prev.filter(endpoint => endpoint.id !== event.endpointId);
          connectedEndpointsRef.current = updated;
          
          // ✅ FIXED: When disconnected, reset to IDLE state and stop any ongoing operations
          if (updated.length === 0) {
            setConnectionStatus('IDLE');
            setDiscoveredEndpoints([]);
            discoveredEndpointsRef.current = [];
            
            // Stop discovery if it's running
            if (NativeNearby?.stopDiscovery) {
              NativeNearby.stopDiscovery().catch((error: any) => {
                console.warn('[useOwnerDashboard] Failed to stop discovery after disconnection:', error);
              });
            }
          } else {
            setConnectionStatus('CONNECTED');
          }
          
          return updated;
        });
      }),

      // Message handling
      nearbyEventEmitter.addListener('onPayloadReceived', (event: { message: string; fromEndpointId: string }) => {
        const sender = connectedEndpointsRef.current.find(endpoint => endpoint.id === event.fromEndpointId);
        const senderName = sender?.name || 'Unknown Peer';
        setReceivedMessages(prev => [...prev, `${senderName}: ${event.message}`]);
      }),

      // File transfer handling
      nearbyEventEmitter.addListener('onFileTransferUpdate', (event: FileTransferUpdateEvent) => {
        const mapStatus = (nativeStatus: FileTransferStatusNative): FileTransferStatus => {
          switch (nativeStatus) {
            case 'IN_PROGRESS': return 'IN_PROGRESS';
            case 'SUCCESS': return 'COMPLETED';
            case 'FAILURE': case 'CANCELED': return 'FAILED';
            default: return 'FAILED';
          }
        };

        setFileTransferStatus(mapStatus(event.status));

        setFileTransfers(prev => {
          const existingIndex = prev.findIndex(transfer => transfer.payloadId === event.payloadId);

          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex] = {
              ...updated[existingIndex],
              status: event.status,
              progress: event.progress,
              bytesTransferred: event.bytesTransferred,
              totalBytes: event.totalBytes,
              filename: event.filename || updated[existingIndex].filename,
            };
            return updated;
          }

          return [...prev, {
            payloadId: event.payloadId,
            filename: event.filename || 'Unknown File',
            status: event.status,
            progress: event.progress,
            bytesTransferred: event.bytesTransferred,
            totalBytes: event.totalBytes,
          }];
        });

        if (['SUCCESS', 'FAILURE', 'CANCELED'].includes(event.status)) {
          setTimeout(() => {
            setFileTransfers(prev =>
              prev.filter(transfer => !['SUCCESS', 'FAILURE', 'CANCELED'].includes(transfer.status))
            );
            setFileTransfers(currentTransfers => {
              const hasActiveTransfers = currentTransfers.some(t => t.status === 'IN_PROGRESS');
              if (!hasActiveTransfers) {
                setFileTransferStatus('IDLE');
              }
              return currentTransfers;
            });
          }, 3000);
        }
      }),
    ];

    return () => {
      listeners.forEach(listener => listener.remove());
    };
  }, [nearbyEventEmitter]);

  // Action handlers
  const handleStartAdvertising = useCallback(async () => {
    if (!NativeNearby || !deviceName) {
      Alert.alert('Error', 'Device name not available or Nearby module not initialized');
      return;
    }
    if (!(await handlePermissions())) return;
    setConnectionStatus('ADVERTISING');
    try {
      const result = await NativeNearby.startAdvertising(deviceName);
      setQrData(JSON.stringify(result));
    } catch (error: any) {
      console.error('[useOwnerDashboard] Start advertising error:', error);
      setConnectionStatus('FAILED');
      Alert.alert('Error', 'Failed to start advertising. Please try again.');
      setTimeout(() => setConnectionStatus('IDLE'), 2000);
    }
  }, [deviceName, handlePermissions]);

  const handleStartDiscovery = useCallback(async () => {
    if (!NativeNearby) {
      Alert.alert('Error', 'Nearby module not initialized');
      return;
    }
    if (!(await handlePermissions())) return;
    setConnectionStatus('DISCOVERING');
    setDiscoveredEndpoints([]);
    discoveredEndpointsRef.current = [];
    try {
      await NativeNearby.startDiscovery();
    } catch (error: any) {
      console.error('[useOwnerDashboard] Start discovery error:', error);
      setConnectionStatus('FAILED');
      Alert.alert('Error', 'Failed to start discovery. Please try again.');
      setTimeout(() => setConnectionStatus('IDLE'), 2000);
    }
  }, [handlePermissions]);

  const handleStopAndReset = useCallback(async () => {
    if (!NativeNearby) return;
    try {
      await NativeNearby.stopAllEndpoints();
    } catch (error: any) {
      console.warn('[useOwnerDashboard] Stop all endpoints failed:', error);
    } finally {
      setConnectionStatus('IDLE');
      setFileTransferStatus('IDLE');
      setDiscoveredEndpoints([]);
      setConnectedEndpoints([]);
      setReceivedMessages([]);
      setQrData(null);
      setFileTransfers([]);
      connectedEndpointsRef.current = [];
      discoveredEndpointsRef.current = [];
    }
  }, []);

  const handleStopAndResetCustomer = useCallback(async () => {
    if (!NativeNearby) return;
    try {
      await NativeNearby.stopAllEndpoints();
    } catch (error: any) {
      console.warn('[useOwnerDashboard] Stop all endpoints failed:', error);
    } finally {
      setConnectionStatus('IDLE');
      setFileTransferStatus('IDLE');
      setDiscoveredEndpoints([]);
      setConnectedEndpoints([]);
      setReceivedMessages([]);
      setQrData(null);
      setFileTransfers([]);
      connectedEndpointsRef.current = [];
      discoveredEndpointsRef.current = [];
    }
  }, []);

  const handleDisconnectFromEndpoint = useCallback(async (endpointId: string) => {
    if (!NativeNearby) return;
    try {
      await NativeNearby.disconnectFromEndpoint(endpointId);
    } catch (error: any) {
      console.error(`[useOwnerDashboard] Failed to disconnect from ${endpointId}:`, error);
      Alert.alert('Error', `Failed to disconnect from endpoint. Please try again.`);
    }
  }, []);

  const handleSendFile = useCallback(async () => {
    if (connectedEndpointsRef.current.length === 0) {
      Alert.alert('Not Connected', 'You must be connected to a device to send a file.');
      return;
    }
    if (!NativeNearby) {
      Alert.alert('Error', 'Nearby module not initialized');
      return;
    }
    try {
      const results = await pick({
        type: ['application/pdf', 'image/*', 'text/*', 'audio/*', 'video/*'],
        copyTo: 'cachesDirectory',
      });
      if (results.length === 0) return;
      const selectedFile = results[0] as DocumentPickerResponse;
      const targetEndpoint = connectedEndpointsRef.current[0];
      const transferInfo = await NativeNearby.sendFile(targetEndpoint.id, selectedFile.uri);
      setFileTransfers(prev => [
        ...prev,
        {
          payloadId: transferInfo.payloadId,
          filename: transferInfo.filename || selectedFile.name || 'Unknown File',
          status: 'IN_PROGRESS',
          progress: 0,
        },
      ]);
      setFileTransferStatus('IN_PROGRESS');
      setReceivedMessages(prev => [
        ...prev,
        `You: (Sending file) ${selectedFile.name || 'Unknown File'}`
      ]);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'message' in error) {
        if ((error as { message: string }).message === 'User canceled document picker') {
          return;
        }
      }
      console.error('[useOwnerDashboard] File send error:', error);
      Alert.alert('Error', 'Failed to select or send file. Please try again.');
    }
  }, []);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter a message to send.');
      return;
    }
    if (connectedEndpointsRef.current.length === 0) {
      Alert.alert('Not Connected', 'You must be connected to a device to send a message.');
      return;
    }
    if (!NativeNearby) {
      Alert.alert('Error', 'Nearby module not initialized');
      return;
    }
    try {
      const targetEndpoint = connectedEndpointsRef.current[0];
      await NativeNearby.sendPayload(targetEndpoint.id, message);
      setReceivedMessages(prev => [...prev, `You: ${message}`]);
      setMessageToSend('');
    } catch (error: any) {
      console.error('[useOwnerDashboard] Send message error:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  }, []);

  const handleConnectToEndpoint = useCallback(async (endpointId: string) => {
    if (!NativeNearby || !deviceName) {
      Alert.alert('Error', 'Cannot connect: device not ready');
      return;
    }
    try {
      await NativeNearby.connectToEndpoint(endpointId, deviceName);
    } catch (error: any) {
      console.error('[useOwnerDashboard] Connect to endpoint error:', error);
      Alert.alert('Error', 'Failed to connect to endpoint. Please try again.');
    }
  }, [deviceName]);

  return {
    // State
    deviceName,
    connectionStatus,
    connectionStatusLabel: connectionStatusLabels[connectionStatus],
    fileTransferStatus,
    fileTransferStatusLabel: fileTransferStatusLabels[fileTransferStatus],
    discoveredEndpoints,
    connectedEndpoints,
    messageToSend,
    setMessageToSend,
    receivedMessages,
    qrData,
    fileTransfers,

    // Actions
    handleStartAdvertising,
    handleStartDiscovery,
    handleStopAndReset,
    handleDisconnectFromEndpoint,
    handleSendFile,
    handleSendMessage,
    handleConnectToEndpoint,
    handleStopAndResetCustomer
  };
};