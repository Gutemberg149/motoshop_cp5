
import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

import { useAuth } from './AuthContext';
import { navegarPara } from '../navigation/navegacao';
import { registrarAparelho } from '../services/notificacoesService';
import { DadosNotificacao } from '../types/notificacao';
import { prepararCanalAndroid } from '../lib/notificacoes';


export type StatusNotificacoes =
  | 'verificando'
  | 'concedida'
  | 'negada'
  | 'indisponivel';

let tokenAtual: string | null = null;
export const obterTokenAtual = (): string | null => tokenAtual;

interface NotificacoesContextValor {
  status: StatusNotificacoes;
  token: string | null;

  motivo: string | null;
  tentarNovamente: () => Promise<void>;
}

const NotificacoesContext = createContext<NotificacoesContextValor | null>(null);

export function NotificacoesProvider({ children }: { children: ReactNode }) {
  const { usuario } = useAuth();
  const [status, setStatus] = useState<StatusNotificacoes>('verificando');
  const [token, setToken] = useState<string | null>(null);
  const [motivo, setMotivo] = useState<string | null>(null);

  const jaRegistrado = useRef<string | null>(null);

  // ---- 1 + 2: permissao e token ------------------------------------------
  const preparar = useCallback(async () => {
    setStatus('verificando');
    setMotivo(null);


    if (!Device.isDevice) {
      setStatus('indisponivel');
      setMotivo('Push remoto precisa de aparelho fisico ou de um emulador com Google Play.');
      return;
    }

    await prepararCanalAndroid();


    const atual = await Notifications.getPermissionsAsync();
    let concedida = atual.granted;

    if (!concedida && atual.canAskAgain) {
      const pedida = await Notifications.requestPermissionsAsync();
      concedida = pedida.granted;
    }

    if (!concedida) {
      setStatus('negada');
      setMotivo('Voce recusou notificacoes. Para reativar, va em Ajustes do sistema.');
      return;
    }

    try {

      const { data } = await Notifications.getDevicePushTokenAsync();
      tokenAtual = data;
      setToken(data);
      setStatus('concedida');
    } catch (erro) {
      tokenAtual = null;
      setToken(null);
      setStatus('indisponivel');
      setMotivo(
        'Nao foi possivel obter o token do aparelho. No Expo Go isso e esperado: ' +
          'push remoto exige um development build. Detalhe: ' +
          (erro instanceof Error ? erro.message : String(erro)),
      );
    }
  }, []);

  useEffect(() => {
    preparar();
  }, [preparar]);

  useEffect(() => {
    if (!usuario || !token) return;
    if (jaRegistrado.current === token) return;

    registrarAparelho(token)
      .then(() => {
        jaRegistrado.current = token;
      })
      .catch((erro) => {

        console.warn('[push] nao consegui registrar o aparelho:', erro?.message ?? erro);
      });
  }, [usuario, token]);


  const ultimaTratada = useRef<string | null>(null);

  useEffect(() => {

    const aoReceber = Notifications.addNotificationReceivedListener((notificacao) => {
      const dados = notificacao.request.content.data as DadosNotificacao;
      console.log('[push] chegou:', notificacao.request.content.title, dados);
    });

    const aoTocar = Notifications.addNotificationResponseReceivedListener((resposta) => {
      tratarToque(resposta);
    });


    Notifications.getLastNotificationResponseAsync().then((resposta) => {
      if (!resposta) return;
      tratarToque(resposta);
    });

    function tratarToque(resposta: Notifications.NotificationResponse) {
      const id = resposta.notification.request.identifier;
      if (ultimaTratada.current === id) return;
      ultimaTratada.current = id;
      abrirDaNotificacao(resposta.notification.request.content.data as DadosNotificacao);
    }

    return () => {
      aoReceber.remove();
      aoTocar.remove();
    };
  }, []);

  return (
    <NotificacoesContext.Provider value={{ status, token, motivo, tentarNovamente: preparar }}>
      {children}
    </NotificacoesContext.Provider>
  );
}

export function useNotificacoes(): NotificacoesContextValor {
  const contexto = useContext(NotificacoesContext);
  if (!contexto) {
    throw new Error('useNotificacoes precisa estar dentro de um NotificacoesProvider');
  }
  return contexto;
}

function abrirDaNotificacao(dados: DadosNotificacao | undefined): void {
  if (!dados) return;

  if (dados.rota === 'produto' && dados.produtoId) {
    navegarPara({
      tela: 'DetalheProduto',
      params: {
        id: dados.produtoId,

        nome: 'Produto',
      },
    });
    return;
  }

  if (dados.rota === 'favoritos') {
    navegarPara({ tela: 'Favoritos' });
    return;
  }

  navegarPara({ tela: 'ListaProdutos' });
}
