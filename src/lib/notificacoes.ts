
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { cores } from './tema';


export const CANAL_PADRAO = 'default';


Notifications.setNotificationHandler({
  handleNotification: async () => ({

    shouldShowBanner: true,

    shouldShowList: true,
    shouldPlaySound: true,

    shouldSetBadge: false,
  }),
});


export async function prepararCanalAndroid(): Promise<void> {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync(CANAL_PADRAO, {
    name: 'Avisos da loja',
    description: 'Queda de preco dos produtos que voce salvou, status de pedido e novidades.',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: cores.primaria,
  });
}
