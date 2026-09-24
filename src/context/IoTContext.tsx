import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { Device, SensorData, sampleDevices, sampleSensors } from '../models/IoTModels';
import {
  getDevices,
  getSensorData,
  updateDeviceStatus,
} from '../services/IoTService';

type IoTContextType = {
  devices: Device[];
  sensors: SensorData;
  gatewayConnected: boolean;
  isLoadingDevices: boolean;
  isRefreshingSensors: boolean;
  deviceError: string | null;
  sensorError: string | null;
  loadDevices: () => Promise<void>;
  refreshSensors: () => Promise<void>;
  toggleDevice: (id: number, value: boolean) => Promise<void>;
  setGatewayConnected: (connected: boolean) => void;
};

const IoTContext = createContext<IoTContextType | undefined>(undefined);

export function IoTProvider({ children }: { children: React.ReactNode }) {
  const [devices, setDevices] = useState<Device[]>(sampleDevices);
  const [sensors, setSensors] = useState<SensorData>(sampleSensors);
  const [gatewayConnected, setGatewayConnectedState] = useState(true);
  const [isLoadingDevices, setIsLoadingDevices] = useState(false);
  const [isRefreshingSensors, setIsRefreshingSensors] = useState(false);
  const [deviceError, setDeviceError] = useState<string | null>(null);
  const [sensorError, setSensorError] = useState<string | null>(null);

  const loadDevices = useCallback(async () => {
    setIsLoadingDevices(true);
    setDeviceError(null);

    try {
      const data = await getDevices();
      setDevices(data);
    } catch (error) {
      setDeviceError('Unable to load devices.');
    } finally {
      setIsLoadingDevices(false);
    }
  }, []);

  const refreshSensors = useCallback(async () => {
    setIsRefreshingSensors(true);
    setSensorError(null);

    try {
      const data = await getSensorData();
      setSensors(data);
    } catch (error) {
      setSensorError('Unable to retrieve sensor data.');
    } finally {
      setIsRefreshingSensors(false);
    }
  }, []);

  const toggleDevice = useCallback(
    async (id: number, value: boolean) => {
      if (!gatewayConnected) {
        setDeviceError('IoT Gateway is disconnected.');
        return;
      }

      const selectedDevice = devices.find((device) => device.id === id);

      if (!selectedDevice) {
        return;
      }

      try {
        await updateDeviceStatus(id, value);
        setDevices((currentDevices) =>
          currentDevices.map((device) =>
            device.id === id ? { ...device, status: value } : device
          )
        );
        setDeviceError(null);
      } catch (error) {
        setDeviceError(`Unable to update ${selectedDevice.name}.`);
      }
    },
    [devices, gatewayConnected]
  );

  const setGatewayConnected = useCallback((connected: boolean) => {
    setGatewayConnectedState(connected);

    if (!connected) {
      setDeviceError('IoT Gateway is disconnected.');
    } else {
      setDeviceError(null);
    }
  }, []);

  useEffect(() => {
    void loadDevices();
    void refreshSensors();
  }, [loadDevices, refreshSensors]);

  return (
    <IoTContext.Provider
      value={{
        devices,
        sensors,
        gatewayConnected,
        isLoadingDevices,
        isRefreshingSensors,
        deviceError,
        sensorError,
        loadDevices,
        refreshSensors,
        toggleDevice,
        setGatewayConnected,
      }}
    >
      {children}
    </IoTContext.Provider>
  );
}

export function useIoT() {
  const context = useContext(IoTContext);

  if (!context) {
    throw new Error('useIoT must be used inside IoTProvider');
  }

  return context;
}
