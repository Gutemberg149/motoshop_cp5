
import { createNavigationContainerRef } from '@react-navigation/native';

import { AppStackParamList } from './tipos';

export const navegacaoRef = createNavigationContainerRef<AppStackParamList>();

type Destino =
  | { tela: 'DetalheProduto'; params: AppStackParamList['DetalheProduto'] }
  | { tela: 'Favoritos' }
  | { tela: 'ListaProdutos' };

let pendente: Destino | null = null;

export function navegarPara(destino: Destino): void {
  if (!navegacaoRef.isReady()) {
    pendente = destino;
    return;
  }
  executar(destino);
}


export function consumirNavegacaoPendente(): void {
  if (!pendente) return;
  const destino = pendente;
  pendente = null;
  executar(destino);
}

function executar(destino: Destino): void {
  if (destino.tela === 'DetalheProduto') {
    navegacaoRef.navigate('DetalheProduto', destino.params);
    return;
  }
  navegacaoRef.navigate(destino.tela);
}
