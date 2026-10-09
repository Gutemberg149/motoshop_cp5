import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Avatar } from '../components/Avatar';
import { CartaoNotificacoes } from '../components/CartaoNotificacoes';
import { useAuth } from '../contexts/AuthContext';
import { useFavoritos } from '../contexts/FavoritosContext';
import { AppStackParamList } from '../navigation/tipos';

export function PerfilScreen() {
  const { usuario, sair } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const { favoritos } = useFavoritos();

  if (!usuario) return null;

  const quantidade = favoritos.length;

  return (
    <View style={e.container}>
      <Avatar nome={usuario.name} imagem={usuario.image} tamanho={96} />

      <Text style={e.nome}>{usuario.name}</Text>
      <Text style={e.email}>{usuario.email}</Text>

      <Text style={e.contagem}>
        {quantidade === 1 ? '1 item salvo' : `${quantidade} itens salvos`}
      </Text>

      <View style={e.atalhos}>
        <Pressable style={e.atalho} onPress={() => navigation.navigate('Carrinho')}>
          <Text style={e.atalhoTexto}>Carrinho</Text>
        </Pressable>
        <Pressable style={e.atalho} onPress={() => navigation.navigate('PontosRetirada')}>
          <Text style={e.atalhoTexto}>Onde retirar</Text>
        </Pressable>
      </View>

      <CartaoNotificacoes />

      <Pressable style={e.botao} onPress={sair} accessibilityRole="button">
        <Text style={e.textoBotao}>Sair</Text>
      </Pressable>
    </View>
  );
}

const e = StyleSheet.create({
  atalhos: { flexDirection: 'row', gap: 8, marginTop: 16 },
  atalho: {
    borderWidth: 1.5, borderColor: '#0EA5E9', borderRadius: 8,
    paddingVertical: 10, paddingHorizontal: 16,
  },
  atalhoTexto: { color: '#0EA5E9', fontWeight: '600', fontSize: 14 },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 32,
    gap: 8,
    backgroundColor: '#111827',
  },
  nome: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', marginTop: 12 },
  email: { fontSize: 14, color: '#94A3B8' },
  contagem: { fontSize: 14, color: '#0EA5E9', fontWeight: '600', marginTop: 8 },
  botao: {
    marginTop: 32,
    borderWidth: 1.5,
    borderColor: '#EF4444',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  textoBotao: { color: '#EF4444', fontWeight: '700', fontSize: 15 },
});