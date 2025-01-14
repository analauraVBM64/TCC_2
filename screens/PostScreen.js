import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import { supabase } from '../BD/supabaseClient';

const PostScreen = ({ navigation }) => {
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [user, setUser] = useState(null);

  // Buscar informações do usuário autenticado
  const fetchUser = async () => {
    const { data: user, error } = await supabase.auth.getUser();

    if (error) {
      Alert.alert('Erro', 'Falha ao obter informações do usuário.');
      navigation.navigate('Login'); // Redirecionar para o login se não autenticado
      return;
    }

    setUser(user);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Função para selecionar imagem
  const selectImage = () => {
    ImagePicker.launchImageLibrary(
      { mediaType: 'photo', quality: 1 },
      (response) => {
        if (response.didCancel) {
          Alert.alert('Cancelado', 'Seleção de imagem cancelada.');
        } else if (response.errorCode) {
          Alert.alert('Erro', `Erro ao selecionar imagem: ${response.errorMessage}`);
        } else if (response.assets && response.assets.length > 0) {
          const selectedImage = response.assets[0];
          setImageUri(selectedImage.uri);
        }
      }
    );
  };

  // Função para fazer upload da imagem para o Supabase
  const uploadImage = async () => {
    if (!imageUri) return null;

    try {
      const imageName = `post-images/${Date.now()}.jpg`;
      const response = await fetch(imageUri);
      const blob = await response.blob();

      const { data, error } = await supabase.storage
        .from('post-images')
        .upload(imageName, blob, {
          contentType: 'image/jpeg',
        });

      if (error) {
        throw error;
      }

      const { publicUrl } = supabase.storage.from('post-images').getPublicUrl(imageName);
      return publicUrl;
    } catch (error) {
      Alert.alert('Erro', 'Falha ao fazer upload da imagem.');
      return null;
    }
  };

  // Função para criar nova postagem
  const handlePost = async () => {
    if (!content.trim()) {
      Alert.alert('Erro', 'A publicação não pode estar vazia.');
      return;
    }

    const imageUrl = await uploadImage();

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            text: content.trim(),
            image_url: imageUrl,
            user_id: user.id, // Associando o post ao ID do usuário
          },
        ]);

      if (error) throw error;

      Alert.alert('Sucesso', 'Publicação criada com sucesso!');
      setContent('');
      setImageUri(null);
      navigation.navigate('Feed');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao criar publicação.');
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Carregando informações do usuário...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova Publicação</Text>
      <Text style={styles.subtitle}>Olá, {user.user_metadata.full_name || user.email}!</Text>
      <TextInput
        style={styles.input}
        placeholder="Escreva sua publicação..."
        value={content}
        onChangeText={setContent}
        multiline
      />
      <Button title="Selecionar Imagem" onPress={selectImage} color="#2a9d8f" />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}
      <Button title="Publicar" onPress={handlePost} color="#2a9d8f" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    height: 150,
    textAlignVertical: 'top',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 8,
  },
});

export default PostScreen;
