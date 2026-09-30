import {
  AppSettings,
  Device,
  SensorData,
  defaultSettings,
  sampleDevices,
} from '../models/IoTModels';

const wait = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const randomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;


let savedSettings: AppSettings = { ...defaultSettings };
let gatewayOnline = true;

export async function getSensorData(): Promise<SensorData> {
  await wait(900);

  return {
    temperature: randomNumber(24, 31),
    humidity: randomNumber(45, 72),
    lightLevel: randomNumber(500, 900),
  };
}

export async function getDevices(): Promise<Device[]> {
  await wait(700);

  return sampleDevices.map((device) => ({ ...device }));
}

export async function updateDeviceStatus(
  id: number,
  nextStatus: boolean
): Promise<Device> {
  await wait(700);

  const device = sampleDevices.find((item) => item.id === id);

  if (!device) {
    throw new Error('Device not found');
  }

  return {
    ...device,
    status: nextStatus,
  };
}

export async function getSettings(): Promise<AppSettings> {
  await wait(500);

  return { ...savedSettings };
}

export async function saveSettings(
  changes: Partial<AppSettings>
): Promise<AppSettings> {
  await wait(400);

  savedSettings = { ...savedSettings, ...changes };

  return { ...savedSettings };
}

export async function getGatewayStatus(): Promise<boolean> {
  await wait(400);

  return gatewayOnline;
}

export async function connectGateway(): Promise<void> {
  await wait(1000);

  gatewayOnline = true;
}

export async function disconnectGateway(): Promise<void> {
  await wait(600);

  gatewayOnline = false;
}
