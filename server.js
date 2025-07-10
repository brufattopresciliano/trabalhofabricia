
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Conexão com o banco de dados PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ProjetoBanco',
  password: 'projetob',
  port: 5432, // porta padrão do PostgreSQL
});

// Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal (serve o HTML)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para salvar cliente
app.post('/clientes', async (req, res) => {
  const { nome, cpf, email, telefone } = req.body;

  try {
    const query = `
      INSERT INTO cliente1 (nome, cpf, email, telefone)
      VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const values = [nome, cpf, email, telefone];

    const result = await pool.query(query, values);
    res.status(201).json({ message: 'Cliente cadastrado com sucesso!', cliente: result.rows[0] });
  } catch (error) {
    console.error('Erro ao inserir cliente:', error);
    res.status(500).json({ error: 'Erro ao cadastrar cliente' });
  }
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});