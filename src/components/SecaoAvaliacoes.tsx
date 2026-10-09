import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '../contexts/AuthContext';
import { useAvaliacoes, usePodeAvaliar } from '../hooks/useAvaliacoes';
import { CardAvaliacao } from './CardAvaliacao';
import { ResumoAvaliacoes } from './ResumoAvaliacoes';

type Props = {
  produtoId: string;
  aoAvaliar: () => void;
};

export function SecaoAvaliacoes({ produtoId, aoAvaliar }: Props) {
  const { usuario } = useAuth();
  const { data, isPending } = useAvaliacoes(produtoId);
  const { data: permissao } = usePodeAvaliar(produtoId);

  if (isPending) {
    return (
      <View style={e.carregando}>
        <ActivityIndicator color="#0EA5E9" />
      </View>
    );
  }

  if (!data) return null;

  return (
    <View style={e.container}>
      <Text style={e.titulo}>Avaliacoes</Text>

      <ResumoAvaliacoes resumo={data.summary} />

      {usuario && permissao?.canReview ? (
        <Pressable style={e.botao} onPress={aoAvaliar}>
          <Text style={e.botaoTexto}>Avaliar produto</Text>
        </Pressable>
      ) : null}

      {usuario && permissao?.reason === 'ALREADY_REVIEWED' ? (
        <Text style={e.aviso}>Voce ja avaliou este produto.</Text>
      ) : null}

      {usuario && permissao?.reason === 'NOT_PURCHASED' ? (
        <Text style={e.aviso}>{permissao.message}</Text>
      ) : null}

      <View style={e.lista}>
        {data.data.map((avaliacao) => (
          <CardAvaliacao key={avaliacao.id} avaliacao={avaliacao} />
        ))}
      </View>
    </View>
  );
}

const e = StyleSheet.create({
  container: { gap: 10, marginTop: 8 },
  carregando: { paddingVertical: 24, alignItems: 'center' },
  titulo: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  botao: {
    backgroundColor: '#0EA5E9', borderRadius: 10, padding: 14, alignItems: 'center',
  },
  botaoTexto: { color: '#FFF', fontSize: 15, fontWeight: '600' },
  aviso: { fontSize: 13, color: '#94A3B8', fontStyle: 'italic' },
  lista: { gap: 10, marginTop: 4 },
});