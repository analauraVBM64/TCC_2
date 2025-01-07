import { supabase } from '../BD/supabaseClient';

// Função para cadastrar usuário
export const addUser = async (name, email) => {
  const { data, error } = await supabase
    .from('users')
    .insert([{ name, email }]);

  return { data, error };
};

// Função para buscar usuários
export const fetchUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*');

  return { data, error };
};

// Função para atualizar usuário
export const updateUser = async (id, newName) => {
  const { data, error } = await supabase
    .from('users')
    .update({ name: newName })
    .eq('id', id);

  return { data, error };
};

// Função para deletar usuário
export const deleteUser = async (id) => {
  const { data, error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);

  return { data, error };
};
