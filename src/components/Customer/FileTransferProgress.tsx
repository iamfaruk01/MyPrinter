import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// This interface is now updated to match the data from useOwnerDashboard.ts
interface FileTransfer {
    payloadId: number;
    filename: string;
    status: 'IN_PROGRESS' | 'SUCCESS' | 'FAILURE' | 'CANCELED';
    progress: number;
    bytesTransferred?: number;
    totalBytes?: number;
}

interface Props {
    transfer: FileTransfer;
}

/**
 * A helper function to format bytes into a readable string (e.g., KB, MB).
 * @param bytes The number of bytes.
 * @param decimals The number of decimal places to include.
 * @returns A formatted string representing the file size.
 */
const formatBytes = (bytes: number, decimals = 2): string => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const FileTransferProgress: React.FC<Props> = ({ transfer }) => {
    
    /**
     * Determines the icon, color, and display text based on the transfer status.
     * @returns An object with icon, color, and text properties.
     */
    const getStatusDetails = () => {
        switch (transfer.status) {
            case 'SUCCESS':
                return { icon: '✅', color: '#28a745', text: 'Completed' };
            case 'FAILURE':
                return { icon: '❌', color: '#dc3545', text: 'Failed' };
            case 'CANCELED':
                return { icon: '⏹️', color: '#6c757d', text: 'Canceled' };
            case 'IN_PROGRESS':
            default:
                return { icon: '⏳', color: '#007AFF', text: 'Sending...' };
        }
    };

    const { icon, color, text } = getStatusDetails();

    // Show detailed byte progress if available, otherwise fall back to percentage.
    const progressText = (transfer.bytesTransferred !== undefined && transfer.totalBytes !== undefined)
        ? `${formatBytes(transfer.bytesTransferred)} / ${formatBytes(transfer.totalBytes)}`
        : `${transfer.progress}%`;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.icon}>{icon}</Text>
                <Text style={styles.filename} numberOfLines={1} ellipsizeMode="middle">
                    {transfer.filename}
                </Text>
            </View>
            <View style={styles.progressContainer}>
                <View style={styles.progressBarBackground}>
                    <View style={[styles.progressBarFill, { width: `${transfer.progress}%`, backgroundColor: color }]} />
                </View>
                <View style={styles.statusRow}>
                    <Text style={[styles.statusText, { color }]}>{text}</Text>
                    {/* Only show byte progress while the transfer is in progress */}
                    <Text style={styles.progressDetailsText}>
                        {transfer.status === 'IN_PROGRESS' ? progressText : ''}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    icon: {
        fontSize: 16,
        marginRight: 8,
    },
    filename: {
        fontSize: 15,
        fontWeight: '600',
        color: '#343a40',
        flex: 1, 
    },
    progressContainer: {
        // Wraps the progress bar and status text
    },
    progressBarBackground: {
        height: 6,
        backgroundColor: '#e9ecef',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 6,
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 3,
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusText: {
        fontSize: 13,
        fontWeight: '500',
    },
    progressDetailsText: {
        fontSize: 13,
        color: '#6c757d',
    },
});

export default FileTransferProgress;