export type RotaNotificacao = 'produto' | 'favoritos' | 'home';


export interface DadosNotificacao {
  rota?: RotaNotificacao | string;
  produtoId?: string;
  variantId?: string;
  slug?: string;
  precoAntigo?: string;
  precoNovo?: string;

  [chave: string]: string | undefined;
}
