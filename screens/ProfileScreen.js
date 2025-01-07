import { StyleSheet, View, Text, Button } from 'react-native';
import supabase from '../BD/supabaseClient';

const ProfileScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Perfil</Text>
      <Text style={styles.text}>Nome: João Silva</Text>
      <Text style={styles.text}>E-mail: joao@gmail.com</Text>
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
