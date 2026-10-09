/** Configuracao do TanStack Query. */
import { QueryClient } from '@tanstack/react-query';

import { AppError } from '../errors/AppError';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {

      staleTime: 1000 * 60,


      retry: (tentativas, erro) => {
        if (erro instanceof AppError && erro.tipo === 'NAO_ENCONTRADO') return false;
        if (erro instanceof AppError && erro.tipo === 'NAO_AUTORIZADO') return false;
        return tentativas < 2;
      },
    },
  },
});
