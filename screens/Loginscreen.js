import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import supabase from '../BD/supabaseClient';

const LoginScreen = ({ navigation }) => {
  const [input, setInput] = useState(''); // Pode ser e-mail ou nome de usuário
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!input || !password) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios.');
      return;
    }

    try {
      let data, error;

      // Verifica se o input é um e-mail (baseado na presença de "@")
      if (input.includes('@')) {
        // Login com e-mail
        ({ data, error } = await supabase.auth.signInWithPassword({
          email: input,
          password,
        }));
      } else {
        // Login com nome de usuário
        const { data: userData, error: userError } = await supabase
          .from('users') // Substitua "users" pelo nome correto da tabela
          .select('email')
          .eq('username', input)
          .single();

        if (userError || !userData) {
          Alert.alert('Erro', 'Nome de usuário não encontrado.');
          return;
        }

        // Realiza login com o e-mail associado ao nome de usuário
        ({ data, error } = await supabase.auth.signInWithPassword({
          email: userData.email,
          password,
        }));
      }

      if (error) {
        Alert.alert('Erro', error.message);
        return;
      }

      Alert.alert('Sucesso', 'Login realizado com sucesso!');
      navigation.navigate('Feed');
    } catch (err) {
      Alert.alert('Erro', 'Algo deu errado. Tente novamente.');
      console.error('Erro no login:', err);
    }
  };

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
      </View>
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
