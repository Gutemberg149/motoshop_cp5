

import { api } from '../api/client';
import {
  Avaliacao,
  NovaAvaliacao,
  PodeAvaliar,
  RespostaAvaliacoes,
} from '../types/avaliacao';

export type OrdemAvaliacao = 'recent' | 'rating_desc' | 'rating_asc';


export async function listarAvaliacoes(
  produtoId: string,
  opcoes: { rating?: number; withPhotos?: boolean; ordem?: OrdemAvaliacao } = {},
): Promise<RespostaAvaliacoes> {
  const resposta = await api.get<RespostaAvaliacoes>(`/products/${produtoId}/reviews`, {
    params: {
      page: 1,
      pageSize: 20,
      rating: opcoes.rating,
      withPhotos: opcoes.withPhotos,
      sort: opcoes.ordem ?? 'recent',
    },
  });
  return resposta.data;
}


export async function podeAvaliar(produtoId: string): Promise<PodeAvaliar> {
  const resposta = await api.get<PodeAvaliar>(`/products/${produtoId}/reviews/can-review`);
  return resposta.data;
}

export async function criarAvaliacao(
  produtoId: string,
  dados: NovaAvaliacao,
): Promise<Avaliacao> {
  const resposta = await api.post<Avaliacao>(`/products/${produtoId}/reviews`, dados);
  return resposta.data;
}

export async function editarAvaliacao(
  avaliacaoId: string,
  dados: Partial<NovaAvaliacao>,
): Promise<Avaliacao> {
  const resposta = await api.patch<Avaliacao>(`/reviews/${avaliacaoId}`, dados);
  return resposta.data;
}

export async function apagarAvaliacao(avaliacaoId: string): Promise<void> {
  await api.delete(`/reviews/${avaliacaoId}`);
}
