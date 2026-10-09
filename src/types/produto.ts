export type ProdutoResumo = {
  id: string;
  name: string;
  slug: string;
  type: 'SIMPLE' | 'VARIABLE';
  state: 'DRAFT' | 'PUBLISHED' | 'HIDDEN';
  brand: string | null;
  categoryId: string | null;


  priceFrom: number;
  priceTo: number;

  stock: number;


  image: string | null;

  variantsCount: number;


  rating: { average: number; count: number };
};


export type RespostaListaProdutos = {
  data: ProdutoResumo[];
  page: number;
  pageSize: number;
  total: number;
};

export type Imagem = {
  id: string;
  url: string;
  position: number;
  isPrimary: boolean;
};

export type Variante = {
  id: string;
  sku: string | null;
  price: number;
  stock: number;
  isDefault: boolean;
  active: boolean;
  /** Rotulo humano da combinacao de opcoes: "Preto / P". Null em SIMPLE. */
  label: string | null;
};

/** Resposta de GET /products/:id. */
export type ProdutoDetalhe = {
  id: string;
  name: string;
  slug: string;
  type: 'SIMPLE' | 'VARIABLE';
  state: 'DRAFT' | 'PUBLISHED' | 'HIDDEN';
  description: string | null;
  category: { id: string; name: string } | null;
  brand: { id: string; name: string } | null;
  tags: string[];
  variants: Variante[];
  images: Imagem[];

  /** No detalhe vem tambem a distribuicao por estrela (as barrinhas). */
  rating: {
    average: number;
    count: number;
    distribution: Record<'1' | '2' | '3' | '4' | '5', number>;
  };
};
