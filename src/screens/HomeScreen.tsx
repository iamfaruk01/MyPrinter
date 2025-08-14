import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import { mockPrinterService, Printer, PrintJob } from '../services/MockPrinterService';

const HomeScreen: React.FC = () => {
  const [connectedPrinter, setConnectedPrinter] = useState<Printer | null>(null);
  const [printerStatus, setPrinterStatus] = useState<'connected' | 'disconnected' | 'searching'>('disconnected');
  const [printJobs, setPrintJobs] = useState<PrintJob[]>([]);
  const [availablePrinters, setAvailablePrinters] = useState<Printer[]>([]);
  const [showPrinterList, setShowPrinterList] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    checkPrinterConnection();
    loadPrintJobs();
  }, []);

  const checkPrinterConnection = async () => {
    const printer = mockPrinterService.getConnectedPrinter();
    if (printer) {
      setConnectedPrinter(printer);
      setPrinterStatus('connected');
    } else {
      setConnectedPrinter(null);
      setPrinterStatus('disconnected');
    }
  };

  const loadPrintJobs = () => {
    const jobs = mockPrinterService.getPrintJobs();
    setPrintJobs(jobs.slice(0, 3)); // Show only recent 3 jobs
  };

  const handleScanPrinters = async () => {
    setIsScanning(true);
    try {
      const printers = await mockPrinterService.discoverPrinters();
      setAvailablePrinters(printers);
      setShowPrinterList(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to scan for printers');
    } finally {
      setIsScanning(false);
    }
  };

  const handleConnectToPrinter = async (printerId: string) => {
    setIsConnecting(true);
    try {
      const success = await mockPrinterService.connectToPrinter(printerId);
      if (success) {
        await checkPrinterConnection();
        setShowPrinterList(false);
        Alert.alert('Success', 'Connected to printer successfully!');
      } else {
        Alert.alert('Error', 'Failed to connect to printer');
      }
    } catch (error) {
      Alert.alert('Error', 'Connection failed');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    Alert.alert(
      'Disconnect Printer',
      'Are you sure you want to disconnect?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: async () => {
            await mockPrinterService.disconnect();
            await checkPrinterConnection();
          }
        }
      ]
    );
  };

  const handlePrintDocument = async () => {
    if (printerStatus !== 'connected') {
      Alert.alert(
        'No Printer Connected',
        'Please connect a printer first.',
        [
          { text: 'Find Printers', onPress: handleScanPrinters },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
      return;
    }

    try {
      const job = await mockPrinterService.printDocument('Sample Document.pdf', 3);
      Alert.alert('Print Started', `Print job "${job.fileName}" has been started!`);
      
      // Refresh print jobs after a delay to show the new job
      setTimeout(loadPrintJobs, 1000);
    } catch (error) {
      Alert.alert('Print Error', 'Failed to start print job');
    }
  };

  const handleTestConnection = async () => {
    if (!connectedPrinter) return;
    
    Alert.alert('Testing Connection', 'Please wait...');
    const success = await mockPrinterService.testConnection();
    
    if (success) {
      Alert.alert('Test Successful', 'Printer connection is working properly!');
    } else {
      Alert.alert('Test Failed', 'Printer connection has issues.');
      await checkPrinterConnection();
    }
  };

  const getStatusColor = () => {
    switch (printerStatus) {
      case 'connected': return '#4CAF50';
      case 'searching': return '#FF9800';
      case 'disconnected': return '#F44336';
      default: return '#F44336';
    }
  };

  const getStatusText = () => {
    switch (printerStatus) {
      case 'connected': return `Connected to ${connectedPrinter?.name}`;
      case 'searching': return 'Searching for printers...';
      case 'disconnected': return 'No printer connected';
      default: return 'Unknown status';
    }
  };

  const renderPrinterItem = ({ item }: { item: Printer }) => (
    <TouchableOpacity
      style={styles.printerItem}
      onPress={() => handleConnectToPrinter(item.id)}
      disabled={isConnecting}
    >
      <View style={styles.printerInfo}>
        <Text style={styles.printerName}>{item.name}</Text>
        <Text style={styles.printerModel}>{item.model}</Text>
        <Text style={styles.printerLocation}>{item.location}</Text>
      </View>
      <View style={styles.printerStatus}>
        <View style={[styles.statusDot, { backgroundColor: item.status === 'online' ? '#4CAF50' : '#F44336' }]} />
        <Text style={styles.printerStatusText}>{item.status}</Text>
        <Text style={styles.connectionType}>{item.connectionType.toUpperCase()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1976D2" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusTitle}>Printer Status</Text>
            <View style={styles.headerButtons}>
              {connectedPrinter && (
                <TouchableOpacity 
                  onPress={handleTestConnection}
                  style={styles.testButton}
                >
                  <Text style={styles.testButtonText}>Test</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                onPress={checkPrinterConnection}
                style={styles.refreshButton}
              >
                <Text style={styles.refreshText}>Refresh</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.statusIndicator}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
            <Text style={styles.statusText}>{getStatusText()}</Text>
          </View>

          {connectedPrinter && (
            <View style={styles.printerDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Paper Level:</Text>
                <Text style={styles.detailValue}>{connectedPrinter.paperLevel}%</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Ink Level:</Text>
                <Text style={styles.detailValue}>{connectedPrinter.inkLevel}%</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Connection:</Text>
                <Text style={styles.detailValue}>{connectedPrinter.connectionType.toUpperCase()}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Main Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.primaryButton]}
            onPress={handlePrintDocument}
          >
            <Text style={styles.actionButtonText}>📄 Print Document</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={handleScanPrinters}
            disabled={isScanning}
          >
            {isScanning ? (
              <ActivityIndicator color="#1976D2" />
            ) : (
              <Text style={styles.actionButtonTextSecondary}>🔍 Find Printers</Text>
            )}
          </TouchableOpacity>

          {connectedPrinter && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.disconnectButton]}
              onPress={handleDisconnect}
            >
              <Text style={styles.disconnectButtonText}>🔌 Disconnect Printer</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Recent Print Jobs */}
        {printJobs.length > 0 && (
          <View style={styles.recentActivity}>
            <Text style={styles.sectionTitle}>Recent Print Jobs</Text>
            {printJobs.map(job => (
              <View key={job.id} style={styles.activityItem}>
                <View style={styles.jobInfo}>
                  <Text style={styles.activityText}>{job.fileName}</Text>
                  <Text style={styles.jobStatus}>Status: {job.status}</Text>
                  {job.status === 'printing' && (
                    <Text style={styles.jobProgress}>Progress: {job.progress}%</Text>
                  )}
                </View>
                <Text style={styles.activityTime}>
                  {job.completedAt ? job.completedAt.toLocaleTimeString() : job.createdAt.toLocaleTimeString()}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Printer List Modal */}
      <Modal
        visible={showPrinterList}
        animationType="slide"
        onRequestClose={() => setShowPrinterList(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Available Printers</Text>
            <TouchableOpacity 
              onPress={() => setShowPrinterList(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          {isConnecting && (
            <View style={styles.connectingOverlay}>
              <ActivityIndicator size="large" color="#1976D2" />
              <Text style={styles.connectingText}>Connecting...</Text>
            </View>
          )}
          
          <FlatList
            data={availablePrinters}
            renderItem={renderPrinterItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.printerList}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  testButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  refreshButton: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  refreshText: {
    color: '#1976D2',
    fontSize: 12,
    fontWeight: '600',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  statusText: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  printerDetails: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  actionsContainer: {
    marginBottom: 32,
  },
  actionButton: {
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  primaryButton: {
    backgroundColor: '#1976D2',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  disconnectButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtonTextSecondary: {
    color: '#1976D2',
    fontSize: 16,
    fontWeight: '600',
  },
  disconnectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  recentActivity: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  activityItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  jobInfo: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  jobStatus: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  jobProgress: {
    fontSize: 12,
    color: '#1976D2',
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1976D2',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  connectingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  connectingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
  },
  printerList: {
    padding: 16,
  },
  printerItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  printerInfo: {
    flex: 1,
  },
  printerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  printerModel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  printerLocation: {
    fontSize: 12,
    color: '#999',
  },
  printerStatus: {
    alignItems: 'flex-end',
  },
  printerStatusText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  connectionType: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
});

export default HomeScreen;