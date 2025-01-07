import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet,Button } from 'react-native';
import { fetchFeed } from '../services/supabaseService';
import supabase from '../BD/supabaseClient';

const FeedScreen = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const loadFeed = async () => {
      try {
        const data = await fetchFeed();
        setPosts(data);
      } catch (error) {
        console.error('Erro ao carregar o feed:', error);
      }
    };

    loadFeed();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.post}>
      <Text style={styles.content}>{item.content}</Text>
      <Text style={styles.timestamp}>{item.created_at}</Text>
    </View>
  );

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
