import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { supabase } from '../BD/supabaseClient';

const LoginScreen = ({ navigation }) => {
  const [input, setInput] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!input.trim() || !password.trim()) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios.');
      return;
    }

    try {
      let authResponse;

      if (input.includes('@')) {
        // Login com e-mail
        authResponse = await supabase.auth.signInWithPassword({
          email: input.trim(),
          password: password.trim(),
        }); //email não está vereficando
      } else {
        // Login com nome de usuário
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('email')
          .eq('username', input.trim())
          .single();

        if (userError || !user) {
          Alert.alert('Erro', 'Nome de usuário não encontrado.');
          return;
        }// esse com usuario não esta funcionando

        authResponse = await supabase.auth.signInWithPassword({
          email: user.email,
          password: password.trim(),
        });
      }

      if (authResponse.error) {
        Alert.alert('Erro', authResponse.error.message || 'Erro desconhecido.');
        return;
      }

      Alert.alert('Sucesso', 'Login realizado com sucesso!');
      navigation.navigate('Feed');
    } catch (err) {
      console.error('Erro no login:', err);
      Alert.alert('Erro inesperado', 'Tente novamente mais tarde.');
    }
  };//mensagem de alerta não funciona

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.label}>E-mail ou Nome de Usuário</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu e-mail ou nome de usuário"
        value={input}
        onChangeText={setInput}
        autoCapitalize="none"
      />
      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button title="Entrar" onPress={handleLogin} color="#2a9d8f" />
      </View>//aqui deveria ir para a pagina do feed 

      <View style={styles.buttonContainer}>
        <Button
          title="Cadastrar-se"
          onPress={() => navigation.navigate('Cadastro')}
          color="#2a9d8f"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginBottom: 15,
    borderRadius: 5,
    overflow: 'hidden',
  },
});

export default LoginScreen;
