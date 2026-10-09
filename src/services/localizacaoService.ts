
import { api } from '../api/client';
import { Coordenada, RespostaPontos } from '../types/localizacao';

export async function listarPontosRetirada(
  posicao: Coordenada | null,
  raioKm?: number,
): Promise<RespostaPontos> {
  const resposta = await api.get<RespostaPontos>('/pickup-points', {

    params: {
      latitude: posicao?.latitude,
      longitude: posicao?.longitude,
      maxKm: raioKm,
    },
  });
  return resposta.data;
}
