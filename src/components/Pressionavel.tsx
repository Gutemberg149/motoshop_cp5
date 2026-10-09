import { ReactNode } from 'react';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { ESCALA_PRESSIONADO, MOLA_TOQUE } from '../lib/animacoes';

const AreaAnimada = Animated.createAnimatedComponent(Pressable);

type Props = PressableProps & {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;

  semAnimacao?: boolean;
};

export function Pressionavel({ children, style, semAnimacao, ...resto }: Props) {

  const escala = useSharedValue(1);


  const estiloAnimado = useAnimatedStyle(() => ({
    transform: [{ scale: escala.value }],
  }));

  return (
    <AreaAnimada
      {...resto}
      style={[style, estiloAnimado]}
      onPressIn={(evento) => {
        if (!semAnimacao) escala.value = withSpring(ESCALA_PRESSIONADO, MOLA_TOQUE);
        resto.onPressIn?.(evento);
      }}
      onPressOut={(evento) => {
        if (!semAnimacao) escala.value = withSpring(1, MOLA_TOQUE);
        resto.onPressOut?.(evento);
      }}
    >
      {children}
    </AreaAnimada>
  );
}
