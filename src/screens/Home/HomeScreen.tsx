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
import { PrinterStatusCard } from '../../components/HomeScreen/PrinterStatusCard';

const HomeScreen: React.FC = () => {
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

  useEffect(() => {
    checkPrinterConnection();
    loadPrintJobs();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1976D2" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <PrinterStatusCard
          connectedPrinter={connectedPrinter}
          handleTestConnection={handleTestConnection}
          checkPrinterConnection={checkPrinterConnection}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
          showDetails={!!connectedPrinter}
        />
      </ScrollView>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.secondaryButton,
            (isScanning || connectedPrinter !== null) && styles.disabledButton
          ]}
          onPress={handleScanPrinters}
          disabled={isScanning || connectedPrinter !== null}
        >
          {isScanning ? (
            <ActivityIndicator color="#1976D2" />
          ) : (
            <Text style={[styles.actionButtonTextSecondary]}>🔍 Find Printers</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton]}
          onPress={handlePrintDocument}
        >
          <Text style={styles.actionButtonText}>📄 Select Document</Text>
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
                {job.completedAt
                  ? job.completedAt.toLocaleTimeString()
                  : job.createdAt.toLocaleTimeString()}
              </Text>
            </View>
          ))}
        </View>
      )}

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
            renderItem={({ item }) => <PrinterItem item={item} />}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.printerList}
          />
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;
