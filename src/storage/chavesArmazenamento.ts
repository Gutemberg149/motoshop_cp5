export const CHAVES_SEGURAS = {
  token: 'auth.token',


  refreshToken: 'auth.refreshToken',
} as const;

export const CHAVES = {

  usuario: 'sessao.usuario',


  favoritos: (usuarioId: string) => `favoritos.${usuarioId}`,
} as const;
