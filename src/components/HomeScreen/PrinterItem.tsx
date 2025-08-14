import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { styles } from '../../screens/Home/Home.styles';
import { Printer } from '../../services/MockPrinterService';
import usePrinterManagement from '../../screens/Home/hooks/usePrinterManagement';

interface Props {
  item: Printer;
}

const PrinterItem: React.FC<Props> = ({ item }) => {
  const { handleConnectToPrinter, isConnecting } = usePrinterManagement();

  return (
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
        <View
          style={[
            styles.statusDot,
            { backgroundColor: item.status === 'online' ? '#4CAF50' : '#F44336' },
          ]}
        />
        <Text style={styles.printerStatusText}>{item.status}</Text>
        <Text style={styles.connectionType}>{item.connectionType.toUpperCase()}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default PrinterItem;
