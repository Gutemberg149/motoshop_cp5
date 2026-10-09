import { Image, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOutRight, LinearTransition } from 'react-native-reanimated';
import { FontAwesome5 } from '@expo/vector-icons';

import { formatarFaixaDePreco } from '../lib/formatar';
import { ProdutoResumo } from '../types/produto';
import { BotaoFavorito } from './BotaoFavorito';
import { Pressionavel } from './Pressionavel';

type Props = {
  produto: ProdutoResumo;
  aoPressionar: (id: string) => void;
  ehFavorito?: boolean;
  aoFavoritar?: (produto: ProdutoResumo) => void;
  indice?: number;
};

const ATRASO_MAXIMO = 300;

export function CardProduto({ produto, aoPressionar, ehFavorito, aoFavoritar, indice = 0 }: Props) {
  return (
    <Animated.View
      entering={FadeInDown.delay(Math.min(indice * 40, ATRASO_MAXIMO)).duration(260)}
      exiting={FadeOutRight.duration(200)}
      layout={LinearTransition.springify().damping(18)}
    >
      <Pressionavel style={e.card} onPress={() => aoPressionar(produto.id)}>
        <View style={[e.imagem, e.semImagem]}>
          <FontAwesome5 name="cog" size={24} color="#0EA5E9" />
        </View>

        <View style={e.info}>
          <Text style={e.categoria}>PEÇA MULTIMARCA</Text>
          <Text style={e.titulo} numberOfLines={2}>
            {produto.name}
          </Text>

          <Text style={e.preco}>
            {formatarFaixaDePreco(produto.priceFrom, produto.priceTo)}
          </Text>

          {produto.stock === 0 && <Text style={e.semEstoque}>Sem estoque</Text>}
        </View>

        <FontAwesome5 name="chevron-right" size={14} color="#64748B" style={e.seta} />

        {aoFavoritar && (
          <BotaoFavorito ativo={ehFavorito ?? false} aoPressionar={() => aoFavoritar(produto)} />
        )}
      </Pressionavel>
    </Animated.View>
  );
}

const e = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#1d2d50',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3e5c8b',
  },
  imagem: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#25335b',
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  semImagem: { alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, gap: 2 },
  categoria: { fontSize: 10, fontWeight: '700', color: '#0EA5E9', letterSpacing: 0.5 },
  titulo: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  preco: { fontSize: 16, fontWeight: '800', color: '#0EA5E9', marginTop: 2 },
  semEstoque: { fontSize: 12, color: '#EF4444', fontWeight: '600' },
  seta: { marginLeft: 8 },
});