import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useIoT } from '../../context/IoTContext';

export default function DevicesScreen() {

  const {
    devices,
    toggleDevice,
    gatewayConnected,
    pendingDeviceIds,
    devicesLoading,
    deviceError,
    refresh,
  } = useIoT();

  if (devicesLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading devices...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>
        Devices
      </Text>

      <Text style={styles.subtitle}>
        Control your connected devices
      </Text>

      {!gatewayConnected && (
        <Text style={styles.errorText}>IoT Gateway is disconnected.</Text>
      )}
      {deviceError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{deviceError}</Text>
          <TouchableOpacity onPress={refresh}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {devices.map((device) => (

        <View
          key={device.id}
          style={styles.deviceCard}
        >

          <View style={styles.deviceInfo}>

            <View style={styles.iconContainer}>

              <Ionicons
                name={device.icon}
                size={28}
              />

            </View>

            <View style={styles.deviceDetails}>

              <Text style={styles.deviceName}>
                {device.name}
              </Text>

              <Text style={styles.deviceType}>
                {device.type}
              </Text>

              <Text style={styles.deviceState}>
                {device.status ? 'ON' : 'OFF'}
              </Text>

            </View>

          </View>
          {pendingDeviceIds.includes(device.id) && (
            <Text style={styles.updatingText}>Updating...</Text>
          )}

          <Switch
            value={device.status}
            disabled={!gatewayConnected || pendingDeviceIds.includes(device.id)}
            onValueChange={(value) => {
              toggleDevice(device.id, value);
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
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  subtitle: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 25,
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
  },

  deviceState: {
    fontSize: 12,
    marginTop: 5,
  },
  updatingText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#888',
    marginTop: 3,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
  },
  errorContainer: {
    marginBottom: 16,
  },
  errorText: {
    color: '#b00020',
    marginBottom: 8,
  },
  retryText: {
    color: '#0066cc',
    fontWeight: 'bold',
  },
});