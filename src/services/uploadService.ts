

import { api } from '../api/client';
import { MidiaEnviada } from '../types/avaliacao';


export type ArquivoLocal = {
  uri: string;
  name: string;
  type: string;
};


export async function enviarImagem(
  arquivo: ArquivoLocal,
  pasta = 'avaliacoes',
): Promise<MidiaEnviada> {
  const form = new FormData();

  form.append('file', arquivo as any);
  form.append('folder', pasta);

  const resposta = await api.post<MidiaEnviada>('/uploads', form, {

    headers: { 'Content-Type': undefined as unknown as string },

    timeout: 60000,
  });

  return resposta.data;
}


export function arquivoDaUri(uri: string): ArquivoLocal {
  const nome = uri.split('/').pop() || `foto-${Date.now()}.jpg`;
  const extensao = nome.split('.').pop()?.toLowerCase() ?? 'jpg';
  const tipo = extensao === 'png' ? 'image/png' : 'image/jpeg';
  return { uri, name: nome, type: tipo };
}
