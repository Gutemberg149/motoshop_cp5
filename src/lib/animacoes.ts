import { Easing, type WithSpringConfig, type WithTimingConfig } from 'react-native-reanimated';

export const DURACAO = {

  rapida: 140,

  media: 250,

  lenta: 400,
};


export const ENTRADA: WithTimingConfig = {
  duration: DURACAO.media,
  easing: Easing.out(Easing.cubic),
};

export const SAIDA: WithTimingConfig = {
  duration: DURACAO.rapida,
  easing: Easing.in(Easing.cubic),
};

export const MOLA_TOQUE: WithSpringConfig = {
  damping: 12,
  stiffness: 220,
  mass: 0.5,
};


export const MOLA_SUAVE: WithSpringConfig = {
  damping: 18,
  stiffness: 140,
  mass: 0.8,
};


export const ESCALA_PRESSIONADO = 0.96;
