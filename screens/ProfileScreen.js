import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Button, Alert } from 'react-native';
import { supabase } from '../BD/supabaseClient';

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Função para buscar informações do perfil no banco de dados
  const fetchUserProfile = async () => {
    try {
      // Obtendo o usuário logado
      const user = supabase.auth.user();

      if (!user) {
        Alert.alert('Erro', 'Usuário não autenticado');
        return;
      }

      // Consultando os dados do usuário na tabela "users"
      const { data, error } = await supabase
        .from('users') // Substitua 'users' pelo nome da sua tabela
        .select('name, email') // Campos que você quer retornar (exemplo: 'name', 'email')
        .eq('id', user.id)
        .single(); // Retorna um único item (usuário)

      if (error) {
        Alert.alert('Erro', 'Erro ao carregar dados do perfil.');
      } else {
        setUserData(data); // Atualiza os dados do usuário no estado
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao buscar dados do perfil.');
    } finally {
      setLoading(false); // Finaliza o loading
    }
  };

  // Usando useEffect para carregar o perfil assim que o componente for montado
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Se estiver carregando, exibe uma mensagem
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Carregando...</Text>
      </View>
    );
  }

  // Se não houver dados de usuário
  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Erro ao carregar perfil</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Perfil</Text>
      <Text style={styles.text}>Nome: {userData.name}</Text>
      <Text style={styles.text}>E-mail: {userData.email}</Text>
      <Button title="Editar Perfil" onPress={() => Alert.alert('Editar', 'Função em desenvolvimento')} />
      <Button title="Configurações" onPress={() => navigation.navigate('Settings')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default ProfileScreen;
