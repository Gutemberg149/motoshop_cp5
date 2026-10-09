import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useNotificacoes } from '../contexts/NotificacoesContext';

const TITULO: Record<string, string> = {
  verificando: 'Verificando notificacoes...',
  concedida: 'Notificacoes ligadas',
  negada: 'Notificacoes recusadas',
  indisponivel: 'Push indisponivel aqui',
};

export function CartaoNotificacoes() {
  const { status, token, motivo, tentarNovamente } = useNotificacoes();

  const ok = status === 'concedida';

  return (
    <View style={[e.cartao, ok ? e.cartaoOk : e.cartaoAviso]}>
      <Text style={e.titulo}>{TITULO[status]}</Text>

      {ok && token && (
        <>
          <Text style={e.legenda}>Token deste aparelho no Firebase</Text>
          <Text style={e.token}>
            {token.slice(0, 12)}...{token.slice(-6)}
          </Text>
        </>
      )}

      {motivo && <Text style={e.motivo}>{motivo}</Text>}

      {!ok && status !== 'verificando' && (
        <Pressable style={e.botao} onPress={tentarNovamente} accessibilityRole="button">
          <Text style={e.textoBotao}>Tentar de novo</Text>
        </Pressable>
      )}
    </View>
  );
}

const e = StyleSheet.create({
  cartao: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  cartaoOk: { borderColor: '#0EA5E9', backgroundColor: '#0EA5E912' },
  cartaoAviso: { borderColor: '#2c405f', backgroundColor: '#142a69' },
  titulo: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  legenda: { fontSize: 12, color: '#e1eaf7', marginTop: 8 },
  token: { fontSize: 13, color: '#FFFFFF', fontVariant: ['tabular-nums'] },
  motivo: { fontSize: 14, color: '#e7ebf1', marginTop: 4, lineHeight: 18 },
  botao: {
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: '#0EA5E9',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  textoBotao: { color: '#0EA5E9', fontWeight: '700', fontSize: 14 },
});