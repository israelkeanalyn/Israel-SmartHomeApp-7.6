import { Device, SensorData, sampleDevices } from '../models/IoTModels';

const wait = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const randomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

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