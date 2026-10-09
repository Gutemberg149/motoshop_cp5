export type Coordenada = {
  latitude: number;
  longitude: number;
};

export type PontoRetirada = {
  id: string;
  name: string;
  address: {
    cep: string | null;
    street: string | null;
    number: string | null;
    complement: string | null;
    district: string | null;
    city: string | null;
    state: string | null;
  };
  coordinate: Coordenada;

  hours: string | null;
  active: boolean;


  distanceKm: number | null;
};

export type RespostaPontos = {
  data: PontoRetirada[];

  origin: Coordenada | null;
};


export type Rastreio = {
  origin: Coordenada | null;
  destination: Coordenada | null;

  current: Coordenada | null;

  path: Coordenada[];
};
