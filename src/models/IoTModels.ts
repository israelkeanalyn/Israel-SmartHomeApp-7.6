import { Ionicons } from '@expo/vector-icons';

export type Device = {
  id: number;
  name: string;
  type: string;
  icon: keyof typeof Ionicons.glyphMap;
  status: boolean;
};

export type SensorData = {
  temperature: number;
  humidity: number;
  lightLevel: number;
};

export type AppSettings = {
  notifications: boolean;
  autoConnect: boolean;
  darkMode: boolean;
};

export const sampleDevices: Device[] = [
  {
    id: 1,
    name: 'Living Room Light',
    type: 'Smart Light',
    icon: 'bulb-outline',
    status: true,
  },
  {
    id: 2,
    name: 'Bedroom Fan',
    type: 'Smart Fan',
    icon: 'sync-outline',
    status: false,
  },
  {
    id: 3,
    name: 'Front Door Lock',
    type: 'Smart Lock',
    icon: 'lock-closed-outline',
    status: true,
  },
];

export const sampleSensors: SensorData = {
  temperature: 28,
  humidity: 65,
  lightLevel: 720,
};

export const defaultSettings: AppSettings = {
  notifications: true,
  autoConnect: true,
  darkMode: false,
};