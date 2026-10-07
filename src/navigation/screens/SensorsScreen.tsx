import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView, 
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useIoT } from '../../context/IoTContext';

export default function SensorsScreen() {

  const { sensors, sensorsLoading, sensorError, refresh } = useIoT();

  if (sensorsLoading) {
    return (
      <View style = {styles.centered}>
        <ActivityIndicator size = "large"/>
        <Text>Refreshing Sensors...</Text>
      </View>
    );
  }

  if (sensorError || !sensors) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{sensorError ?? 'Unable to retrieve sensor data.'}</Text>
        <TouchableOpacity onPress={refresh} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>

      {/* Header */}
      <Text style={styles.title}>
        Sensors
      </Text>

      <Text style={styles.subtitle}>
        Monitor your environment
      </Text>

      {/* Temperature */}
      <View style={styles.sensorCard}>

        <View style={styles.sensorHeader}>

          <Ionicons
            name="thermometer-outline"
            size={30}
          />

          <Text style={styles.sensorName}>
            Temperature
          </Text>

        </View>

        <Text style={styles.sensorValue}>
          {sensors?.temperature}°C
        </Text>

        <Text style={styles.sensorDescription}>
          Current room temperature
        </Text>

      </View>

      {/* Humidity */}
      <View style={styles.sensorCard}>

        <View style={styles.sensorHeader}>

          <Ionicons
            name="water-outline"
            size={30}
          />

          <Text style={styles.sensorName}>
            Humidity
          </Text>

        </View>

        <Text style={styles.sensorValue}>
          {sensors?.humidity}%
        </Text>

        <Text style={styles.sensorDescription}>
          Current relative humidity
        </Text>

      </View>

      {/* Light Level */}
      <View style={styles.sensorCard}>

        <View style={styles.sensorHeader}>

          <Ionicons
            name="sunny-outline"
            size={30}
          />

          <Text style={styles.sensorName}>
            Light Level
          </Text>

        </View>

        <Text style={styles.sensorValue}>
          {sensors?.lightLevel} lux
        </Text>

        <Text style={styles.sensorDescription}>
          Current ambient light
        </Text>

      </View>

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

  sensorCard: {
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#eeeeee',
    marginBottom: 15,
  },

  sensorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  sensorName: {
    fontSize: 17,
    fontWeight: 'bold',
  },

  sensorValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 20,
  },

  sensorDescription: {
    fontSize: 13,
    marginTop: 5,
  },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  errorText: {
    textAlign: 'center',
  },

  retryButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#eeeeee',
  },

  retryText: {
    color: '#0066cc',
    fontWeight: 'bold',
  },
});