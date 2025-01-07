import { StyleSheet, View, Text, Button } from 'react-native';
import supabase from '../BD/supabaseClient';

const SettingsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>
      <Button title="Alterar Senha" onPress={() => Alert.alert('Configurações', 'Função em desenvolvimento')} />
      <Button title="Sair" onPress={() => Alert.alert('Logout', 'Você foi desconectado!')} />
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
});

export default SettingsScreen;
