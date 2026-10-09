import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ehAppError } from '../errors/AppError';
import { useFinalizarCompra } from '../hooks/useCompra';
import { usePontosRetirada } from '../hooks/usePontosRetirada';
import { formatarPreco } from '../lib/formatar';
import { AppStackParamList } from '../navigation/tipos';
import { useCarrinho } from '../hooks/useCompra';

type Props = NativeStackScreenProps<AppStackParamList, 'Checkout'>;

type Entrega = 'ENTREGA' | 'RETIRADA';

export function CheckoutScreen({ navigation }: Props) {
  const { data: carrinho } = useCarrinho();
  const { data: pontos, statusLocalizacao } = usePontosRetirada();
  const finalizar = useFinalizarCompra();

  const [modo, setModo] = useState<Entrega>('ENTREGA');
  const [pontoEscolhido, setPontoEscolhido] = useState<string | null>(null);

  const listaPontos = pontos?.data ?? [];

  function confirmar() {
    if (modo === 'RETIRADA' && !pontoEscolhido) {
      Alert.alert('Escolha o ponto', 'Selecione onde voce quer retirar o pedido.');
      return;
    }

    finalizar.mutate(modo === 'RETIRADA' ? pontoEscolhido! : undefined, {
      onSuccess: (pedido) => navigation.replace('Pedido', { pedidoId: pedido.id }),
      onError: (erro) =>
        Alert.alert(
          'Nao foi possivel fechar o pedido',
          ehAppError(erro) ? erro.mensagem : 'Tente novamente.',
        ),
    });
  }

  return (
    <ScrollView style={e.container} contentContainerStyle={e.conteudo}>
      <Text style={e.titulo}>Como voce quer receber?</Text>

      <View style={e.opcoes}>
        <Pressable
          style={[e.opcao, modo === 'ENTREGA' && e.opcaoAtiva]}
          onPress={() => setModo('ENTREGA')}
        >
          <Text style={[e.opcaoTexto, modo === 'ENTREGA' && e.opcaoTextoAtivo]}>
            Receber em casa
          </Text>
        </Pressable>

        <Pressable
          style={[e.opcao, modo === 'RETIRADA' && e.opcaoAtiva]}
          onPress={() => setModo('RETIRADA')}
        >
          <Text style={[e.opcaoTexto, modo === 'RETIRADA' && e.opcaoTextoAtivo]}>
            Retirar na loja
          </Text>
        </Pressable>
      </View>

      {modo === 'RETIRADA' ? (
        <View style={e.pontos}>
          {listaPontos.length === 0 ? (
            <Text style={e.aviso}>Esta loja ainda nao tem pontos de retirada.</Text>
          ) : (
            <>
              {statusLocalizacao !== 'ok' ? (
                <Text style={e.aviso}>
                  Sem sua localizacao, os pontos aparecem em ordem alfabetica.
                </Text>
              ) : null}

              {listaPontos.map((ponto) => {
                const escolhido = ponto.id === pontoEscolhido;
                return (
                  <Pressable
                    key={ponto.id}
                    style={[e.ponto, escolhido && e.pontoEscolhido]}
                    onPress={() => setPontoEscolhido(ponto.id)}
                  >
                    <View style={e.pontoTopo}>
                      <Text style={e.pontoNome}>{ponto.name}</Text>
                      {ponto.distanceKm !== null ? (
                        <Text style={e.pontoDistancia}>{ponto.distanceKm} km</Text>
                      ) : null}
                    </View>
                    {ponto.hours ? <Text style={e.pontoHorario}>{ponto.hours}</Text> : null}
                  </Pressable>
                );
              })}
            </>
          )}
        </View>
      ) : null}

      {carrinho ? (
        <View style={e.resumo}>
          <Text style={e.resumoRotulo}>Total</Text>
          <Text style={e.resumoValor}>{formatarPreco(carrinho.total)}</Text>
        </View>
      ) : null}

      <Pressable style={e.botao} onPress={confirmar} disabled={finalizar.isPending}>
        {finalizar.isPending ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={e.botaoTexto}>Confirmar pedido</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const e = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B132B' },
  conteudo: { padding: 16, gap: 12 },
  titulo: { fontSize: 17, fontWeight: '700', color: '#FFFFFF' },
  opcoes: { flexDirection: 'row', gap: 8 },
  opcao: {
    flex: 1, padding: 14, borderRadius: 10, borderWidth: 1.5,
    borderColor: '#1E293B', backgroundColor: '#111827', alignItems: 'center',
  },
  opcaoAtiva: { borderColor: '#0EA5E9', backgroundColor: '#0369A1' },
  opcaoTexto: { fontSize: 14, color: '#CBD5E1', fontWeight: '500' },
  opcaoTextoAtivo: { color: '#FFFFFF', fontWeight: '700' },
  pontos: { gap: 8 },
  aviso: { fontSize: 12, color: '#94A3B8', fontStyle: 'italic' },
  ponto: {
    padding: 14, borderRadius: 10, borderWidth: 1.5,
    borderColor: '#1E293B', backgroundColor: '#111827', gap: 2,
  },
  pontoEscolhido: { borderColor: '#0EA5E9', backgroundColor: '#0369A1' },
  pontoTopo: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  pontoNome: { fontSize: 15, fontWeight: '600', color: '#FFFFFF', flexShrink: 1 },
  pontoDistancia: { fontSize: 12, color: '#38BDF8', fontWeight: '600' },
  pontoHorario: { fontSize: 12, color: '#94A3B8' },
  resumo: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  resumoRotulo: { fontSize: 16, color: '#CBD5E1' },
  resumoValor: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
  botao: { backgroundColor: '#0EA5E9', borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 8 },
  botaoTexto: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});