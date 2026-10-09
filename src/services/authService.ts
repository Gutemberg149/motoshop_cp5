

import { api } from '../api/client';
import { Credenciais, NovoCliente, RespostaLogin } from '../types/usuario';

export async function login(credenciais: Credenciais): Promise<RespostaLogin> {
  const resposta = await api.post<RespostaLogin>('/auth/login', credenciais);
  return resposta.data;
}


export async function cadastrar(dados: NovoCliente): Promise<RespostaLogin> {
  const resposta = await api.post<RespostaLogin>('/auth/register', dados);
  return resposta.data;
}
