
import { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { EstadoCarregando } from '../components/EstadoCarregando';
import { EstadoErro } from '../components/EstadoErro';
import { EstadoVazio } from '../components/EstadoVazio';
import { ehAppError } from '../errors/AppError';
import { usePontosRetirada } from '../hooks/usePontosRetirada';
import { cores } from '../lib/tema';
import { Coordenada, PontoRetirada } from '../types/localizacao';


const REGIAO_PADRAO = {
  latitude: -23.5505,
  longitude: -46.6333,
  latitudeDelta: 0.2,
  longitudeDelta: 0.2,
};

function enderecoResumido(ponto: PontoRetirada): string {
  const { street, number, district, city } = ponto.address;
  return [[street, number].filter(Boolean).join(', '), district, city]
    .filter(Boolean)
    .join(' - ');
}

export function PontosRetiradaScreen() {
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    posicao,
    statusLocalizacao,
    tentarLocalizacaoNovamente,
  } = usePontosRetirada();

  const pontos = data?.data ?? [];


  const regiaoInicial = useMemo(() => {
    const alvo: Coordenada | undefined = posicao ?? pontos[0]?.coordinate;
    if (!alvo) return REGIAO_PADRAO;
    return {
      latitude: alvo.latitude,
      longitude: alvo.longitude,

      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
  }, [posicao, pontos]);

  if (isPending) return <EstadoCarregando mensagem="Buscando pontos de retirada..." />;

  if (isError) {
    return (
      <EstadoErro
        mensagem={ehAppError(error) ? error.mensagem : 'Nao foi possivel carregar os pontos.'}
        aoTentarNovamente={() => refetch()}
      />
    );
  }

  if (pontos.length === 0) {
    return <EstadoVazio mensagem="Esta loja ainda nao tem pontos de retirada." />;
  }

  return (
    <View style={e.container}>
      <MapView
        style={e.mapa}
        initialRegion={regiaoInicial}


        showsUserLocation={statusLocalizacao === 'ok'}
      >
        {pontos.map((ponto) => (
          <Marker
            key={ponto.id}

            coordinate={ponto.coordinate}
            title={ponto.name}
            description={
              ponto.distanceKm !== null
                ? `${ponto.distanceKm} km de voce`
                : enderecoResumido(ponto)
            }
          />
        ))}
      </MapView>


      {statusLocalizacao === 'negada' ? (
        <View style={e.aviso}>
          <Text style={e.avisoTexto}>
            Sem acesso a sua localizacao, nao da para ordenar por proximidade.
          </Text>
        </View>
      ) : null}

      {statusLocalizacao === 'erro' ? (
        <Pressable style={e.aviso} onPress={tentarLocalizacaoNovamente}>
          <Text style={e.avisoTexto}>
            Nao conseguimos sua localizacao. Toque para tentar de novo.
          </Text>
        </Pressable>
      ) : null}

      <FlatList
        data={pontos}
        keyExtractor={(ponto) => ponto.id}
        contentContainerStyle={e.lista}
        renderItem={({ item }) => (
          <View style={e.card}>
            <View style={e.linhaTitulo}>
              <Text style={e.nome}>{item.name}</Text>

      
              {item.distanceKm !== null ? (
                <Text style={e.distancia}>{item.distanceKm} km</Text>
              ) : null}
            </View>

            {enderecoResumido(item) ? (
              <Text style={e.endereco}>{enderecoResumido(item)}</Text>
            ) : null}

            {item.hours ? <Text style={e.horario}>{item.hours}</Text> : null}
          </View>
        )}
      />
    </View>
  );
}

const e = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  mapa: { height: 260, width: '100%' },
  aviso: { backgroundColor: cores.primariaClara, padding: 10 },
  avisoTexto: { fontSize: 12, color: cores.primariaEscura, textAlign: 'center' },
  lista: { padding: 16, gap: 10 },
  card: {
    backgroundColor: cores.superficie,
    borderRadius: 12,
    padding: 14,
    gap: 4,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  linhaTitulo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  nome: { fontSize: 15, fontWeight: '600', color: cores.textoForte, flexShrink: 1 },
  distancia: {
    fontSize: 12, fontWeight: '600', color: cores.primariaEscura,
    backgroundColor: cores.primariaClara, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999,
    overflow: 'hidden',
  },
  endereco: { fontSize: 13, color: cores.texto },
  horario: { fontSize: 12, color: cores.textoFraco },
});
