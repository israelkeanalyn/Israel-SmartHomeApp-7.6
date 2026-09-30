import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  AppSettings,
  Device,
  SensorData,
  defaultSettings,
  sampleDevices,
  sampleSensors,
} from '../models/IoTModels';
import {
  connectGateway,
  disconnectGateway,
  getDevices,
  getGatewayStatus,
  getSensorData,
  getSettings,
  saveSettings,
  updateDeviceStatus,
} from '../services/IoTService';

type IoTContextType = {
  devices: Device[];
  sensors: SensorData;
  settings: AppSettings;
  gatewayConnected: boolean;
  isLoadingDevices: boolean;
  isRefreshingSensors: boolean;
  isLoadingSettings: boolean;
  isGatewayBusy: boolean;
  deviceError: string | null;
  sensorError: string | null;
  settingsError: string | null;
  loadDevices: () => Promise<void>;
  refreshSensors: () => Promise<void>;
  loadSettings: () => Promise<void>;
  toggleDevice: (id: number, value: boolean) => Promise<void>;
  updateSetting: (key: keyof AppSettings, value: boolean) => Promise<void>;
  setGatewayConnected: (connected: boolean) => Promise<void>;
};

const IoTContext = createContext<IoTContextType | undefined>(undefined);

export function IoTProvider({ children }: { children: React.ReactNode }) {
  const [devices, setDevices] = useState<Device[]>(sampleDevices);
  const [sensors, setSensors] = useState<SensorData>(sampleSensors);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [gatewayConnected, setGatewayConnectedState] = useState(true);
  const [isLoadingDevices, setIsLoadingDevices] = useState(false);
  const [isRefreshingSensors, setIsRefreshingSensors] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);
  const [isGatewayBusy, setIsGatewayBusy] = useState(false);
  const [deviceError, setDeviceError] = useState<string | null>(null);
  const [sensorError, setSensorError] = useState<string | null>(null);
  const [settingsError, setSettingsError] = useState<string | null>(null);

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

  const loadSettings = useCallback(async () => {
    setIsLoadingSettings(true);
    setSettingsError(null);

    try {
      const [savedSettings, connected] = await Promise.all([
        getSettings(),
        getGatewayStatus(),
      ]);

      setSettings(savedSettings);
      setGatewayConnectedState(connected);
    } catch (error) {
      setSettingsError('Unable to load settings.');
    } finally {
      setIsLoadingSettings(false);
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

  const updateSetting = useCallback(
    async (key: keyof AppSettings, value: boolean) => {
      const previousValue = settings[key];

      setSettings((current) => ({ ...current, [key]: value }));
      setSettingsError(null);

      try {
        await saveSettings({ [key]: value });
      } catch (error) {
        setSettings((current) => ({ ...current, [key]: previousValue }));
        setSettingsError('Unable to save setting.');
      }
    },
    [settings]
  );

  const setGatewayConnected = useCallback(async (connected: boolean) => {
    setIsGatewayBusy(true);

    try {
      if (connected) {
        await connectGateway();
      } else {
        await disconnectGateway();
      }

      setGatewayConnectedState(connected);
      setDeviceError(connected ? null : 'IoT Gateway is disconnected.');
    } catch (error) {
      setDeviceError(
        connected
          ? 'Unable to connect to the IoT gateway.'
          : 'Unable to disconnect from the IoT gateway.'
      );
    } finally {
      setIsGatewayBusy(false);
    }
  }, []);

  useEffect(() => {
    void loadDevices();
    void refreshSensors();
    void loadSettings();
  }, [loadDevices, refreshSensors, loadSettings]);

  return (
    <IoTContext.Provider
      value={{
        devices,
        sensors,
        settings,
        gatewayConnected,
        isLoadingDevices,
        isRefreshingSensors,
        isLoadingSettings,
        isGatewayBusy,
        deviceError,
        sensorError,
        settingsError,
        loadDevices,
        refreshSensors,
        loadSettings,
        toggleDevice,
        updateSetting,
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