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
      const { data: emailExists, error: emailError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (emailError) {
        Alert.alert('Erro', 'Erro ao verificar e-mail.');
        console.error(emailError);
        return;
      }

      if (emailExists) {
        Alert.alert('Erro', 'E-mail já cadastrado. Use outro e-mail.');
        return;
      }

      // Verificar se o nome de usuário já está registrado
      const { data: usernameExists, error: usernameError } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .maybeSingle();

      if (usernameError) {
        Alert.alert('Erro', 'Erro ao verificar nome de usuário.');
        console.error(usernameError);
        return;
      }

      if (usernameExists) {
        Alert.alert('Erro', 'Nome de usuário já cadastrado. Escolha outro.');
        return;
      }

      console.log('Iniciando cadastro do usuário...');

      // Criar o usuário no sistema de autenticação do Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      }); //pq aqui só tem email e a senha se era para ter usuario 

      if (authError) {
        Alert.alert('Erro no cadastro', authError.message);
        return;
      }

      if (!authData?.user) {
        Alert.alert('Erro', 'Erro ao criar o usuário.');
        return;
      }

      const userId = authData.user.id;

      // Inserir dados adicionais na tabela "users"
      const { error: dbError } = await supabase
        .from('users')
        .insert([{ id: userId, name, username, email }]);

      if (dbError) {
        Alert.alert('Erro ao salvar informações adicionais', dbError.message);
        return;
      }

      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
      navigation.navigate('Login');
    } catch (err) {
      Alert.alert('Erro inesperado', err.message || 'Erro desconhecido.');
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
        placeholder="Digite sua senha com no minimo 6 digitos"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      //aqui era para terminar de cadastrar e ir para a pagina de  login
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
