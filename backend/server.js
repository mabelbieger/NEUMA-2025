const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'mysql.infocimol.com.br',
  user: 'infocimol17', 
  password: 'N1e2u3m4a5', 
  database: 'infocimol17'
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conectado ao MySQL');
  }
});

app.post('/api/cadastro', async (req, res) => {
  try {
    const { nomeCompleto, email, senha, tipo } = req.body;

    if (!nomeCompleto || !email || !senha || !tipo) {
      return res.json({ success: false, message: 'Todos os campos são obrigatórios' });
    }

    const checkEmailQuery = 'SELECT email FROM Usuario WHERE email = ?';
    db.query(checkEmailQuery, [email], async (err, results) => {
      if (err) {
        console.error('Erro ao verificar email:', err);
        return res.json({ success: false, message: 'Erro interno do servidor' });
      }

      if (results.length > 0) {
        return res.json({ success: false, message: 'Email já cadastrado' });
      }

      try {
        const hashedPassword = await bcrypt.hash(senha, 10);
        
        const tipoUsuario = tipo === 'profissional' ? 'Professor' : 'Aluno';

        const insertUserQuery = 'INSERT INTO Usuario (nome, email, senha, tipo_usuario) VALUES (?, ?, ?, ?)';
        db.query(insertUserQuery, [nomeCompleto, email, hashedPassword, tipoUsuario], (err, userResult) => {
          if (err) {
            console.error('Erro ao inserir usuário:', err);
            return res.json({ success: false, message: 'Erro ao criar usuário' });
          }

          const userId = userResult.insertId;

          if (tipoUsuario === 'Professor') {
            const insertProfQuery = 'INSERT INTO Professor (id_usuario) VALUES (?)';
            db.query(insertProfQuery, [userId], (err) => {
              if (err) {
                console.error('Erro ao inserir professor:', err);
                return res.json({ success: false, message: 'Erro ao criar professor' });
              }
              res.json({ success: true, message: 'Cadastro realizado com sucesso!' });
            });
          } else {
            const insertAlunoQuery = 'INSERT INTO Aluno (id_usuario) VALUES (?)';
            db.query(insertAlunoQuery, [userId], (err) => {
              if (err) {
                console.error('Erro ao inserir aluno:', err);
                return res.json({ success: false, message: 'Erro ao criar aluno' });
              }
              res.json({ success: true, message: 'Cadastro realizado com sucesso!' });
            });
          }
        });
      } catch (hashError) {
        console.error('Erro ao criptografar senha:', hashError);
        res.json({ success: false, message: 'Erro interno do servidor' });
      }
    });
  } catch (error) {
    console.error('Erro no cadastro:', error);
    res.json({ success: false, message: 'Erro interno do servidor' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.json({ success: false, message: 'Email e senha são obrigatórios' });
    }

    // Buscar usuário por email
    const getUserQuery = 'SELECT * FROM Usuario WHERE email = ?';
    db.query(getUserQuery, [email], async (err, results) => {
      if (err) {
        console.error('Erro ao buscar usuário:', err);
        return res.json({ success: false, message: 'Erro interno do servidor' });
      }

      if (results.length === 0) {
        return res.json({ success: false, message: 'Email não encontrado' });
      }

      const user = results[0];

      try {
        const isValidPassword = await bcrypt.compare(senha, user.senha);
        
        if (!isValidPassword) {
          return res.json({ success: false, message: 'Senha incorreta' });
        }

        res.json({ 
          success: true, 
          message: 'Login realizado com sucesso!',
          user: {
            id: user.id_usuario,
            nome: user.nome,
            email: user.email,
            tipo: user.tipo_usuario
          }
        });
      } catch (compareError) {
        console.error('Erro ao verificar senha:', compareError);
        res.json({ success: false, message: 'Erro interno do servidor' });
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.json({ success: false, message: 'Erro interno do servidor' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});