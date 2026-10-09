
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

import { cores } from '../lib/tema';

export function EstadoCarregando({ mensagem = 'Carregando...' }: { mensagem?: string }) {
  const opacidade = useSharedValue(1);

  useEffect(() => {

    opacidade.value = withRepeat(
      withSequence(
        withTiming(0.35, { duration: 700 }),
        withTiming(1, { duration: 700 }),
      ),
      -1,
    );
  }, [opacidade]);

  const estiloAnimado = useAnimatedStyle(() => ({ opacity: opacidade.value }));

  return (
    <View style={e.container}>
      <ActivityIndicator size="large" color={cores.primaria} />
      <Animated.Text style={[e.texto, estiloAnimado]}>{mensagem}</Animated.Text>
    </View>
  );
}

const e = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  texto: { fontSize: 15, color: cores.textoFraco },
});
