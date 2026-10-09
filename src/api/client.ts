

import axios, { AxiosError, AxiosInstance } from 'axios';

import { config } from '../config/env';
import { AppError, TipoErro } from '../errors/AppError';
import { lerSeguro } from '../storage/armazenamentoSeguro';
import { CHAVES_SEGURAS } from '../storage/chavesArmazenamento';
import { notificarSessaoExpirada } from '../storage/sessaoExpirada';

export const api: AxiosInstance = axios.create({
  baseURL: config.urlBase,

  timeout: 10000,

  headers: { 'Content-Type': 'application/json' },
});


api.interceptors.request.use(
  async (config_) => {

    if (config.apiKey) {
      config_.headers.set('X-API-Key', config.apiKey);
    }


    if (config.rm) {
      config_.headers.set('X-Student-RM', config.rm);
    }

    const token = await lerSeguro(CHAVES_SEGURAS.token);
    if (token) {
      config_.headers.set('Authorization', `Bearer ${token}`);
    }

    if (__DEV__) {
      console.log(`[API] -> ${config_.method?.toUpperCase()} ${config_.url}`);
    }


    return config_;
  },
  (erro) => Promise.reject(erro),
);


api.interceptors.response.use(
  (resposta) => {
    if (__DEV__) {
      console.log(`[API] <- ${resposta.status} ${resposta.config.url}`);
    }
    return resposta;
  },

  async (erro: AxiosError) => {

    const ehTentativaDeLogin = erro.config?.url?.includes('/auth/login') ?? false;

    if (erro.response?.status === 401 && !ehTentativaDeLogin) {
      await notificarSessaoExpirada();
    }

    return Promise.reject(traduzirErro(erro));
  },
);


type CorpoErro = { error?: { code?: string; message?: string } };

function traduzirErro(erro: AxiosError): AppError {
  if (erro.code === 'ECONNABORTED') {
    return new AppError({
      tipo: 'TIMEOUT',
      mensagem: 'O servidor demorou para responder. Tente novamente.',
    });
  }

  if (!erro.response) {
    return new AppError({
      tipo: 'REDE',
      mensagem: 'Sem conexao com a internet. Verifique sua rede.',
    });
  }

  const status = erro.response.status;
  const corpo = erro.response.data as CorpoErro | undefined;
  const codigo = corpo?.error?.code;
  const mensagemDaApi = corpo?.error?.message;

  let tipo: TipoErro;
  let mensagemPadrao: string;

  if (status === 401) {
    tipo = 'NAO_AUTORIZADO';
    mensagemPadrao = 'Sua sessao expirou. Entre novamente.';
  } else if (status === 404) {
    tipo = 'NAO_ENCONTRADO';
    mensagemPadrao = 'Nao encontramos o que voce procura.';
  } else if (status >= 400 && status < 500) {
    tipo = 'CLIENTE';
    mensagemPadrao = 'Houve um problema com a solicitacao.';
  } else if (status >= 500) {
    tipo = 'SERVIDOR';
    mensagemPadrao = 'O servidor esta com problemas. Tente mais tarde.';
  } else {
    tipo = 'DESCONHECIDO';
    mensagemPadrao = 'Algo deu errado. Tente novamente.';
  }

  const mensagem = status < 500 && mensagemDaApi ? mensagemDaApi : mensagemPadrao;

  return new AppError({ tipo, mensagem, status, codigo });
}
