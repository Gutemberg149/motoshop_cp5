import { useMemo } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { EstadoCarregando } from '../components/EstadoCarregando';
import { EstadoErro } from '../components/EstadoErro';
import { Estrelas } from '../components/Estrelas';
import { SecaoAvaliacoes } from '../components/SecaoAvaliacoes';
import { useFavoritos } from '../contexts/FavoritosContext';
import { ehAppError } from '../errors/AppError';
import { useAdicionarAoCarrinho } from '../hooks/useCompra';
import { useProduto } from '../hooks/useProdutos';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { PrecoAnimado } from '../components/PrecoAnimado';
import { Pressionavel } from '../components/Pressionavel';
import { formatarFaixaDePreco, formatarPreco } from '../lib/formatar';
import { resumoDeDetalhe } from '../lib/produto';
import { AppStackParamList } from '../navigation/tipos';

type Props = NativeStackScreenProps<AppStackParamList, 'DetalheProduto'>;

export function DetalheProdutoScreen({ route, navigation }: Props) {
  const { id } = route.params;

  const { data, isPending, isError, error, refetch } = useProduto(id);
  const { alternarFavorito, ehFavorito } = useFavoritos();
  const adicionar = useAdicionarAoCarrinho();

  const resumo = useMemo(() => (data ? resumoDeDetalhe(data) : null), [data]);

  if (isPending) return <EstadoCarregando />;

  if (isError) {
    return (
      <EstadoErro
        mensagem={ehAppError(error) ? error.mensagem : 'Algo inesperado aconteceu.'}
        aoTentarNovamente={() => refetch()}
      />
    );
  }

  const favoritado = ehFavorito(data.id);
  const principal = data.images.find((i) => i.isPrimary) ?? data.images[0];
  const varianteUnica = data.variants.length === 1 ? data.variants[0] : undefined;

  return (
    <ScrollView style={e.container} contentContainerStyle={e.conteudo}>
      {principal ? (
        <Animated.Image entering={FadeIn.duration(300)} source={{ uri: principal.url }} style={e.imagem} />
      ) : (
        <View style={[e.imagem, e.semImagem]}>
          <Text style={e.semImagemTexto}>Produto sem foto</Text>
        </View>
      )}

      <Animated.Text entering={FadeInDown.delay(80).duration(260)} style={e.titulo}>
        {data.name}
      </Animated.Text>

      {data.brand && (
        <Animated.Text entering={FadeInDown.delay(110).duration(260)} style={e.marca}>
          {data.brand.name}
        </Animated.Text>
      )}

      <Animated.View entering={FadeInDown.delay(140).duration(260)}>
        {varianteUnica ? (
          <PrecoAnimado valor={varianteUnica.price} style={e.preco} />
        ) : (
          <Text style={e.preco}>
            {resumo ? formatarFaixaDePreco(resumo.priceFrom, resumo.priceTo) : ''}
          </Text>
        )}
      </Animated.View>

      {data.rating.count > 0 ? (
        <View style={e.notaLinha}>
          <Estrelas nota={data.rating.average} tamanho={15} />
          <Text style={e.notaTexto}>
            {data.rating.average.toFixed(1)} ({data.rating.count})
          </Text>
        </View>
      ) : null}

      <Pressionavel
        style={[e.botao, favoritado && e.botaoAtivo]}
        onPress={() => resumo && alternarFavorito(resumo)}
        accessibilityRole="button"
      >
        <Text style={[e.textoBotao, favoritado && e.textoBotaoAtivo]}>
          {favoritado ? '★  Salvo' : '☆  Salvar'}
        </Text>
      </Pressionavel>

      <Pressionavel
        style={e.comprar}
        onPress={() => {
          const variante = data.variants.find((v) => v.isDefault) ?? data.variants[0];
          if (!variante) return;
          adicionar.mutate(
            { variantId: variante.id },
            { onSuccess: () => navigation.navigate('Carrinho') },
          );
        }}
        disabled={adicionar.isPending || resumo?.stock === 0}
      >
        <Text style={e.comprarTexto}>
          {adicionar.isPending ? 'Adicionando...' : 'Adicionar ao carrinho'}
        </Text>
      </Pressionavel>

      {data.description && <Text style={e.descricao}>{data.description}</Text>}

      {data.variants.length > 1 && (
        <View style={e.bloco}>
          <Text style={e.blocoTitulo}>Opcoes</Text>
          {data.variants.map((v) => (
            <View key={v.id} style={e.variante}>
              <Text style={e.varianteNome}>{v.label ?? v.sku ?? 'Padrao'}</Text>
              <Text style={e.variantePreco}>{formatarPreco(v.price)}</Text>
            </View>
          ))}
        </View>
      )}

      {resumo?.stock === 0 && <Text style={e.semEstoque}>Produto sem estoque.</Text>}

      <SecaoAvaliacoes
        produtoId={data.id}
        aoAvaliar={() => navigation.navigate('Avaliar', { produtoId: data.id, produtoNome: data.name })}
      />
    </ScrollView>
  );
}

const e = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B132B' },
  conteudo: { padding: 20, gap: 10 },
  imagem: { width: '100%', height: 220, borderRadius: 12, backgroundColor: '#1C2541' },
  semImagem: { alignItems: 'center', justifyContent: 'center' },
  semImagemTexto: { color: '#64748B', fontSize: 14 },
  titulo: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', marginTop: 4 },
  marca: { fontSize: 14, color: '#94A3B8' },
  preco: { fontSize: 20, fontWeight: '700', color: '#0EA5E9' },
  botao: {
    borderWidth: 1.5,
    borderColor: '#0EA5E9',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  botaoAtivo: { backgroundColor: '#0EA5E9' },
  textoBotao: { color: '#0EA5E9', fontWeight: '700', fontSize: 15 },
  textoBotaoAtivo: { color: '#FFFFFF' },
  descricao: { fontSize: 15, lineHeight: 22, color: '#CBD5E1', marginTop: 8 },
  bloco: { marginTop: 12, gap: 6 },
  blocoTitulo: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  variante: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  varianteNome: { fontSize: 14, color: '#CBD5E1' },
  variantePreco: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
  semEstoque: { marginTop: 12, color: '#EF4444', fontWeight: '600' },
  notaLinha: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  notaTexto: { fontSize: 13, color: '#94A3B8' },
  comprar: {
    backgroundColor: '#0EA5E9', borderRadius: 8, paddingVertical: 14,
    alignItems: 'center', marginTop: 4,
  },
  comprarTexto: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
});