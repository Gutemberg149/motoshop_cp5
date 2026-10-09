import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

import { config } from "../config/env";
import { useAuth } from "../contexts/AuthContext";
import { ehAppError } from "../errors/AppError";
import { cores } from "../lib/tema";
import { AuthStackParamList } from "../navigation/tipos";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export function LoginScreen({ navigation }: Props) {
  const { entrar } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const podeEnviar = email.trim().length > 0 && password.length > 0 && !enviando;

  async function aoEntrar() {
    try {
      setErro(null);
      setEnviando(true);
      await entrar({ email: email.trim(), password });
    } catch (e) {
      setErro(ehAppError(e) ? e.mensagem : "Nao foi possivel entrar.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <SafeAreaView style={e.safe}>
      <KeyboardAvoidingView style={e.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={e.container} keyboardShouldPersistTaps="handled">
          <View style={e.iconeContainer}>
            <FontAwesome5 name="motorcycle" size={32} color="#0EA5E9" />
          </View>
          <Text style={e.titulo}>MotoShop</Text>
          <Text style={e.subtitulo}>Acesse sua conta para continuar</Text>

          <TextInput
            style={e.campo}
            value={email}
            onChangeText={setEmail}
            placeholder="E-mail"
            placeholderTextColor="#64748B"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
          />

          <TextInput
            style={e.campo}
            value={password}
            onChangeText={setPassword}
            placeholder="Senha"
            placeholderTextColor="#64748B"
            secureTextEntry
            autoCapitalize="none"
            onSubmitEditing={() => podeEnviar && aoEntrar()}
            returnKeyType="go"
          />

          <Pressable style={[e.botao, !podeEnviar && e.botaoOff]} onPress={aoEntrar} disabled={!podeEnviar}>
            <Text style={e.textoBotao}>{enviando ? "Entrando..." : "Entrar"}</Text>
          </Pressable>

          <Pressable style={e.botaoSecundario} onPress={() => navigation.navigate("Cadastro")}>
            <Text style={e.textoBotaoSecundario}>Criar Conta</Text>
          </Pressable>

          {erro && <Text style={e.erro}>{erro}</Text>}

          <View style={e.configContainer}>
            <Pressable style={e.configBotao} onPress={() => {}}>
              <Ionicons name="settings" size={24} color="#FFFFFF" />
            </Pressable>
          </View>

          {!config.apiKey && (
            <View style={e.aviso}>
              <Text style={e.avisoTexto}>
                A API key do grupo nao esta configurada. Copie o arquivo <Text style={e.mono}>.env.example</Text> para <Text style={e.mono}>.env</Text>, cole a
                chave e rode <Text style={e.mono}>npx expo start --clear</Text>.
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const e = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0B132B" },
  flex: { flex: 1 },
  container: { flexGrow: 1, padding: 24, justifyContent: "center", alignItems: "center" },
  iconeContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1C2541",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2D3748",
  },
  titulo: { fontSize: 32, fontWeight: "800", color: "#0EA5E9", textAlign: "center", marginBottom: 6 },
  subtitulo: {
    fontSize: 15,
    color: "#94A3B8",
    textAlign: "center",
    marginBottom: 32,
  },
  campo: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#1E293B",
    backgroundColor: "#111827",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#FFFFFF",
    marginBottom: 16,
  },
  botao: {
    width: "100%",
    backgroundColor: "#E53E3E",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  botaoOff: { backgroundColor: "#9B2C2C" },
  textoBotao: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  botaoSecundario: {
    width: "100%",
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1E293B",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  textoBotaoSecundario: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  erro: { color: "#EF4444", fontSize: 14, textAlign: "center", marginTop: 8 },
  configContainer: {
    width: "100%",
    alignItems: "flex-start",
    marginTop: 24,
  },
  configBotao: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#0284C7",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  aviso: {
    marginTop: 24,
    padding: 12,
    borderRadius: 8,
    backgroundColor: cores.primariaClara,
  },
  avisoTexto: { fontSize: 13, color: cores.primariaEscura, lineHeight: 19 },
  mono: { fontWeight: "700" },
});
