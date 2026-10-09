export type ResumoNotas = {
  average: number;
  count: number;

  distribution: Record<'1' | '2' | '3' | '4' | '5', number>;
};

export type FotoAvaliacao = {
  id: string;
  url: string;
  mediaId: string | null;
};

export type Avaliacao = {
  id: string;
  rating: number;
  title: string | null;
  comment: string;
  images: FotoAvaliacao[];


  author: { name: string; id: string | null };

 
  verifiedPurchase: boolean;


  hidden: boolean;


  isMine: boolean;

  createdAt: string;
  updatedAt: string;
};


export type RespostaAvaliacoes = {
  data: Avaliacao[];
  page: number;
  pageSize: number;
  total: number;
  summary: ResumoNotas;
};


export type PodeAvaliar = {
  canReview: boolean;
  reason: 'ALREADY_REVIEWED' | 'NOT_PURCHASED' | null;
  message: string;

  reviewId: string | null;
};


export type NovaAvaliacao = {
  rating: number;
  title?: string | null;
  comment?: string;

  mediaIds?: string[];
};


export type MidiaEnviada = {
  id: string;
  kind: 'IMAGE' | 'VIDEO';
  url: string;
  mimeType: string;
  sizeBytes: number;
};
