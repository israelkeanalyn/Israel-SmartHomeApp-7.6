import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useIoT } from '../../context/IoTContext';

export default function DevicesScreen() {
  const {
    devices,
    toggleDevice,
    isLoadingDevices,
    deviceError,
    gatewayConnected,
  } = useIoT();

  if (isLoadingDevices) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading devices...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Devices</Text>
      <Text style={styles.subtitle}>Control your connected devices</Text>

      {deviceError ? <Text style={styles.errorText}>{deviceError}</Text> : null}

      {devices.map((device) => (
        <View key={device.id} style={styles.deviceCard}>
          <View style={styles.deviceInfo}>
            <View style={styles.iconContainer}>
              <Ionicons name={device.icon} size={28} />
            </View>

            <View style={styles.deviceDetails}>
              <Text style={styles.deviceName}>{device.name}</Text>
              <Text style={styles.deviceType}>{device.type}</Text>
              <Text style={styles.deviceState}>{device.status ? 'ON' : 'OFF'}</Text>
            </View>
          </View>

          <Switch
            value={device.status}
            disabled={!gatewayConnected}
            onValueChange={(value) => {
              void toggleDevice(device.id, value);
            }}
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 6,
    marginBottom: 20,
    color: '#666',
  },
  errorText: {
    color: '#c0392b',
    fontWeight: '600',
    marginBottom: 12,
  },
  deviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 15,
    backgroundColor: '#eeeeee',
    marginBottom: 15,
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: '#dfe9ff',
  },
  deviceDetails: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deviceType: {
    fontSize: 13,
    marginTop: 3,
    color: '#444',
  },
  deviceState: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: '600',
  },
});