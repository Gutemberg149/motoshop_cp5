import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';

import { useAuth } from '../contexts/AuthContext';
import { ehAppError } from '../errors/AppError';
import { AuthStackParamList } from '../navigation/tipos';

type Props = NativeStackScreenProps<AuthStackParamList, 'Cadastro'>;

const MIN_SENHA = 6;

export function CadastroScreen({ navigation }: Props) {
  const { cadastrar } = useAuth();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const preenchido =
    nome.trim().length > 0 && email.trim().length > 0 && senha.length > 0 && confirmacao.length > 0;
  const podeEnviar = preenchido && !enviando;

  function problemaLocal(): string | null {
    if (senha.length < MIN_SENHA) {
      return `A senha precisa ter pelo menos ${MIN_SENHA} caracteres.`;
    }
    if (senha !== confirmacao) {
      return 'As senhas nao sao iguais.';
    }
    return null;
  }

  async function aoCadastrar() {
    const problema = problemaLocal();
    if (problema) {
      setErro(problema);
      return;
    }

    try {
      setErro(null);
      setEnviando(true);
      await cadastrar({
        name: nome.trim(),
        email: email.trim(),
        password: senha,
      });
    } catch (e) {
      setErro(ehAppError(e) ? e.mensagem : 'Nao foi possivel criar a conta.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <SafeAreaView style={e.safe}>
      <KeyboardAvoidingView
        style={e.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={e.container} keyboardShouldPersistTaps="handled">
          <View style={e.iconeContainer}>
            <FontAwesome5 name="motorcycle" size={32} color="#0EA5E9" />
          </View>
          <Text style={e.titulo}>MotoShop</Text>
          <Text style={e.subtitulo}>Acesse sua conta para continuar</Text>

          <TextInput
            style={e.campo}
            value={nome}
            onChangeText={setNome}
            placeholder="Seu nome"
            placeholderTextColor="#64748B"
            autoCapitalize="words"
            autoComplete="name"
            returnKeyType="next"
          />

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
            returnKeyType="next"
          />

          <TextInput
            style={e.campo}
            value={senha}
            onChangeText={setSenha}
            placeholder="Senha"
            placeholderTextColor="#64748B"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="new-password"
            returnKeyType="next"
          />

          <TextInput
            style={e.campo}
            value={confirmacao}
            onChangeText={setConfirmacao}
            placeholder="Repita a senha"
            placeholderTextColor="#64748B"
            secureTextEntry
            autoCapitalize="none"
            onSubmitEditing={() => podeEnviar && aoCadastrar()}
            returnKeyType="go"
          />

          <Pressable
            style={[e.botao, !podeEnviar && e.botaoOff]}
            onPress={aoCadastrar}
            disabled={!podeEnviar}
          >
            <Text style={e.textoBotao}>{enviando ? 'Criando conta...' : 'Criar Conta'}</Text>
          </Pressable>

          <Pressable
            style={e.botaoSecundario}
            onPress={() => navigation.goBack()}
          >
            <Text style={e.textoBotaoSecundario}>Entrar</Text>
          </Pressable>

          {erro && <Text style={e.erro}>{erro}</Text>}

          <View style={e.configContainer}>
            <Pressable style={e.configBotao} onPress={() => {}}>
              <Ionicons name="settings" size={24} color="#FFFFFF" />
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const e = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0B132B' },
  flex: { flex: 1 },
  container: { flexGrow: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
  iconeContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1C2541',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  titulo: { fontSize: 32, fontWeight: '800', color: '#0EA5E9', textAlign: 'center', marginBottom: 6 },
  subtitulo: { fontSize: 15, color: '#94A3B8', textAlign: 'center', marginBottom: 32 },
  campo: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#1E293B',
    backgroundColor: '#111827',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  botao: {
    width: '100%',
    backgroundColor: '#E53E3E',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  botaoOff: { backgroundColor: '#9B2C2C' },
  textoBotao: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  botaoSecundario: {
    width: '100%',
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1E293B',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  textoBotaoSecundario: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  erro: { color: '#EF4444', fontSize: 14, textAlign: 'center', marginTop: 8 },
  configContainer: {
    width: '100%',
    alignItems: 'flex-start',
    marginTop: 24,
  },
  configBotao: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0284C7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});