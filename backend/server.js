import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configuração do banco de dados
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'infocimol17'
};

// Função para conectar ao banco
async function getConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    return connection;
  } catch (error) {
    console.error('Erro ao conectar com o banco:', error);
    throw error;
  }
}

// Rota para cadastro de usuário
app.post('/api/cadastro', async (req, res) => {
  const { nomeCompleto, email, senha, tipo } = req.body;
  
  try {
    const connection = await getConnection();
    
    // Verificar se o email já existe
    const [existingUser] = await connection.execute(
      'SELECT id_usuario FROM Usuario WHERE email = ?',
      [email]
    );
    
    if (existingUser.length > 0) {
      await connection.end();
      return res.status(400).json({ 
        success: false, 
        message: 'Email já cadastrado!' 
      });
    }
    
    // Criptografar a senha
    const senhaHash = await bcrypt.hash(senha, 10);
    
    // Converter tipo para o formato do banco
    const tipoUsuario = tipo === 'estudante' ? 'Aluno' : 'Professor';
    
    // Inserir usuário
    const [result] = await connection.execute(
      'INSERT INTO Usuario (nome, email, senha, tipo_usuario) VALUES (?, ?, ?, ?)',
      [nomeCompleto, email, senhaHash, tipoUsuario]
    );
    
    const userId = result.insertId;
    
    // Inserir na tabela específica (Professor ou Aluno)
    if (tipoUsuario === 'Professor') {
      await connection.execute(
        'INSERT INTO Professor (id_usuario) VALUES (?)',
        [userId]
      );
    } else {
      await connection.execute(
        'INSERT INTO Aluno (id_usuario) VALUES (?)',
        [userId]
      );
    }
    
    await connection.end();
    
    res.json({ 
      success: true, 
      message: 'Usuário cadastrado com sucesso!',
      userId: userId
    });
    
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando!' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});