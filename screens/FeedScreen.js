import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { fetchFeed } from '../services/supabaseService';

const FeedScreen = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadFeed = async () => {
    setLoading(true);
    try {
      const data = await fetchFeed();
      setPosts(data);
      setError(null); // Limpa erros anteriores
    } catch (err) {
      setError('Erro ao carregar o feed. Tente novamente mais tarde.');
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.post}>
      <Text style={styles.content}>{item.content}</Text>
      <Text style={styles.timestamp}>{item.created_at}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'red' }}>{error}</Text>
        <Button title="Recarregar" onPress={loadFeed} color="#2a9d8f" />
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Nenhum post encontrado.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  post: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  content: {
    fontSize: 16,
    marginBottom: 10,
  },
  timestamp: {
    fontSize: 12,
    color: 'gray',
  },
});

export default FeedScreen;
