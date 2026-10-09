
import { api } from '../api/client';
import { Carrinho, MetodoPagamento, Pedido } from '../types/pedido';

export async function buscarCarrinho(): Promise<Carrinho> {
  const resposta = await api.get<Carrinho>('/cart');
  return resposta.data;
}

export async function adicionarAoCarrinho(
  variantId: string,
  quantidade = 1,
): Promise<Carrinho> {
  const resposta = await api.post<Carrinho>('/cart/items', { variantId, quantity: quantidade });
  return resposta.data;
}

export async function removerDoCarrinho(itemId: string): Promise<void> {
  await api.delete(`/cart/items/${itemId}`);
}


export async function finalizarCompra(pontoRetiradaId?: string): Promise<Pedido> {
  const resposta = await api.post<Pedido>('/orders/checkout', {
    pickupPointId: pontoRetiradaId,
  });
  return resposta.data;
}



export async function pagarPedido(
  pedidoId: string,
  metodo: MetodoPagamento,
  simular: 'approve' | 'decline' = 'approve',
): Promise<Pedido> {
  const resposta = await api.post<Pedido>(`/orders/${pedidoId}/pay`, {
    method: metodo,
    simulate: simular,
  });
  return resposta.data;
}

export async function listarPedidos(): Promise<Pedido[]> {
  const resposta = await api.get<Pedido[]>('/orders');
  return resposta.data;
}
