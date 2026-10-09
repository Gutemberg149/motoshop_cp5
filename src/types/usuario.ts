export type Usuario = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
};

/** Corpo do POST /auth/login. O "usuario" desta API e o e-mail. */
export type Credenciais = {
  email: string;
  password: string;
};


export type NovoCliente = Credenciais & {
  name: string;
  document?: string;
};

export type RespostaLogin = {
  token: string;
  refreshToken?: string;
  customer: Usuario;
};
