import { useQuery } from '@tanstack/react-query';

import {
  buscarProdutoPorId,
  buscarProdutosPorTermo,
  listarProdutos,
} from '../services/produtosService';


export const chaves = {
  todos: ['produtos'] as const,
  lista: (pageSize: number) => ['produtos', 'lista', pageSize] as const,
  detalhe: (id: string) => ['produtos', 'detalhe', id] as const,
  busca: (termo: string) => ['produtos', 'busca', termo] as const,
};

export function useProdutos(pageSize = 20) {
  return useQuery({
    queryKey: chaves.lista(pageSize),
    queryFn: () => listarProdutos(pageSize),
  });
}


export function useProduto(id: string) {
  return useQuery({
    queryKey: chaves.detalhe(id),
    queryFn: () => buscarProdutoPorId(id),
  });
}


export function useBuscaProdutos(termo: string) {
  return useQuery({
    queryKey: chaves.busca(termo),
    queryFn: () => buscarProdutosPorTermo(termo),
    enabled: termo.trim().length >= 2,
  });
}
