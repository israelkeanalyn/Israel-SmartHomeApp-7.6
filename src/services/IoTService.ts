import { Device, SensorData } from '../models/IoTModels';

type SensorReadingResponse = SensorData & {
  lightLevel: number;
};

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api';

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const body = (await response.json()) as { error?: string };
      message = body.error ?? message;
    } catch {
      // Keep the status-based message when the server response is not JSON.
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export async function getSensorData(): Promise<SensorData> {
  const reading = await request<SensorReadingResponse>(
    '/sensor-readings/latest'
  );

  return {
    temperature: reading.temperature,
    humidity: reading.humidity,
    lightLevel: reading.lightLevel,
  };
}

export function getDevices(): Promise<Device[]> {
  return request<Device[]>('/devices');
}

export function updateDeviceStatus(
  id: number,
  status: boolean
): Promise<Device> {
  return request<Device>(`/devices/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}