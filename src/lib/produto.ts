
import { ProdutoDetalhe, ProdutoResumo } from '../types/produto';

export function resumoDeDetalhe(detalhe: ProdutoDetalhe): ProdutoResumo {
  const precos = detalhe.variants.map((v) => v.price);


  const principal = detalhe.images.find((i) => i.isPrimary) ?? detalhe.images[0];

  return {
    id: detalhe.id,
    name: detalhe.name,
    slug: detalhe.slug,
    type: detalhe.type,
    state: detalhe.state,
    brand: detalhe.brand?.name ?? null,
    categoryId: detalhe.category?.id ?? null,

    rating: { average: detalhe.rating.average, count: detalhe.rating.count },

    priceFrom: precos.length ? Math.min(...precos) : 0,
    priceTo: precos.length ? Math.max(...precos) : 0,

    stock: detalhe.variants.reduce((soma, v) => soma + v.stock, 0),
    image: principal?.url ?? null,
    variantsCount: detalhe.variants.length,
  };
}
