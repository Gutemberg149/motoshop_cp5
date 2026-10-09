import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '../contexts/AuthContext';
import {
  OrdemAvaliacao,
  apagarAvaliacao,
  criarAvaliacao,
  editarAvaliacao,
  listarAvaliacoes,
  podeAvaliar,
} from '../services/avaliacoesService';
import { NovaAvaliacao } from '../types/avaliacao';

export const chavesAvaliacao = {
  todas: ['avaliacoes'] as const,
  doProduto: (produtoId: string, ordem: OrdemAvaliacao, comFoto: boolean) =>
    ['avaliacoes', produtoId, ordem, comFoto] as const,
  podeAvaliar: (produtoId: string) => ['avaliacoes', 'pode', produtoId] as const,
};

export function useAvaliacoes(
  produtoId: string,
  opcoes: { ordem?: OrdemAvaliacao; comFoto?: boolean } = {},
) {
  const ordem = opcoes.ordem ?? 'recent';
  const comFoto = opcoes.comFoto ?? false;

  return useQuery({
    queryKey: chavesAvaliacao.doProduto(produtoId, ordem, comFoto),
    queryFn: () => listarAvaliacoes(produtoId, { ordem, withPhotos: comFoto }),
  });
}


export function usePodeAvaliar(produtoId: string) {
  const { usuario } = useAuth();

  return useQuery({
    queryKey: chavesAvaliacao.podeAvaliar(produtoId),
    queryFn: () => podeAvaliar(produtoId),
    enabled: Boolean(usuario),
  });
}

export function useCriarAvaliacao(produtoId: string) {
  const cliente = useQueryClient();

  return useMutation({
    mutationFn: (dados: NovaAvaliacao) => criarAvaliacao(produtoId, dados),

    onSuccess: () => {

      cliente.invalidateQueries({ queryKey: chavesAvaliacao.todas });
      cliente.invalidateQueries({ queryKey: ['produtos'] });
    },
  });
}

export function useEditarAvaliacao(produtoId: string) {
  const cliente = useQueryClient();

  return useMutation({
    mutationFn: (params: { avaliacaoId: string; dados: Partial<NovaAvaliacao> }) =>
      editarAvaliacao(params.avaliacaoId, params.dados),
    onSuccess: () => {
      cliente.invalidateQueries({ queryKey: chavesAvaliacao.todas });
      cliente.invalidateQueries({ queryKey: ['produtos'] });
    },
  });
}

export function useApagarAvaliacao() {
  const cliente = useQueryClient();

  return useMutation({
    mutationFn: (avaliacaoId: string) => apagarAvaliacao(avaliacaoId),
    onSuccess: () => {
      cliente.invalidateQueries({ queryKey: chavesAvaliacao.todas });
      cliente.invalidateQueries({ queryKey: ['produtos'] });
    },
  });
}
