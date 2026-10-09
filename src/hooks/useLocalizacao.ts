
import { useCallback, useEffect, useState } from 'react';
import * as Location from 'expo-location';

import { Coordenada } from '../types/localizacao';

export type StatusLocalizacao = 'obtendo' | 'ok' | 'negada' | 'erro';

export function useLocalizacao() {
  const [posicao, setPosicao] = useState<Coordenada | null>(null);
  const [status, setStatus] = useState<StatusLocalizacao>('obtendo');

  const obter = useCallback(async () => {
    setStatus('obtendo');
    try {

      const { status: permissao } = await Location.requestForegroundPermissionsAsync();

      if (permissao !== 'granted') {
        setStatus('negada');
        return;
      }

      const lida = await Location.getCurrentPositionAsync({

        accuracy: Location.Accuracy.Balanced,
      });

      setPosicao({
        latitude: lida.coords.latitude,
        longitude: lida.coords.longitude,
      });
      setStatus('ok');
    } catch {

      setStatus('erro');
    }
  }, []);

  useEffect(() => {
    obter();
  }, [obter]);

  return {
    posicao,
    status,

    tentarNovamente: obter,
  };
}
