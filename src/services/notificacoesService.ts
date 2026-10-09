import { Platform } from 'react-native';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

import { api } from '../api/client';

export interface AparelhoRegistrado {
  id: string;
  platform: 'ANDROID' | 'IOS' | 'WEB';
  deviceName: string | null;
  tokenPreview: string;
  active: boolean;
}


export async function registrarAparelho(token: string): Promise<AparelhoRegistrado> {
  const resposta = await api.post<AparelhoRegistrado>('/customers/me/devices', {
    token,
    platform: Platform.OS === 'ios' ? 'IOS' : 'ANDROID',

    deviceName: Device.deviceName ?? Device.modelName ?? undefined,
    appVersion: Constants.expoConfig?.version ?? undefined,
  });
  return resposta.data;
}


export async function removerAparelho(token: string): Promise<void> {
  await api.delete(`/customers/me/devices/${encodeURIComponent(token)}`);
}
