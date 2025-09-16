// api/change-password.js
require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = async (req, res) => {
  app(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Método não permitido.' });
    }

    const { username, currentPassword, newPassword } = req.body;

    if (!username || !currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Usuário, senha atual e nova senha são obrigatórios.' });
    }

    try {
      // 1. Buscar o usuário no banco de dados com base no nome de usuário
      const result = await pool.query('SELECT password_hash FROM users WHERE username = $1', [username]);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }

      const user = result.rows[0];
      
      // 2. Usar bcrypt.compare() para verificar se a senha atual está correta
      const passwordMatch = await bcrypt.compare(currentPassword, user.password_hash);

      if (!passwordMatch) {
        return res.status(401).json({ message: 'Senha atual incorreta.' });
      }

      // 3. Desafio Adicional: Garantir que a nova senha não seja igual à senha atual
      if (currentPassword === newPassword) {
        return res.status(400).json({ message: 'A nova senha não pode ser igual à senha atual.' });
      }

      // 4. Se a senha for validada, gerar um novo hash para a nova senha
      const newPasswordHash = await bcrypt.hash(newPassword, 10);

      // 5. Atualizar o password_hash do usuário no banco de dados
      await pool.query('UPDATE users SET password_hash = $1 WHERE username = $2', [newPasswordHash, username]);
      
      res.status(200).json({ message: 'Senha alterada com sucesso!' });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  });
};