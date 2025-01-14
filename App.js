import 'react-native-url-polyfill/auto';
import React from 'react';
import 'react-native-get-random-values';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LoginScreen from './screens/Loginscreen';
import FeedScreen from './screens/FeedScreen';
import ProfileScreen from './screens/ProfileScreen';
import PostScreen from './screens/PostScreen';
import SettingsScreen from './screens/Settingsscreen';
import CadastroScreen from './screens/CadastroScreen';
import { supabase } from './BD/supabaseClient'; // Verifique se este arquivo está correto

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Componente de cabeçalho personalizado
const HeaderTitle = () => (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>AGROFALA</Text>
  </View>
);

// Tab Navigator para o rodapé
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarStyle: {
        backgroundColor: '#2a9d8f',
        borderTopWidth: 0,
        height: 60,
      },
      tabBarActiveTintColor: '#fff',
      tabBarInactiveTintColor: '#e5e5e5',
      tabBarLabelStyle: {
        fontSize: 14,
        fontWeight: 'bold',
      },
    }}
  >
    <Tab.Screen
      name="Feed"
      component={FeedScreen}
      options={{
        tabBarLabel: 'Feed',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home-sharp" color={color} size={size} />
        ),
        headerShown: false,
      }}
    />
    <Tab.Screen
      name="Post"
      component={PostScreen}
      options={{
        tabBarLabel: 'Nova Postagem',
        tabBarIcon: ({ color, size }) => (
          <FontAwesome name="plus-square" color={color} size={size} />
        ),
        headerShown: false,
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarLabel: 'Perfil',
        tabBarIcon: ({ color, size }) => (
          <FontAwesome name="user" color={color} size={size} />
        ),
        headerShown: false,
      }}
    />
    <Tab.Screen
      name="Settings"
      component={SettingsScreen}
      options={{
        tabBarLabel: 'Configurações',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="settings-sharp" color={color} size={size} />
        ),
        headerShown: false,
      }}
    />
  </Tab.Navigator>
);

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerTitle: (props) => <HeaderTitle {...props} />,
            headerStyle: { backgroundColor: '#f4f4f4' },
          }}
        />
        <Stack.Screen
          name="Cadastro"
          component={CadastroScreen}
          options={{
            headerTitle: (props) => <HeaderTitle {...props} />,
            headerStyle: { backgroundColor: '#f4f4f4' },
          }}
        />
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2a9d8f',
    textAlign: 'center',
  },
});

export default App;
