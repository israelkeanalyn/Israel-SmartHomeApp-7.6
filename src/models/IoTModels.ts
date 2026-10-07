import { Ionicons } from '@expo/vector-icons';

export type Device = {
    id: number;
    name: string;
    type: string;
    icon: keyof typeof Ionicons.glyphMap;
    status: boolean;
}

export type SensorData = {
    temperature: number;
    humidity: number;
    lightLevel: number;
}

export const sampleDevices: Device[] = [
    {
        id: 1,
        name: 'Living Room Light',
        type: 'light',
        icon: 'bulb-outline',
        status: true,
    }, 
    {
        id: 2,
        name: 'Bedroom Fan',
        type: 'fan',
        icon: 'help-buoy', //walay fan icon ang ionicons sir
        status: false,
    }, 
    {
        id: 3,
        name: 'Front Door Lock',
        type: 'lock',
        icon: 'lock-closed-outline',
        status: true,
    }];

    export const sampleSensorData: SensorData = {
    temperature: 22.5,
    humidity: 45,
    lightLevel: 300,
};