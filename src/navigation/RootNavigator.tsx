import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Importe o ícone

import { EstadoCarregando } from "../components/EstadoCarregando";
import { useAuth } from "../contexts/AuthContext";
import { DetalheProdutoScreen } from "../screens/DetalheProdutoScreen";
import { FavoritosScreen } from "../screens/FavoritosScreen";
import { ListaProdutosScreen } from "../screens/ListaProdutosScreen";
import { CadastroScreen } from "../screens/CadastroScreen";
import { LoginScreen } from "../screens/LoginScreen";
import { PerfilScreen } from "../screens/PerfilScreen";
import { AvaliarScreen } from "../screens/AvaliarScreen";
import { CarrinhoScreen } from "../screens/CarrinhoScreen";
import { CheckoutScreen } from "../screens/CheckoutScreen";
import { PedidoScreen } from "../screens/PedidoScreen";
import { PontosRetiradaScreen } from "../screens/PontosRetiradaScreen";
import { consumirNavegacaoPendente, navegacaoRef } from "./navegacao";
import { AppStackParamList, AuthStackParamList } from "./tipos";

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

export function RootNavigator() {
  const { usuario, carregandoSessao } = useAuth();

  if (carregandoSessao) {
    return <EstadoCarregando mensagem="Abrindo..." />;
  }

  if (!usuario) {
    return (
      <NavigationContainer>
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
          <AuthStack.Screen name="Login" component={LoginScreen} />
          <AuthStack.Screen name="Cadastro" component={CadastroScreen} />
        </AuthStack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer ref={navegacaoRef} onReady={consumirNavegacaoPendente}>
      <AppStack.Navigator
        screenOptions={({ navigation }) => ({
          headerStyle: { backgroundColor: "#111827" },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: { fontWeight: "700" },
          // Centralizando o botão do menu usando Ionicons
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate("Perfil")}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Abrir perfil"
              style={e.menuButton} // Estilo para centralizar o conteúdo
            >
              <Ionicons name="menu" size={24} color="#FFFFFF" />
            </Pressable>
          ),
        })}
      >
        <AppStack.Screen name="ListaProdutos" component={ListaProdutosScreen} options={{ title: "MotoShop" }} />
        <AppStack.Screen name="DetalheProduto" component={DetalheProdutoScreen} options={({ route }) => ({ title: route.params.nome })} />
        <AppStack.Screen name="Favoritos" component={FavoritosScreen} options={{ title: "Meus salvos" }} />
        <AppStack.Screen name="Perfil" component={PerfilScreen} options={{ title: "Perfil" }} />

        <AppStack.Screen name="Carrinho" component={CarrinhoScreen} options={{ title: "Carrinho" }} />
        <AppStack.Screen name="Checkout" component={CheckoutScreen} options={{ title: "Finalizar" }} />
        <AppStack.Screen name="Pedido" component={PedidoScreen} options={{ title: "Pedido" }} />

        <AppStack.Screen name="Avaliar" component={AvaliarScreen} options={{ title: "Avaliar produto" }} />
        <AppStack.Screen name="PontosRetirada" component={PontosRetiradaScreen} options={{ title: "Onde retirar" }} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
}

// Criando um pequeno StyleSheet para organizar os estilos
const e = StyleSheet.create({
  menuButton: {
    width: 40, // Tamanho fixo para o alvo de toque
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8, // Espaçamento da borda direita da tela
  },
});
