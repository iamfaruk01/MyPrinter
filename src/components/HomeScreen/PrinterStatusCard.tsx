import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../../screens/Home/Home.styles';
import { Printer } from '../../services/MockPrinterService';

interface PrinterStatusCardProps {
    connectedPrinter?: Printer | null;
    handleTestConnection: () => void;
    checkPrinterConnection: () => void;
    getStatusColor: (status: string) => string;
    getStatusText: (status: string) => string;
    showDetails?: boolean;
}

const PrinterStatusCard: React.FC<PrinterStatusCardProps> = ({
    connectedPrinter,
    handleTestConnection,
    checkPrinterConnection,
    getStatusColor,
    getStatusText,
    showDetails
}) => {
    return (
        <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
                <Text style={styles.statusTitle}>Printer Status</Text>
                <View style={styles.headerButtons}>
                    <TouchableOpacity
                        style={styles.testButton}
                        onPress={handleTestConnection}
                    >
                        <Text style={styles.testButtonText}>Test Connection</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.refreshButton}
                        onPress={checkPrinterConnection}
                    >
                        <Text style={styles.refreshText}>Refresh</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.statusIndicator}>
                <View
                    style={[
                        styles.statusDot,
                        { backgroundColor: connectedPrinter ? getStatusColor(connectedPrinter.status) : '#ccc' },
                    ]}
                />
                <Text style={styles.statusText}>
                    {connectedPrinter ? getStatusText(connectedPrinter.status) : 'No Printer Connected'}
                </Text>
            </View>
            {showDetails && (
                <View style={styles.printerDetails}>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Paper Level:</Text>
                        <Text style={styles.detailValue}>{connectedPrinter?.paperLevel || "-:-"}%</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Ink Level:</Text>
                        <Text style={styles.detailValue}>{connectedPrinter?.inkLevel || "-:-"}%</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Connection:</Text>
                        <Text style={styles.detailValue}>
                            {connectedPrinter?.connectionType ? connectedPrinter.connectionType.toUpperCase() : "-"}
                        </Text>
                    </View>
                </View>
            )}
        </View>
    );
};

export { PrinterStatusCard };