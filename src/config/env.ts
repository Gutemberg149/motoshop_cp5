const URL_BASE = process.env.EXPO_PUBLIC_API_URL ?? "https://api.mockmerce.com.br/v1";
const API_KEY = process.env.EXPO_PUBLIC_API_KEY ?? "";
const RM = process.env.EXPO_PUBLIC_STUDENT_RM ?? "rm562267";

if (__DEV__ && !API_KEY) {
  console.warn(
    "[config] EXPO_PUBLIC_API_KEY esta vazia.\n" +
      "Copie .env.example para .env, cole a API key do seu grupo e reinicie o\n" +
      "servidor do Expo com `npx expo start --clear`. Sem a chave, TODA\n" +
      "requisicao volta 401 — inclusive o login."
  );
}

export const config = {
  urlBase: URL_BASE,

  apiKey: API_KEY,

  rm: RM,
} as const;
