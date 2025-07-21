const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Body:', req.body);
  next();
});

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

// Rota para testar se o servidor está funcionando
app.get('/api/status', (req, res) => {
  res.json({ status: 'Servidor funcionando!', timestamp: new Date().toISOString() });
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

// SUBSTITUA apenas a rota de LOGIN por esta versão:

app.post('/api/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    console.log('=== DEBUG BACKEND LOGIN ===');
    console.log('Email recebido:', email);
    console.log('Senha recebida:', senha);

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
        console.log('Usuário não encontrado para o email:', email);
        return res.json({ success: false, message: 'Email não encontrado' });
      }

      const user = results[0];
      
      console.log('Usuário encontrado:', user.email);
      console.log('Senha hash no banco:', user.senha);
      console.log('Tamanho do hash:', user.senha ? user.senha.length : 'undefined');

      try {
        let isValidPassword = false;
        
        // Verificar se é um hash bcrypt válido E completo
        const isValidBcryptHash = user.senha && 
                                 user.senha.startsWith('$2b$') && 
                                 user.senha.length >= 59; // Hash completo
        
        console.log('Hash parece ser bcrypt completo?', isValidBcryptHash);

        if (!isValidBcryptHash) {
          // Para senhas antigas truncadas ou em texto plano
          console.log('Senha antiga - comparando diretamente ou tentando recuperar...');
          
          // Se a senha no banco tem exatamente 50 chars e começa com $2b$10$
          if (user.senha.length === 50 && user.senha.startsWith('$2b$10$')) {
            // Senha truncada - vamos tentar algumas senhas comuns para recuperar
            const senhasComuns = ['123456', '123', 'senha123', 'admin', senha];
            
            for (let senhaComum of senhasComuns) {
              try {
                const hashCompleto = await bcrypt.hash(senhaComum, 10);
                // Comparar os primeiros 50 caracteres
                if (hashCompleto.substring(0, 50) === user.senha) {
                  isValidPassword = (senha === senhaComum);
                  console.log(`Senha recuperada: ${senhaComum}, válida: ${isValidPassword}`);
                  break;
                }
              } catch (e) {
                console.log('Erro ao testar senha:', e.message);
              }
            }
          } else {
            // Comparação direta para senhas em texto
            isValidPassword = senha === user.senha;
          }
          
        } else {
          // Usar bcrypt para senhas criptografadas completas
          console.log('Usando bcrypt.compare...');
          isValidPassword = await bcrypt.compare(senha, user.senha);
          console.log('Resultado bcrypt.compare:', isValidPassword);
        }
        
        if (!isValidPassword) {
          console.log('Senha incorreta');
          return res.json({ success: false, message: 'Senha incorreta' });
        }

        console.log('Login bem-sucedido para:', email);
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

// E MANTENHA a rota de CADASTRO normal para novos usuários:
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

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
