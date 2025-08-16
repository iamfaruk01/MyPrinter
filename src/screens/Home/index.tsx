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
import { useNavigation } from '@react-navigation/native';
import { styles } from './Home.styles';

const index: React.FC = () => {
  return (
    <View>
        <TouchableOpacity style={styles.actionButton}>
            <Text>Owner</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
            <Text>User</Text>
        </TouchableOpacity>
    </View>
  );
};

export default index;
