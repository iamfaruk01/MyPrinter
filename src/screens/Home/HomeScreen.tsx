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
// Import mock printer service and related types
import { mockPrinterService, Printer, PrintJob } from '../../services/MockPrinterService';
import { styles } from './Home.styles';
import usePrinterManagement from './hooks/usePrinterManagement';
import PrinterItem from '../../components/HomeScreen/PrinterItem';

// Define HomeScreen component using React.FC type
const HomeScreen: React.FC = () => {
  // Destructure all printer state variables and handler functions from the custom hook
  const {
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
  } = usePrinterManagement();

  // Run these effects when the component first mounts
  useEffect(() => {
    checkPrinterConnection(); 
    loadPrintJobs();          
  }, []);


  // Main JSX render
  return (
    <View style={styles.container}>
      {/* Set status bar style and background color */}
      <StatusBar barStyle="light-content" backgroundColor="#1976D2" />
      
      {/* Main scrollable content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Printer status card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusTitle}>Printer Status</Text>
            <View style={styles.headerButtons}>
              {/* Show "Test" button only if a printer is connected */}
              {connectedPrinter && (
                <TouchableOpacity 
                  onPress={handleTestConnection}
                  style={styles.testButton}
                >
                  <Text style={styles.testButtonText}>Test</Text>
                </TouchableOpacity>
              )}
              {/* Refresh button */}
              <TouchableOpacity 
                onPress={checkPrinterConnection}
                style={styles.refreshButton}
              >
                <Text style={styles.refreshText}>Refresh</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Status indicator (dot + text) */}
          <View style={styles.statusIndicator}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
            <Text style={styles.statusText}>{getStatusText()}</Text>
          </View>

          {/* Show printer details if connected */}
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

        {/* Action buttons container */}
        <View style={styles.actionsContainer}>
          {/* Print document button */}
          <TouchableOpacity 
            style={[styles.actionButton, styles.primaryButton]}
            onPress={handlePrintDocument}
          >
            <Text style={styles.actionButtonText}>📄 Print Document</Text>
          </TouchableOpacity>

          {/* Scan for printers button (shows loading if scanning) */}
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

          {/* Disconnect button (only if connected) */}
          {connectedPrinter && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.disconnectButton]}
              onPress={handleDisconnect}
            >
              <Text style={styles.disconnectButtonText}>🔌 Disconnect Printer</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* List of recent print jobs */}
        {printJobs.length > 0 && (
          <View style={styles.recentActivity}>
            <Text style={styles.sectionTitle}>Recent Print Jobs</Text>
            {printJobs.map(job => (
              <View key={job.id} style={styles.activityItem}>
                <View style={styles.jobInfo}>
                  <Text style={styles.activityText}>{job.fileName}</Text>
                  <Text style={styles.jobStatus}>Status: {job.status}</Text>
                  {/* Show progress if job is still printing */}
                  {job.status === 'printing' && (
                    <Text style={styles.jobProgress}>Progress: {job.progress}%</Text>
                  )}
                </View>
                {/* Show completion or creation time */}
                <Text style={styles.activityTime}>
                  {job.completedAt ? job.completedAt.toLocaleTimeString() : job.createdAt.toLocaleTimeString()}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Modal for displaying available printers */}
      <Modal
        visible={showPrinterList} // Show when flag is true
        animationType="slide" // Slide-up animation
        onRequestClose={() => setShowPrinterList(false)} // Close on back press
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
          
          {/* Overlay while connecting */}
          {isConnecting && (
            <View style={styles.connectingOverlay}>
              <ActivityIndicator size="large" color="#1976D2" />
              <Text style={styles.connectingText}>Connecting...</Text>
            </View>
          )}
          
          {/* List of available printers */}
          <FlatList
            data={availablePrinters}
            renderItem={({ item }) => <PrinterItem item={item}/>}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.printerList}
          />
        </View>
      </Modal>
    </View>
  );
};

// Export the component as default
export default HomeScreen;
