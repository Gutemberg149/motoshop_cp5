
export type AuthStackParamList = {
  Login: undefined;
  Cadastro: undefined;
};

export type AppStackParamList = {
  ListaProdutos: undefined;


  DetalheProduto: { id: string; nome: string };

  Favoritos: undefined;
  Perfil: undefined;

  Carrinho: undefined;
  Checkout: undefined;
  Pedido: { pedidoId: string };


  Avaliar: { produtoId: string; produtoNome: string };

  PontosRetirada: undefined;
};
