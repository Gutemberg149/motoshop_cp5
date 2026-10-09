import { useQuery } from '@tanstack/react-query';

import { listarPontosRetirada } from '../services/localizacaoService';
import { useLocalizacao } from './useLocalizacao';

export function usePontosRetirada(raioKm?: number) {
  const { posicao, status, tentarNovamente } = useLocalizacao();

  const consulta = useQuery({
 
    queryKey: ['pontos-retirada', posicao?.latitude ?? null, posicao?.longitude ?? null, raioKm ?? null],
    queryFn: () => listarPontosRetirada(posicao, raioKm),


    enabled: status !== 'obtendo',
  });

  return {
    ...consulta,
    posicao,
    statusLocalizacao: status,
    tentarLocalizacaoNovamente: tentarNovamente,
  };
}
