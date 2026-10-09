import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { CampoBusca } from "../components/CampoBusca";
import { CardProduto } from "../components/CardProduto";
import { EstadoCarregando } from "../components/EstadoCarregando";
import { EstadoErro } from "../components/EstadoErro";
import { EstadoVazio } from "../components/EstadoVazio";
import { useFavoritos } from "../contexts/FavoritosContext";
import { ehAppError } from "../errors/AppError";
import { useDebounce } from "../hooks/useDebounce";
import { useBuscaProdutos, useProdutos } from "../hooks/useProdutos";
import { AppStackParamList } from "../navigation/tipos";

type Props = NativeStackScreenProps<AppStackParamList, "ListaProdutos">;

export function ListaProdutosScreen({ navigation }: Props) {
  const [termo, setTermo] = useState("");

  const termoAtrasado = useDebounce(termo, 400);
  const buscando = termoAtrasado.trim().length >= 2;

  const listagem = useProdutos(20);
  const busca = useBuscaProdutos(termoAtrasado);
  const { alternarFavorito, ehFavorito } = useFavoritos();

  const consulta = buscando ? busca : listagem;
  const { data, isPending, isError, error, refetch, isFetching } = consulta;

  function conteudo() {
    if (isPending) {
      return <EstadoCarregando mensagem={buscando ? "Buscando..." : "Carregando produtos..."} />;
    }

    if (isError) {
      return <EstadoErro mensagem={ehAppError(error) ? error.mensagem : "Algo inesperado aconteceu."} aoTentarNovamente={() => refetch()} />;
    }

    if (data.length === 0) {
      return <EstadoVazio mensagem={buscando ? `Nenhum produto encontrado para "${termoAtrasado}".` : "Esta loja ainda nao tem produtos publicados."} />;
    }

    return (
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        refreshing={isFetching}
        onRefresh={refetch}
        renderItem={({ item, index }) => (
          <CardProduto
            indice={index}
            produto={item}
            ehFavorito={ehFavorito(item.id)}
            aoFavoritar={alternarFavorito}
            aoPressionar={(id) => navigation.navigate("DetalheProduto", { id, nome: item.name })}
          />
        )}
        contentContainerStyle={e.lista}
        keyboardShouldPersistTaps="handled"
      />
    );
  }

  return (
    <View style={e.container}>
      <CampoBusca valor={termo} aoMudar={setTermo} />

      {!buscando && (
        <Pressable style={e.atalho} onPress={() => navigation.navigate("Favoritos")}>
          <Text style={e.atalhoTexto}>{"★  Meus salvos"}</Text>
        </Pressable>
      )}

      {conteudo()}
    </View>
  );
}

const e = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B132B" },
  lista: { padding: 16, paddingTop: 12 },
  atalho: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    backgroundColor: "#111827",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  atalhoTexto: { color: "#0EA5E9", fontWeight: "700", fontSize: 15 },
});
