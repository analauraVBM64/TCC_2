import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Button, Alert } from 'react-native';
import { supabase } from '../BD/supabaseClient';

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Função para buscar informações do perfil
  const fetchUserProfile = async () => {
    try {
      // Obtendo o usuário autenticado
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        setIsAuthenticated(false);
        navigation.navigate('Login'); // Redireciona para login se não autenticado
        return;
      }

      // Consultando os dados do usuário no banco
      const { data, error } = await supabase
        .from('users') // Certifique-se de que esta tabela existe no banco
        .select('name, email') // Ajuste os campos conforme necessário
        .eq('id', user.id)
        .single();

      if (error) {
        Alert.alert('Erro', `Erro ao carregar perfil: ${error.message}`);
      } else {
        setUserData(data);
      }
    } catch (error) {
      Alert.alert('Erro', `Erro inesperado: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Redirecionando para o login...</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Carregando perfil...</Text>
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Erro ao carregar perfil.</Text>
        <Button title="Tentar Novamente" onPress={fetchUserProfile} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Perfil</Text>
      <Text style={styles.text}>Nome: {userData.name}</Text>
      <Text style={styles.text}>E-mail: {userData.email}</Text>
      <Button
        title="Editar Perfil"
        onPress={() => Alert.alert('Editar', 'Função em desenvolvimento')}
      />
      <Button
        title="Configurações"
        onPress={() => navigation.navigate('Settings')}
      />
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
