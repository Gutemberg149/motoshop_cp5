
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { cores } from '../lib/tema';

const ESTRELA_CHEIA = '★'; // ★
const ESTRELA_VAZIA = '☆'; // ☆


export function Estrelas({ nota, tamanho = 16 }: { nota: number; tamanho?: number }) {
  return (
    <View
      style={e.linha}

      accessibilityRole="image"
      accessibilityLabel={`${nota} de 5 estrelas`}
    >
      {[1, 2, 3, 4, 5].map((posicao) => (
        <Text
          key={posicao}
          style={[
            { fontSize: tamanho },
            posicao <= Math.round(nota) ? e.cheia : e.vazia,
          ]}
        >
          {posicao <= Math.round(nota) ? ESTRELA_CHEIA : ESTRELA_VAZIA}
        </Text>
      ))}
    </View>
  );
}


export function SeletorEstrelas({
  nota,
  aoEscolher,
}: {
  nota: number;
  aoEscolher: (nota: number) => void;
}) {
  return (
    <View style={e.linha}>
      {[1, 2, 3, 4, 5].map((posicao) => (
        <Pressable
          key={posicao}
          onPress={() => aoEscolher(posicao)}
 
          hitSlop={10}
          accessibilityRole="radio"
          accessibilityState={{ selected: posicao === nota }}
          accessibilityLabel={`${posicao} ${posicao === 1 ? 'estrela' : 'estrelas'}`}
        >
          <Text style={[e.selecionavel, posicao <= nota ? e.cheia : e.vazia]}>
            {posicao <= nota ? ESTRELA_CHEIA : ESTRELA_VAZIA}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const e = StyleSheet.create({
  linha: { flexDirection: 'row', gap: 2 },
  selecionavel: { fontSize: 34 },
  cheia: { color: cores.destaque },
  vazia: { color: cores.neutro },
});
