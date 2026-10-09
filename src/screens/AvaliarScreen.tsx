import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { SeletorEstrelas } from '../components/Estrelas';
import { ehAppError } from '../errors/AppError';
import { useCriarAvaliacao } from '../hooks/useAvaliacoes';
import { AppStackParamList } from '../navigation/tipos';
import { arquivoDaUri, enviarImagem } from '../services/uploadService';

type Props = NativeStackScreenProps<AppStackParamList, 'Avaliar'>;

const MAX_FOTOS = 5;

type FotoPronta = { mediaId: string; url: string };

export function AvaliarScreen({ route, navigation }: Props) {
  const { produtoId, produtoNome } = route.params;

  const [nota, setNota] = useState(0);
  const [titulo, setTitulo] = useState('');
  const [comentario, setComentario] = useState('');
  const [fotos, setFotos] = useState<FotoPronta[]>([]);
  const [enviandoFoto, setEnviandoFoto] = useState(false);

  const criar = useCriarAvaliacao(produtoId);

  async function adicionarFoto() {
    if (fotos.length >= MAX_FOTOS) {
      Alert.alert('Limite de fotos', `Voce pode enviar ate ${MAX_FOTOS} fotos.`);
      return;
    }

    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert(
        'Sem acesso as fotos',
        'Libere o acesso a galeria nos ajustes do aparelho para anexar imagens.',
      );
      return;
    }

    const escolha = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.6,
    });

    const imagem = escolha.canceled ? null : escolha.assets[0];
    if (!imagem) return;

    setEnviandoFoto(true);
    try {
      const midia = await enviarImagem(arquivoDaUri(imagem.uri));
      setFotos((atuais) => [...atuais, { mediaId: midia.id, url: midia.url }]);
    } catch (erro) {
      Alert.alert(
        'Nao foi possivel enviar a foto',
        ehAppError(erro) ? erro.mensagem : 'Tente novamente.',
      );
    } finally {
      setEnviandoFoto(false);
    }
  }

  function removerFoto(mediaId: string) {
    setFotos((atuais) => atuais.filter((f) => f.mediaId !== mediaId));
  }

  function enviar() {
    if (nota === 0) {
      Alert.alert('Escolha a nota', 'Toque nas estrelas para dar sua nota.');
      return;
    }

    criar.mutate(
      {
        rating: nota,
        title: titulo.trim() || null,
        comment: comentario.trim(),
        mediaIds: fotos.map((f) => f.mediaId),
      },
      {
        onSuccess: () => navigation.goBack(),
        onError: (erro) => {
          Alert.alert(
            'Nao foi possivel avaliar',
            ehAppError(erro) ? erro.mensagem : 'Tente novamente.',
          );
        },
      },
    );
  }

  return (
    <ScrollView style={e.container} contentContainerStyle={e.conteudo}>
      <Text style={e.produto}>{produtoNome}</Text>

      <Text style={e.rotulo}>Sua nota</Text>
      <SeletorEstrelas nota={nota} aoEscolher={setNota} />

      <Text style={e.rotulo}>Titulo (opcional)</Text>
      <TextInput
        style={e.campo}
        value={titulo}
        onChangeText={setTitulo}
        placeholder="Resuma em poucas palavras"
        placeholderTextColor="#64748B"
        maxLength={120}
      />

      <Text style={e.rotulo}>Comentario</Text>
      <TextInput
        style={[e.campo, e.campoGrande]}
        value={comentario}
        onChangeText={setComentario}
        placeholder="O que voce achou do produto?"
        placeholderTextColor="#64748B"
        multiline
        maxLength={2000}
      />

      <Text style={e.rotulo}>
        Fotos ({fotos.length}/{MAX_FOTOS})
      </Text>
      <View style={e.fotos}>
        {fotos.map((foto) => (
          <Pressable key={foto.mediaId} onPress={() => removerFoto(foto.mediaId)}>
            <Image source={{ uri: foto.url }} style={e.foto} />
            <View style={e.remover}>
              <Text style={e.removerTexto}>x</Text>
            </View>
          </Pressable>
        ))}

        {fotos.length < MAX_FOTOS ? (
          <Pressable style={e.adicionar} onPress={adicionarFoto} disabled={enviandoFoto}>
            {enviandoFoto ? (
              <ActivityIndicator color="#0EA5E9" />
            ) : (
              <Text style={e.adicionarTexto}>+</Text>
            )}
          </Pressable>
        ) : null}
      </View>

      <Pressable
        style={[e.botao, (criar.isPending || nota === 0) && e.botaoDesativado]}
        onPress={enviar}
        disabled={criar.isPending || nota === 0}
      >
        {criar.isPending ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={e.botaoTexto}>Enviar avaliacao</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const e = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B132B' },
  conteudo: { padding: 16, gap: 8, paddingBottom: 40 },
  produto: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  rotulo: { fontSize: 13, fontWeight: '600', color: '#CBD5E1', marginTop: 12 },
  campo: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: '#FFFFFF',
  },
  campoGrande: { height: 110, textAlignVertical: 'top' },
  fotos: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  foto: { width: 72, height: 72, borderRadius: 8, backgroundColor: '#1C2541' },
  remover: {
    position: 'absolute', top: -4, right: -4,
    backgroundColor: '#EF4444', width: 20, height: 20, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  removerTexto: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  adicionar: {
    width: 72, height: 72, borderRadius: 8,
    borderWidth: 1, borderColor: '#1E293B', borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#111827',
  },
  adicionarTexto: { fontSize: 28, color: '#0EA5E9' },
  botao: {
    backgroundColor: '#0EA5E9', borderRadius: 10, padding: 16,
    alignItems: 'center', marginTop: 24,
  },
  botaoDesativado: { backgroundColor: '#1E293B' },
  botaoTexto: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});