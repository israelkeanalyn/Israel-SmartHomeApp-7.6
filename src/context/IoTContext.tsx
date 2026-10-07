import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';
import { Device, SensorData } from '../models/IoTModels';
import * as IoTService from '../services/IoTService';

type IoTContextType = {
  devices: Device[];
  sensors: SensorData | null;
  toggleDevice: (id: number, value: boolean) => Promise<void>;
  gatewayConnected: boolean;
  pendingDeviceIds: number[];
  loading: boolean;
  sensorsLoading: boolean;
  devicesLoading: boolean;
  sensorError: string | null;
  deviceError: string | null;
  refresh: () => void;
};

const IoTContext = createContext<IoTContextType | undefined>(undefined);

export function IoTProvider({ children }: { children: React.ReactNode }) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [sensors, setSensors] = useState<SensorData | null>(null);
  const [pendingDeviceIds, setPendingDeviceIds] = useState<number[]>([]);
  const [gatewayConnected, setGatewayConnected] = useState(true);
  const [loading, setLoading] = useState(true);
  const [sensorsLoading, setSensorsLoading] = useState(true);
  const [devicesLoading, setDevicesLoading] = useState(true);
  const [sensorError, setSensorError] = useState<string | null>(null);
  const [deviceError, setDeviceError] = useState<string | null>(null);

  const toggleDevice = async (id: number, value: boolean) => {
      setPendingDeviceIds((prev) => [...prev, id]);
      setDeviceError(null);

      try {
          const updated = await IoTService.updateDeviceStatus(id, value);

          setDevices((prev) =>
              prev.map((d) => (d.id === id ? updated : d))
          );
          setGatewayConnected(true);
      } catch (err) {
          const device = devices.find((item) => item.id === id);
          setDeviceError(`Unable to update ${device?.name ?? 'device'}.`);
          setGatewayConnected(false);
      } finally {
          setPendingDeviceIds((prev) => prev.filter((d) => d !== id));
      }
  };

  const loadData = async () => {
      setLoading(true);
      setSensorsLoading(true);
      setDevicesLoading(true);
      setSensorError(null);
      setDeviceError(null);

      const results = await Promise.allSettled([
          IoTService.getDevices(),
          IoTService.getSensorData(),
      ]);
  
      const [devicesResult, sensorsResult] = results;
  
      if (devicesResult.status === 'fulfilled') {
          setDevices(devicesResult.value);
      } else {
          setDeviceError('Unable to retrieve devices.');
      }
  
      if (sensorsResult.status === 'fulfilled') {
          setSensors(sensorsResult.value);
      } else {
          setSensorError('Unable to retrieve sensor data.');
      }
  
      const bothFailed =
          devicesResult.status === 'rejected' &&
          sensorsResult.status === 'rejected';
  
      setGatewayConnected(!bothFailed);
      setDevicesLoading(false);
      setSensorsLoading(false);
      setLoading(false);
  };
  
  useEffect(() => {
      loadData();
  }, []);

  return (
      <IoTContext.Provider
          value={{
              devices,
              sensors,
              toggleDevice,
              gatewayConnected,
              pendingDeviceIds,
              loading,
              sensorsLoading,
              devicesLoading,
              sensorError,
              deviceError,
              refresh: loadData,
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