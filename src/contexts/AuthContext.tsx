import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

import { queryClient } from '../lib/queryClient';
import { cadastrar as cadastrarNaApi, login as loginNaApi } from '../services/authService';
import { apagarLocal, guardarLocal, lerLocal } from '../storage/armazenamentoLocal';
import { apagarSeguro, guardarSeguro, lerSeguro } from '../storage/armazenamentoSeguro';
import { CHAVES, CHAVES_SEGURAS } from '../storage/chavesArmazenamento';
import { registrarAoExpirar } from '../storage/sessaoExpirada';
import { Credenciais, NovoCliente, RespostaLogin, Usuario } from '../types/usuario';
import { obterTokenAtual } from './NotificacoesContext';
import { removerAparelho } from '../services/notificacoesService';

type AuthContextValor = {
  usuario: Usuario | null;
  carregandoSessao: boolean;
  entrar: (credenciais: Credenciais) => Promise<void>;
  cadastrar: (dados: NovoCliente) => Promise<void>;
  sair: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValor | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const [carregandoSessao, setCarregandoSessao] = useState(true);

  async function limparSessao() {
    await apagarSeguro(CHAVES_SEGURAS.token);
    await apagarSeguro(CHAVES_SEGURAS.refreshToken);
    await apagarLocal(CHAVES.usuario);

    queryClient.clear();

    setUsuario(null);


  }


  useEffect(() => {
    async function restaurarSessao() {
      try {
        const token = await lerSeguro(CHAVES_SEGURAS.token);
        if (!token) return;


        const dadosGuardados = await lerLocal<Usuario>(CHAVES.usuario);
        if (dadosGuardados) {
          setUsuario(dadosGuardados);
        }
      } finally {
        setCarregandoSessao(false);
      }
    }

    restaurarSessao();
  }, []);

  useEffect(() => {
    registrarAoExpirar(limparSessao);
  }, []);


  async function guardarSessao(resposta: RespostaLogin) {

    await guardarSeguro(CHAVES_SEGURAS.token, resposta.token);

    if (resposta.refreshToken) {
      await guardarSeguro(CHAVES_SEGURAS.refreshToken, resposta.refreshToken);
    }

    const dadosUsuario: Usuario = {
      id: resposta.customer.id,
      name: resposta.customer.name,
      email: resposta.customer.email,
      image: resposta.customer.image ?? null,
    };
    await guardarLocal(CHAVES.usuario, dadosUsuario);

    setUsuario(dadosUsuario);
  }

  async function entrar(credenciais: Credenciais) {
    await guardarSessao(await loginNaApi(credenciais));
  }


  async function cadastrar(dados: NovoCliente) {
    await guardarSessao(await cadastrarNaApi(dados));
  }

  async function sair() {

    const token = obterTokenAtual();
    if (token) {
      try {
        await removerAparelho(token);
      } catch {

      }
    }

    await limparSessao();
  }

  return (
    <AuthContext.Provider value={{ usuario, carregandoSessao, entrar, cadastrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValor {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth precisa estar dentro de um AuthProvider');
  }
  return contexto;
}
