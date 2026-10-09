import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { EstadoCarregando } from '../components/EstadoCarregando';
import { EstadoVazio } from '../components/EstadoVazio';
import { ehAppError } from '../errors/AppError';
import { useCarrinho, useFinalizarCompra } from '../hooks/useCompra';
import { formatarPreco } from '../lib/formatar';
import { AppStackParamList } from '../navigation/tipos';

type Props = NativeStackScreenProps<AppStackParamList, 'Carrinho'>;

export function CarrinhoScreen({ navigation }: Props) {
  const { data, isPending } = useCarrinho();
  const finalizar = useFinalizarCompra();

  if (isPending) return <EstadoCarregando />;
  if (!data || data.items.length === 0) return <EstadoVazio mensagem="Seu carrinho esta vazio." />;

  return (
    <View style={e.container}>
      <FlatList
        data={data.items}
        keyExtractor={(item) => item.variantId}
        contentContainerStyle={e.lista}
        renderItem={({ item }) => (
          <View style={e.item}>
            <Text style={e.nome}>{item.name}</Text>
            <Text style={e.detalhe}>
              {item.quantity} x {formatarPreco(item.unitPrice)}
            </Text>
            <Text style={e.subtotal}>{formatarPreco(item.subtotal)}</Text>
          </View>
        )}
      />

      <View style={e.rodape}>
        <View style={e.totalLinha}>
          <Text style={e.totalRotulo}>Total</Text>
          <Text style={e.totalValor}>{formatarPreco(data.total)}</Text>
        </View>

        <Pressable
          style={e.botao}
          onPress={() => navigation.navigate('Checkout')}
          disabled={finalizar.isPending}
        >
          <Text style={e.botaoTexto}>Finalizar compra</Text>
        </Pressable>
      </View>
    </View>
  );
}

const e = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B132B' },
  lista: { padding: 16, gap: 10 },
  item: { backgroundColor: '#111827', borderRadius: 12, padding: 14, gap: 2, borderWidth: 1, borderColor: '#1E293B' },
  nome: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
  detalhe: { fontSize: 13, color: '#94A3B8' },
  subtotal: { fontSize: 15, fontWeight: '700', color: '#0EA5E9' },
  rodape: { padding: 16, gap: 12, borderTopWidth: 1, borderTopColor: '#1E293B', backgroundColor: '#111827' },
  totalLinha: { flexDirection: 'row', justifyContent: 'space-between' },
  totalRotulo: { fontSize: 16, color: '#CBD5E1' },
  totalValor: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
  botao: { backgroundColor: '#0EA5E9', borderRadius: 10, padding: 16, alignItems: 'center' },
  botaoTexto: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});