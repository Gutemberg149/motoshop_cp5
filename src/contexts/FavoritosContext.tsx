
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

import { guardarLocal, lerLocal } from '../storage/armazenamentoLocal';
import { CHAVES } from '../storage/chavesArmazenamento';
import { ProdutoResumo } from '../types/produto';
import { useAuth } from './AuthContext';

type FavoritosContextValor = {
  favoritos: ProdutoResumo[];
  carregando: boolean;
  alternarFavorito: (produto: ProdutoResumo) => Promise<void>;
  ehFavorito: (id: string) => boolean;
};

const FavoritosContext = createContext<FavoritosContextValor | null>(null);

export function FavoritosProvider({ children }: { children: ReactNode }) {
  const { usuario } = useAuth();
  const [favoritos, setFavoritos] = useState<ProdutoResumo[]>([]);
  const [carregando, setCarregando] = useState(true);


  const chave = usuario ? CHAVES.favoritos(usuario.id) : null;


  useEffect(() => {
    let cancelado = false;

    async function carregar() {

      if (!chave) {
        setFavoritos([]);
        setCarregando(false);
        return;
      }

      setCarregando(true);
      const guardados = await lerLocal<ProdutoResumo[]>(chave);

      if (cancelado) return;

      setFavoritos(guardados ?? []);
      setCarregando(false);
    }

    carregar();
    return () => {
      cancelado = true;
    };
  }, [chave]);

  const alternarFavorito = useCallback(
    async (produto: ProdutoResumo) => {
      if (!chave) return;

      const jaEsta = favoritos.some((f) => f.id === produto.id);
      const novaLista = jaEsta
        ? favoritos.filter((f) => f.id !== produto.id)
        : [...favoritos, produto];

      setFavoritos(novaLista);
      await guardarLocal(chave, novaLista);
    },
    [favoritos, chave],
  );

  const ehFavorito = useCallback(
    (id: string) => favoritos.some((f) => f.id === id),
    [favoritos],
  );

  return (
    <FavoritosContext.Provider
      value={{ favoritos, carregando, alternarFavorito, ehFavorito }}
    >
      {children}
    </FavoritosContext.Provider>
  );
}

export function useFavoritos(): FavoritosContextValor {
  const contexto = useContext(FavoritosContext);
  if (!contexto) {
    throw new Error('useFavoritos precisa estar dentro de um FavoritosProvider');
  }
  return contexto;
}

