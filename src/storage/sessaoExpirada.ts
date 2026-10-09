type AoExpirar = () => Promise<void>;


let aoExpirar: AoExpirar | null = null;


export function registrarAoExpirar(fn: AoExpirar): void {
  aoExpirar = fn;
}


export async function notificarSessaoExpirada(): Promise<void> {
  if (aoExpirar) {
    await aoExpirar();
  }
}
