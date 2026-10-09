import * as SecureStore from 'expo-secure-store';


export async function guardarSeguro(chave: string, valor: string): Promise<void> {
  await SecureStore.setItemAsync(chave, valor);
}


export async function lerSeguro(chave: string): Promise<string | null> {
  return SecureStore.getItemAsync(chave);
}


export async function apagarSeguro(chave: string): Promise<void> {
  await SecureStore.deleteItemAsync(chave);
}


