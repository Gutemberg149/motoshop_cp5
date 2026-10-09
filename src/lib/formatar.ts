
export function formatarPreco(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });
}

export function formatarFaixaDePreco(de: number, ate: number): string {
  if (de === ate) return formatarPreco(de);
  return `a partir de ${formatarPreco(de)}`;
}


export function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return '?';

  const primeira = partes[0]?.[0] ?? '';
  const ultima = partes.length > 1 ? (partes[partes.length - 1]?.[0] ?? '') : '';

  return (primeira + ultima).toUpperCase();
}
