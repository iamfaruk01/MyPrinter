import React, { useState } from 'react';
import { Alert } from 'react-native';
import { mockPrinterService, Printer, PrintJob } from '../../../services/MockPrinterService';

export default function usePrinterManagement() {
  // State variables for printer data and UI status
  const [connectedPrinter, setConnectedPrinter] = useState<Printer | null>(null);
  const [printerStatus, setPrinterStatus] = useState<'connected' | 'disconnected' | 'searching'>('disconnected');
  const [printJobs, setPrintJobs] = useState<PrintJob[]>([]);
  const [availablePrinters, setAvailablePrinters] = useState<Printer[]>([]);
  const [showPrinterList, setShowPrinterList] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

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
  // Return all the state and functions the component needs
  return {
    connectedPrinter, setConnectedPrinter,
    printerStatus, setPrinterStatus,
    printJobs, setPrintJobs,
    isScanning, setIsScanning,
    availablePrinters, setAvailablePrinters,
    showPrinterList, setShowPrinterList,
    isConnecting, setIsConnecting,
    checkPrinterConnection,
    loadPrintJobs,
    handleScanPrinters,
    handleConnectToPrinter,
    handleDisconnect,
    handlePrintDocument,
    handleTestConnection,
    getStatusColor,
    getStatusText,
  };
}