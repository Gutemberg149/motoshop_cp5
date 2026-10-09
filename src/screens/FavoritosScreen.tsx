import { FlatList, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { CardProduto } from '../components/CardProduto';
import { EstadoCarregando } from '../components/EstadoCarregando';
import { EstadoVazio } from '../components/EstadoVazio';
import { useFavoritos } from '../contexts/FavoritosContext';
import { cores } from '../lib/tema';
import { AppStackParamList } from '../navigation/tipos';

type Props = NativeStackScreenProps<AppStackParamList, 'Favoritos'>;

export function FavoritosScreen({ navigation }: Props) {
  const { favoritos, carregando, alternarFavorito, ehFavorito } = useFavoritos();

  if (carregando) return <EstadoCarregando mensagem="Abrindo sua lista..." />;

  if (favoritos.length === 0) {
    return <EstadoVazio mensagem="Voce ainda nao salvou nenhum produto." />;
  }

  return (
    <View style={e.container}>
      <FlatList
        data={favoritos}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <CardProduto
            indice={index}
            produto={item}
            ehFavorito={ehFavorito(item.id)}
            aoFavoritar={alternarFavorito}
            aoPressionar={(id) =>
              navigation.navigate('DetalheProduto', { id, nome: item.name })
            }
          />
        )}
        contentContainerStyle={e.lista}
      />
    </View>
  );
}

const e = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  lista: { padding: 16 },
});
