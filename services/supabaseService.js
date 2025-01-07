import supabase from '../BD/supabaseClient';

/**
 * Função para registrar um novo usuário.
 * @param {string} email - Email do usuário.
 * @param {string} password - Senha do usuário.
 * @param {string} name - Nome completo do usuário.
 * @param {string} username - Nome de usuário.
 * @returns {Object} Dados do usuário cadastrado.
 * @throws {Error} Caso ocorra um erro durante o registro.
 */
export const registerUser = async (email, password, name, username) => {
  // Registro de autenticação
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    throw new Error(`Erro no cadastro: ${authError.message}`);
  }

  // Inserção na tabela 'usuarios'
  const { data: userData, error: insertError } = await supabase
    .from('usuarios')
    .insert([
      {
        name,
        username,
        email,
        created_at: new Date().toISOString(),
      },
    ]);

  if (insertError) {
    throw new Error(`Erro ao salvar usuário: ${insertError.message}`);
  }

  return userData;
};

/**
 * Função para login de usuário.
 * @param {string} email - Email do usuário.
 * @param {string} password - Senha do usuário.
 * @returns {Object} Dados do usuário autenticado.
 * @throws {Error} Caso ocorra um erro durante o login.
 */
export const loginUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(`Erro no login: ${error.message}`);
  }

  return data;
};

/**
 * Função para obter dados do feed.
 * @returns {Array} Lista de posts do feed.
 * @throws {Error} Caso ocorra um erro ao buscar os posts.
 */
export const fetchFeed = async () => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Erro ao buscar posts: ${error.message}`);
  }

  return data;
};
