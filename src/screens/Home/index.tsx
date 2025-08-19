// HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { styles } from './index.styles';
import usePrinterManagement from './hooks/usePrinterManagement';
import { PrinterStatusCard } from '../../components/HomeScreen/PrinterStatusCard';
import QRScreen from '../../components/QRScanner/QRScanner';

const HomeScreen: React.FC = () => {
  const {
    connectedPrinter,
    handleTestConnection,
    checkPrinterConnection,
    getStatusColor,
    getStatusText,
    loadPrintJobs,
  } = usePrinterManagement();

  const [showQRScreen, setShowQRScreen] = useState(false);

  // useEffect(() => {
  //   checkPrinterConnection();
  //   loadPrintJobs();
  // }, [checkPrinterConnection, loadPrintJobs]); // Added dependencies

  const handleQRClose = () => {
    setShowQRScreen(false);
  };

  if (showQRScreen) {
    return <QRScreen onClose={handleQRClose} />;
  }

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
          style={[styles.actionButton, styles.primaryButton]}
          onPress={() => setShowQRScreen(true)}
        >
          <Text style={styles.actionButtonText}>Scan the QR code to share file</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;
