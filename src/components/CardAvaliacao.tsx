import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Avaliacao } from '../types/avaliacao';
import { Estrelas } from './Estrelas';

function formatarData(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR');
}

export function CardAvaliacao({ avaliacao }: { avaliacao: Avaliacao }) {
  return (
    <View style={e.card}>
      <View style={e.cabecalho}>
        <Estrelas nota={avaliacao.rating} tamanho={14} />
        {avaliacao.title ? <Text style={e.titulo}>{avaliacao.title}</Text> : null}
      </View>

      <View style={e.selos}>
        <Text style={e.autor}>{avaliacao.author.name}</Text>
        <Text style={e.data}>{formatarData(avaliacao.createdAt)}</Text>

        {avaliacao.verifiedPurchase ? (
          <Text style={e.verificada}>Compra verificada</Text>
        ) : null}

        {avaliacao.isMine ? <Text style={e.minha}>Sua avaliacao</Text> : null}
      </View>

      {avaliacao.comment ? <Text style={e.comentario}>{avaliacao.comment}</Text> : null}

      {avaliacao.images.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={e.fotos}>
          {avaliacao.images.map((foto) => (
            <Image key={foto.id} source={{ uri: foto.url }} style={e.foto} />
          ))}
        </ScrollView>
      ) : null}

      {avaliacao.hidden ? (
        <Text style={e.oculta}>Esta avaliacao foi ocultada pela loja.</Text>
      ) : null}
    </View>
  );
}

const e = StyleSheet.create({
  card: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  cabecalho: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  titulo: { fontSize: 15, fontWeight: '600', color: '#FFFFFF', flexShrink: 1 },
  selos: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  autor: { fontSize: 12, color: '#CBD5E1', fontWeight: '500' },
  data: { fontSize: 12, color: '#94A3B8' },
  verificada: { fontSize: 11, color: '#34D399', backgroundColor: '#064E3B', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, overflow: 'hidden' },
  minha: { fontSize: 11, color: '#38BDF8', backgroundColor: '#0369A1', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, overflow: 'hidden' },
  comentario: { fontSize: 14, color: '#CBD5E1', lineHeight: 20 },
  fotos: { marginTop: 2 },
  foto: { width: 72, height: 72, borderRadius: 8, marginRight: 8, backgroundColor: '#1C2541' },
  oculta: { fontSize: 12, color: '#EF4444' },
});