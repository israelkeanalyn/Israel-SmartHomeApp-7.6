import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useIoT } from '../../context/IoTContext';

export default function SensorsScreen() {
  const { sensors, refreshSensors, isRefreshingSensors, sensorError } = useIoT();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Sensors</Text>
      <Text style={styles.subtitle}>Monitor your environment</Text>

      <View style={styles.sensorCard}>
        <View style={styles.sensorHeader}>
          <Ionicons name="thermometer-outline" size={26} />
          <Text style={styles.sensorName}>Temperature</Text>
        </View>
        <Text style={styles.sensorValue}>{sensors.temperature}°C</Text>
      </View>

      <View style={styles.sensorCard}>
        <View style={styles.sensorHeader}>
          <Ionicons name="water-outline" size={26} />
          <Text style={styles.sensorName}>Humidity</Text>
        </View>
        <Text style={styles.sensorValue}>{sensors.humidity}%</Text>
      </View>

      <View style={styles.sensorCard}>
        <View style={styles.sensorHeader}>
          <Ionicons name="sunny-outline" size={26} />
          <Text style={styles.sensorName}>Light Level</Text>
        </View>
        <Text style={styles.sensorValue}>{sensors.lightLevel} lux</Text>
      </View>

      <Pressable
        style={styles.refreshButton}
        onPress={() => {
          void refreshSensors();
        }}
        disabled={isRefreshingSensors}
      >
        {isRefreshingSensors ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={styles.refreshText}>Refreshing sensors...</Text>
          </View>
        ) : (
          <Text style={styles.refreshText}>Refresh Sensors</Text>
        )}
      </Pressable>

      {sensorError ? <Text style={styles.errorText}>{sensorError}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
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
  sensorCard: {
    padding: 18,
    borderRadius: 15,
    backgroundColor: '#eeeeee',
    marginBottom: 15,
  },
  sensorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sensorName: {
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  sensorValue: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 18,
  },
  refreshButton: {
    backgroundColor: '#1f6feb',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  refreshText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    marginTop: 12,
    color: '#c0392b',
    fontWeight: '600',
  },
});