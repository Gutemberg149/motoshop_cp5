
import { api } from '../api/client';
import { ProdutoDetalhe, ProdutoResumo, RespostaListaProdutos } from '../types/produto';


export async function listarProdutos(pageSize = 20): Promise<ProdutoResumo[]> {
  const resposta = await api.get<RespostaListaProdutos>('/products', {

    params: { page: 1, pageSize },
  });


  return resposta.data.data;
}


export async function buscarProdutosPorTermo(termo: string): Promise<ProdutoResumo[]> {
  const resposta = await api.get<RespostaListaProdutos>('/products', {
    params: { search: termo, page: 1, pageSize: 20 },
  });
  return resposta.data.data;
}

export async function buscarProdutoPorId(id: string): Promise<ProdutoDetalhe> {
  const resposta = await api.get<ProdutoDetalhe>(`/products/${id}`);
  return resposta.data;
}
