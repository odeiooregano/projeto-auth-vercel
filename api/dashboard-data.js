// api/dashboard-data.js
require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = async (req, res) => {
  app(req, res, async () => {
    // 1. Obter o token do cabeçalho de autorização
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
    }

    const token = authHeader.split(' ')[1]; // "Bearer TOKEN"

    if (!token) {
      return res.status(401).json({ message: 'Acesso negado. Formato de token inválido.' });
    }

    try {
      // 2. Verificar o token no banco de dados
      const result = await pool.query('SELECT username FROM users WHERE token = $1', [token]);

      if (result.rows.length === 0) {
        // Se o token não for encontrado, é inválido
        return res.status(401).json({ message: 'Token inválido ou expirado.' });
      }

      // 3. Se o token for válido, retorne os dados protegidos
      res.status(200).json({ message: 'Bem-vindo ao painel! Seus dados privados estão aqui.' });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  });
};