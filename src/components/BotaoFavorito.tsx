import { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { DURACAO, MOLA_TOQUE } from '../lib/animacoes';

type Props = {
  ativo: boolean;
  aoPressionar: () => void;
  tamanho?: number;
};

export function BotaoFavorito({ ativo, aoPressionar, tamanho = 24 }: Props) {
  const escala = useSharedValue(1);

  useEffect(() => {
    if (!ativo) return;

    escala.value = withSequence(
      withTiming(1.35, { duration: DURACAO.rapida }),
      withSpring(1, MOLA_TOQUE),
    );
  }, [ativo, escala]);

  const estiloAnimado = useAnimatedStyle(() => ({
    transform: [{ scale: escala.value }],
  }));

  return (
    <Pressable
      onPress={aoPressionar}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel={ativo ? 'Remover dos salvos' : 'Salvar produto'}
      style={e.area}
    >
      <Animated.Text style={[e.estrela, { fontSize: tamanho }, ativo && e.ativa, estiloAnimado]}>
        {ativo ? '★' : '☆'}
      </Animated.Text>
    </Pressable>
  );
}

const e = StyleSheet.create({
  area: { padding: 4 },
  estrela: { color: '#64748B' },
  ativa: { color: '#EAB308' },
});