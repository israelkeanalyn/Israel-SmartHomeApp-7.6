import React from 'react';
import { View, Text, StyleSheet, Switch, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useIoT } from '../../context/IoTContext';

export default function DashboardScreen() {

    const {
        devices,
        sensors,
        toggleDevice,
        loading,
        gatewayConnected,
        refresh,
        sensorsLoading,
        devicesLoading,
        sensorError,
        deviceError,
    } = useIoT();

    if (loading || sensorsLoading || devicesLoading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" />
                <Text style={{ marginTop: 12 }}>Loading dashboard...</Text>
            </View>
        );
    }

    if (sensorError || !sensors) {
    return (
        <View style={[styles.container, styles.centered]}>
            <Text>
            {sensorError ?? (gatewayConnected
                    ? 'No sensor data available.'
                : 'IoT Gateway is disconnected.')}
            </Text>
            <TouchableOpacity onPress={refresh} style={{ marginTop: 12 }}>
                <Text style={{ color: 'blue' }}>Retry</Text>
            </TouchableOpacity>
        </View>
    );
}
    return (
        <View style={styles.container}>

            <Text style={styles.greeting}>
                Good evening
            </Text>

            <Text style={styles.title}>
                IoT Dashboard
            </Text>

            <View style={styles.sensorRow}>

                <View style={styles.sensorCard}>
                    <View style={styles.sensorHeader}>
                        <Ionicons
                            name="water-outline"
                            size={22}
                        />

                        <Text style={styles.sensorLabel}>
                            Temperature
                        </Text>
                    </View>

                    <Text style={styles.sensorValue}>
                        {sensors.temperature}°C
                    </Text>
                </View>

                <View style={styles.sensorCard}>
                    <View style={styles.sensorHeader}>
                        <Ionicons
                            name="water-outline"
                            size={22}
                        />

                        <Text style={styles.sensorLabel}>
                            Humidity
                        </Text>
                    </View>

                    <Text style={styles.sensorValue}>
                        {sensors.humidity}%
                    </Text>
                </View>

            </View>

            <Text style={styles.sectionTitle}>
                Device Status
            </Text>

            {!gatewayConnected && (
                <Text style={styles.errorText}>IoT Gateway is disconnected.</Text>
            )}
            {deviceError && (
                <View>
                    <Text style={styles.errorText}>{deviceError}</Text>
                    <TouchableOpacity onPress={refresh}>
                        <Text style={{ color: 'blue', marginBottom: 12 }}>Retry</Text>
                    </TouchableOpacity>
                </View>
            )}

            {devices.map((device) => (

                <View
                    key={device.id}
                    style={styles.deviceCard}
                >

                    <View style={styles.deviceInfo}>

                        <Ionicons
                            name={device.icon}
                            size={28}
                            style={styles.deviceIcon}
                        />

                        <View>
                            <Text style={styles.deviceName}>
                                {device.name}
                            </Text>

                            <Text style={styles.deviceType}>
                                <Text style={styles.deviceState}>
                                    {device.status ? 'ON' : 'OFF'}
                                </Text>
                            </Text>
                        </View>

                    </View>

                    <Switch
                        value={device.status}
                        disabled={!gatewayConnected}
                        onValueChange={(value) => {
                            toggleDevice(device.id, value);
                        }}
                    />

                </View>

            ))}
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 20,
    },

    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    greeting: {
        fontSize: 14,
    },

    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 5,
    },

    sensorRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 25,
    },

    sensorCard: {
        flex: 1,
        padding: 20,
        borderRadius: 12,
        backgroundColor: '#eeeeee',
    },

    sensorLabel: {
        fontSize: 14,
    },

    sensorValue: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 10,
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 30,
        marginBottom: 12,
    },

    deviceCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 18,
        borderRadius: 12,
        backgroundColor: '#eeeeee',
    },

    deviceInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    deviceIcon: {
        fontSize: 28,
        marginRight: 12,
    },

    deviceName: {
        fontSize: 16,
        fontWeight: 'bold',
    },

    deviceType: {
        fontSize: 13,
        marginTop: 3,
    },

    deviceStatus: {
        fontSize: 14,
        fontWeight: 'bold',
    },

    sensorHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },

    deviceState: {

    },

    errorText: {
        color: '#b00020',
        marginBottom: 8,
    },

});