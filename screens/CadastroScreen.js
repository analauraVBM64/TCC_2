import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { supabase } from '../BD/supabaseClient';

const CadastroScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!name.trim() || !username.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios.');
      return;
    }

    try {
      console.log('Validando se o usuário já existe no banco...');

      // Verificar se o e-mail já está registrado
      const { data: emailExists } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (emailExists) {
        Alert.alert('Erro', 'E-mail já cadastrado. Use outro e-mail.');
        return;
      }

      // Verificar se o nome de usuário já está registrado
      const { data: usernameExists } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (usernameExists) {
        Alert.alert('Erro', 'Nome de usuário já cadastrado. Escolha outro.');
        return;
      }

      console.log('Iniciando cadastro do usuário...');

      // Criação do usuário no sistema de autenticação do Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        Alert.alert('Erro no cadastro', authError.message);
        return;
      }

      const userId = authData.user?.id;

      if (!userId) {
        Alert.alert('Erro', 'Falha ao obter o ID do usuário.');
        return;
      }

      // Inserindo dados adicionais na tabela "users"
      const { error: dbError } = await supabase.from('users').insert([
        { id: userId, name, username, email },
      ]);

      if (dbError) {
        Alert.alert('Erro ao salvar informações adicionais', dbError.message);
        return;
      }

      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
      navigation.navigate('Login');
    } catch (err) {
      Alert.alert('Erro', 'Erro inesperado. Tente novamente.');
      console.error('Erro no cadastro:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <Text style={styles.label}>Nome Completo</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu nome completo"
        value={name}
        onChangeText={setName}
      />
      <Text style={styles.label}>Nome de Usuário</Text>
      <TextInput
        style={styles.input}
        placeholder="Escolha um nome de usuário"
        value={username}
        onChangeText={setUsername}
      />
      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu e-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
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
        <Button title="Cadastrar" onPress={handleRegister} color="#2a9d8f" />
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

export default CadastroScreen;
