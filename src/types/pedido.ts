export type ItemCarrinho = {
  variantId: string;
  name: string;
  sku: string | null;
  unitPrice: number;
  quantity: number;
  subtotal: number;
};

export type Carrinho = {
  id: string;
  items: ItemCarrinho[];
  total: number;
  itemCount: number;
};

export type ItemPedido = {
  variantId: string;
  productName: string;
  variantName: string | null;
  sku: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
};

export type StatusPedido =
  | 'PENDING'
  | 'PAID'
  | 'CANCELLED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'FULFILLED'
  | 'REFUNDED';

export type Pedido = {
  id: string;
  status: StatusPedido;
  total: number;
  items: ItemPedido[];
  payment: { status: string; method: string; amount: number } | null;


  pickup: {
    id: string;
    name: string;
    hours: string | null;
    coordinate: { latitude: number; longitude: number };
    address: {
      cep: string | null; street: string | null; number: string | null;
      district: string | null; city: string | null; state: string | null;
    };
  } | null;

  createdAt: string;
};

export type MetodoPagamento = 'PIX' | 'CREDIT_CARD' | 'BOLETO';
