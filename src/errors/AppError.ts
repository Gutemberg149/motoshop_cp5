
export type TipoErro =
  | 'REDE'
  | 'TIMEOUT'
  | 'NAO_AUTORIZADO'
  | 'NAO_ENCONTRADO'
  | 'CLIENTE'
  | 'SERVIDOR'
  | 'DESCONHECIDO';

export class AppError extends Error {
  public readonly tipo: TipoErro;
  public readonly mensagem: string;
  public readonly status?: number;


  public readonly codigo?: string;

  constructor(params: { tipo: TipoErro; mensagem: string; status?: number; codigo?: string }) {
    super(params.mensagem);
    this.name = 'AppError';
    this.tipo = params.tipo;
    this.mensagem = params.mensagem;
    this.status = params.status;
    this.codigo = params.codigo;
  }
}


export function ehAppError(valor: unknown): valor is AppError {
  return valor instanceof AppError;
}
