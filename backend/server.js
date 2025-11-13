const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3001;

const enviarEmailToken = async (email, nome, token) => {
  try {
    const emailData = {
      service_id: 'service_hxppnxb',
      template_id: 'template_r3n6x8s', 
      user_id: 'xf9Ljhxu447oam886',
      accessToken: 'a6c8d8f4b2e1c9a3e7f5d2b8c4a9e6f3',
      template_params: {
        to_email: email,
        to_name: nome,
        token: token,
        reply_to: email,
        subject: 'Token de Recuperação de Senha - Neuma'
      }
    };

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    });

    console.log('Status do EmailJS:', response.status);
    
    if (response.ok) {
      console.log('✅ Email enviado com sucesso para:', email);
      return true;
    } else {
      const errorText = await response.text();
      console.error('❌ Erro EmailJS:', errorText);
      return false;
    }
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    return false;
  }
};

console.log('✅ Servidor iniciado');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|mp4|avi|mov|mp3|wav|ogg|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não suportado!'));
    }
  }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
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

app.get('/api/status', (req, res) => {
  res.json({ status: 'Servidor funcionando!', timestamp: new Date().toISOString() });
});

app.post('/api/cadastro', async (req, res) => {
  try {
    const { nomeCompleto, email, senha, tipo, nome, tipo_usuario } = req.body;

    const nomeUsuario = nome || nomeCompleto;
    const tipoUsuario = tipo_usuario || (tipo === 'profissional' ? 'Professor' : tipo === 'estudante' ? 'Aluno' : tipo);

    if (!nomeUsuario || !email || !senha || !tipoUsuario) {
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

        const insertUserQuery = 'INSERT INTO Usuario (nome, email, senha, tipo_usuario) VALUES (?, ?, ?, ?)';
        db.query(insertUserQuery, [nomeUsuario, email, hashedPassword, tipoUsuario], (err, userResult) => {
          if (err) {
            console.error('Erro ao inserir usuário:', err);
            return res.json({ success: false, message: 'Erro ao criar usuário' });
          }

          const userId = userResult.insertId;

          if (tipoUsuario === 'Professor') {
            const insertProfQuery = 'INSERT INTO Professor (id_usuario) VALUES (?)';
            db.query(insertProfQuery, [userId], (err, profResult) => {
              if (err) {
                console.error('Erro ao inserir professor:', err);
                return res.json({ success: false, message: 'Erro ao criar professor' });
              }
              
              res.json({
                success: true,
                message: 'Cadastro realizado com sucesso!',
                user: {
                  id: userId,
                  id_professor: profResult.insertId,
                  nome: nomeUsuario,
                  email: email,
                  tipo: tipoUsuario,
                  tipo_usuario: tipoUsuario
                }
              });
            });
          } else {
            const insertAlunoQuery = 'INSERT INTO Aluno (id_usuario) VALUES (?)';
            db.query(insertAlunoQuery, [userId], (err) => {
              if (err) {
                console.error('Erro ao inserir aluno:', err);
                return res.json({ success: false, message: 'Erro ao criar aluno' });
              }
              res.json({
                success: true,
                message: 'Cadastro realizado com sucesso!',
                user: {
                  id: userId,
                  nome: nomeUsuario,
                  email: email,
                  tipo: tipoUsuario,
                  tipo_usuario: tipoUsuario
                }
              });
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

    const getUserQuery = `
      SELECT 
        u.id_usuario,
        u.nome,
        u.email,
        u.senha,
        u.tipo_usuario,
        p.id_professor,
        a.id_aluno
      FROM Usuario u
      LEFT JOIN Professor p ON u.id_usuario = p.id_usuario
      LEFT JOIN Aluno a ON u.id_usuario = a.id_usuario
      WHERE u.email = ?
    `;
    
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
        let isValidPassword = false;

        if (user.senha && user.senha.startsWith('$2')) {
          isValidPassword = await bcrypt.compare(senha, user.senha);
        } else {
          isValidPassword = (senha === user.senha);
          
          if (isValidPassword) {
            try {
              const hashedPassword = await bcrypt.hash(senha, 10);
              const updateQuery = 'UPDATE Usuario SET senha = ? WHERE id_usuario = ?';
              db.query(updateQuery, [hashedPassword, user.id_usuario]);
            } catch (hashError) {
              console.error('Erro ao gerar hash bcrypt:', hashError);
            }
          }
        }
       
        if (!isValidPassword) {
          return res.json({ success: false, message: 'Senha incorreta' });
        }

        const responseUser = {
          id: user.id_usuario,
          nome: user.nome,
          email: user.email,
          tipo: user.tipo_usuario,
          tipo_usuario: user.tipo_usuario
        };

        if (user.tipo_usuario === 'Professor' && user.id_professor) {
          responseUser.id_professor = user.id_professor;
        }
        if (user.tipo_usuario === 'Aluno' && user.id_aluno) {
          responseUser.id_aluno = user.id_aluno;
        }
        
        res.json({
          success: true,
          message: 'Login realizado com sucesso!',
          user: responseUser
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

app.post('/api/solicitar-troca-senha', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({ success: false, message: 'Email é obrigatório' });
    }

    const checkUserQuery = 'SELECT id_usuario, nome, email FROM Usuario WHERE email = ?';
    
    db.query(checkUserQuery, [email], async (err, results) => {
      if (err) {
        console.error('Erro ao buscar usuário:', err);
        return res.json({ success: false, message: 'Erro interno do servidor' });
      }

      if (results.length === 0) {
        return res.json({ success: false, message: 'Email não encontrado' });
      }

      const user = results[0];
      const token = Math.floor(100000 + Math.random() * 900000).toString();
      const dataExpiracao = new Date(Date.now() + 2 * 60 * 1000);

      const clearOldTokensQuery = 'DELETE FROM RecuperacaoSenha WHERE id_usuario = ?';
      
      db.query(clearOldTokensQuery, [user.id_usuario], (err) => {
        const insertTokenQuery = 'INSERT INTO RecuperacaoSenha (id_usuario, token, data_expiracao) VALUES (?, ?, ?)';

        db.query(insertTokenQuery, [user.id_usuario, token, dataExpiracao], async (err, result) => {
          if (err) {
            return res.json({ success: false, message: 'Erro ao processar solicitação' });
          }

          const emailEnviado = await enviarEmailToken(user.email, user.nome, token);
          
          if (emailEnviado) {
            res.json({ 
              success: true, 
              message: 'Token enviado para seu email!',
              email: user.email,
              nome: user.nome,
              token: token
            });
          } else {
            res.json({ 
              success: false, 
              message: 'Erro ao enviar email. Tente novamente.' 
            });
          }
        });
      });
    });

  } catch (error) {
    console.error('Erro na solicitação de troca de senha:', error);
    res.json({ success: false, message: 'Erro interno do servidor' });
  }
});

app.post('/api/verificar-token', async (req, res) => {
  try {
    const { email, token } = req.body;

    if (!email || !token) {
      return res.json({ success: false, message: 'Email e token são obrigatórios' });
    }

    const verifyTokenQuery = `
      SELECT rs.*, u.id_usuario 
      FROM RecuperacaoSenha rs
      JOIN Usuario u ON rs.id_usuario = u.id_usuario
      WHERE u.email = ? AND rs.token = ? AND rs.utilizado = FALSE AND rs.data_expiracao > NOW()
    `;

    db.query(verifyTokenQuery, [email, token], (err, results) => {
      if (err) {
        console.error('Erro ao verificar token:', err);
        return res.json({ success: false, message: 'Erro interno do servidor' });
      }

      if (results.length === 0) {
        const checkExpiredQuery = `
          SELECT rs.* 
          FROM RecuperacaoSenha rs
          JOIN Usuario u ON rs.id_usuario = u.id_usuario
          WHERE u.email = ? AND rs.token = ? AND rs.utilizado = FALSE
        `;
        
        db.query(checkExpiredQuery, [email, token], (err, expiredResults) => {
          if (err) {
            return res.json({ success: false, message: 'Token inválido' });
          }
          
          if (expiredResults.length > 0) {
            return res.json({ success: false, message: 'Token expirado. Solicite um novo token.' });
          } else {
            return res.json({ success: false, message: 'Token inválido' });
          }
        });
        return;
      }

      const recovery = results[0];

      const markUsedQuery = 'UPDATE RecuperacaoSenha SET utilizado = TRUE WHERE id_recuperacao = ?';
      db.query(markUsedQuery, [recovery.id_recuperacao]);

      res.json({
        success: true,
        message: 'Token verificado com sucesso!',
        id_usuario: recovery.id_usuario
      });
    });

  } catch (error) {
    console.error('Erro na verificação do token:', error);
    res.json({ success: false, message: 'Erro interno do servidor' });
  }
});

app.post('/api/trocar-senha', async (req, res) => {
  try {
    const { id_usuario, nova_senha } = req.body;

    if (!id_usuario || !nova_senha) {
      return res.json({ success: false, message: 'Dados incompletos' });
    }

    if (nova_senha.length < 6) {
      return res.json({ success: false, message: 'A senha deve ter pelo menos 6 caracteres' });
    }

    const hashedPassword = await bcrypt.hash(nova_senha, 10);

    const updatePasswordQuery = 'UPDATE Usuario SET senha = ? WHERE id_usuario = ?';
    
    db.query(updatePasswordQuery, [hashedPassword, id_usuario], (err, result) => {
      if (err) {
        console.error('Erro ao atualizar senha:', err);
        return res.json({ success: false, message: 'Erro ao atualizar senha' });
      }

      if (result.affectedRows === 0) {
        return res.json({ success: false, message: 'Usuário não encontrado' });
      }
      
      res.json({
        success: true,
        message: 'Senha alterada com sucesso!'
      });
    });

  } catch (error) {
    console.error('Erro ao trocar senha:', error);
    res.json({ success: false, message: 'Erro interno do servidor' });
  }
});

app.post('/api/turmas', (req, res) => {
  try {
    const { id_professor, nome_turma, codigo_acesso } = req.body;

    if (!id_professor || !nome_turma || !codigo_acesso) {
      return res.json({ 
        success: false, 
        message: 'Todos os campos são obrigatórios' 
      });
    }

    const checkProfessorQuery = 'SELECT id_professor FROM Professor WHERE id_professor = ?';
    db.query(checkProfessorQuery, [id_professor], (err, results) => {
      if (err) {
        console.error('Erro ao verificar professor:', err);
        return res.json({ 
          success: false, 
          message: 'Erro interno do servidor' 
        });
      }

      if (results.length === 0) {
        return res.json({ 
          success: false, 
          message: 'Professor não encontrado' 
        });
      }

      const checkCodigoQuery = 'SELECT codigo_acesso FROM Turma WHERE codigo_acesso = ?';
      db.query(checkCodigoQuery, [codigo_acesso], (err, codigoResults) => {
        if (err) {
          console.error('Erro ao verificar código:', err);
          return res.json({ 
            success: false, 
            message: 'Erro interno do servidor' 
          });
        }

        if (codigoResults.length > 0) {
          return res.json({ 
            success: false, 
            message: 'Código de acesso já existe. Gere um novo código.' 
          });
        }

        const insertTurmaQuery = 'INSERT INTO Turma (id_professor, nome_turma, codigo_acesso) VALUES (?, ?, ?)';
        db.query(insertTurmaQuery, [id_professor, nome_turma, codigo_acesso], (err, result) => {
          if (err) {
            console.error('Erro ao inserir turma:', err);
            return res.json({ 
              success: false, 
              message: 'Erro ao criar turma' 
            });
          }

          res.json({
            success: true,
            message: 'Turma criada com sucesso!',
            turma: {
              id_turma: result.insertId,
              id_professor: id_professor,
              nome_turma: nome_turma,
              codigo_acesso: codigo_acesso
            }
          });
        });
      });
    });

  } catch (error) {
    console.error('Erro ao criar turma:', error);
    res.json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

app.post('/api/salvar-teste', (req, res) => {
  try {
    const { userId, scores } = req.body;
   
    if (!userId || !scores) {
      return res.json({ success: false, message: 'Dados incompletos' });
    }

    const categorias = [
      { nome: 'visual', pontuacao: scores.V || 0 },
      { nome: 'auditivo', pontuacao: scores.A || 0 },
      { nome: 'leitura_escrita', pontuacao: scores.R || 0 },
      { nome: 'cinestesico', pontuacao: scores.K || 0 }
    ];
   
    const categoriaDominante = categorias.reduce((prev, current) =>
      (prev.pontuacao > current.pontuacao) ? prev : current
    );

    const getCategoriaQuery = 'SELECT id_categoria FROM Categoria WHERE nome_categoria = ?';
    db.query(getCategoriaQuery, [categoriaDominante.nome], (err, categoriaResults) => {
      if (err) return res.json({ success: false, message: 'Erro ao buscar categoria' });
      if (categoriaResults.length === 0) {
        return res.json({ success: false, message: 'Categoria não encontrada' });
      }

      const idCategoria = categoriaResults[0].id_categoria;

      const checkAlunoQuery = 'SELECT id_aluno FROM Aluno WHERE id_usuario = ?';
      db.query(checkAlunoQuery, [userId], (err, alunoResults) => {
        if (err) return res.json({ success: false, message: 'Erro interno' });
        if (alunoResults.length === 0) {
          return res.json({ success: false, message: 'Aluno não encontrado' });
        }

        const updateAlunoQuery = `
          UPDATE Aluno
          SET
            id_categoria            = ?,
            pontuacao_visual        = ?,
            pontuacao_auditivo      = ?,
            pontuacao_cinestesico   = ?,
            pontuacao_leitura_escrita = ?,
            teste_realizado         = TRUE
          WHERE id_usuario = ?
        `;

        const valoresUpdate = [
          idCategoria,
          scores.V || 0,
          scores.A || 0,
          scores.K || 0,
          scores.R || 0,
          userId
        ];

        db.query(updateAlunoQuery, valoresUpdate, (err, updateResult) => {
          if (err) {
            console.error('Erro ao atualizar aluno:', err);
            return res.json({
              success: false,
              message: 'Erro ao salvar resultados do teste'
            });
          }
          if (updateResult.affectedRows === 0) {
            return res.json({
              success: false,
              message: 'Nenhum registro foi atualizado'
            });
          }
          res.json({
            success: true,
            message: 'Resultados do teste salvos com sucesso!',
            categoria_dominante: categoriaDominante.nome,
            pontuacoes: {
              visual:    scores.V || 0,
              auditivo:  scores.A || 0,
              cinestesico: scores.K || 0,
              leitura_escrita: scores.R || 0
            }
          });
        });
      });
    });

  } catch (error) {
    console.error('Erro ao salvar teste:', error);
    res.json({ success: false, message: 'Erro interno do servidor' });
  }
});

app.get('/api/turmas/professor/:id_professor', (req, res) => {
  try {
    const { id_professor } = req.params;

    if (!id_professor) {
      return res.json({ 
        success: false, 
        message: 'ID do professor é obrigatório' 
      });
    }

    const getTurmasQuery = `
      SELECT 
        id_turma,
        nome_turma,
        codigo_acesso,
        data_criacao
      FROM Turma
      WHERE id_professor = ?
      ORDER BY data_criacao DESC
    `;

    db.query(getTurmasQuery, [id_professor], (err, results) => {
      if (err) {
        console.error('Erro ao buscar turmas:', err);
        return res.json({ 
          success: false, 
          message: 'Erro ao buscar turmas' 
        });
      }
      
      res.json({
        success: true,
        turmas: results,
        total: results.length
      });
    });

  } catch (error) {
    console.error('Erro ao listar turmas:', error);
    res.json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

app.delete('/api/turmas/:id_turma', (req, res) => {
  try {
    const { id_turma } = req.params;

    if (!id_turma) {
      return res.json({ 
        success: false, 
        message: 'ID da turma é obrigatório' 
      });
    }

    const deleteTurmaQuery = 'DELETE FROM Turma WHERE id_turma = ?';
    db.query(deleteTurmaQuery, [id_turma], (err, result) => {
      if (err) {
        console.error('Erro ao excluir turma:', err);
        return res.json({ 
          success: false, 
          message: 'Erro ao excluir turma' 
        });
      }

      if (result.affectedRows === 0) {
        return res.json({ 
          success: false, 
          message: 'Turma não encontrada' 
        });
      }

      res.json({
        success: true,
        message: 'Turma excluída com sucesso!'
      });
    });

  } catch (error) {
    console.error('Erro ao excluir turma:', error);
    res.json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

app.put('/api/turmas/:id_turma', (req, res) => {
  try {
    const { id_turma } = req.params;
    const { nome_turma, codigo_acesso } = req.body;

    if (!id_turma || !nome_turma || !codigo_acesso) {
      return res.json({ 
        success: false, 
        message: 'Todos os campos são obrigatórios' 
      });
    }

    const checkCodigoQuery = 'SELECT id_turma FROM Turma WHERE codigo_acesso = ? AND id_turma != ?';
    db.query(checkCodigoQuery, [codigo_acesso, id_turma], (err, results) => {
      if (err) {
        console.error('Erro ao verificar código:', err);
        return res.json({ 
          success: false, 
          message: 'Erro interno do servidor' 
        });
      }

      if (results.length > 0) {
        return res.json({ 
          success: false, 
          message: 'Este código de acesso já está em uso por outra turma' 
        });
      }

      const updateTurmaQuery = 'UPDATE Turma SET nome_turma = ?, codigo_acesso = ? WHERE id_turma = ?';
      db.query(updateTurmaQuery, [nome_turma, codigo_acesso.toUpperCase(), id_turma], (err, result) => {
        if (err) {
          console.error('Erro ao atualizar turma:', err);
          return res.json({ 
            success: false, 
            message: 'Erro ao atualizar turma' 
          });
        }

        if (result.affectedRows === 0) {
          return res.json({ 
            success: false, 
            message: 'Turma não encontrada' 
          });
        }

        res.json({
          success: true,
          message: 'Turma atualizada com sucesso!',
          turma: {
            id_turma,
            nome_turma,
            codigo_acesso: codigo_acesso.toUpperCase()
          }
        });
      });
    });

  } catch (error) {
    console.error('Erro ao atualizar turma:', error);
    res.json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    });
  }
});

app.get('/api/professor/:id_usuario', (req, res) => {
  try {
    const { id_usuario } = req.params;

    if (!id_usuario) {
      return res.json({ success: false, message: 'ID do usuário é obrigatório' });
    }

    const getProfessorQuery = 'SELECT id_professor FROM Professor WHERE id_usuario = ?';
    db.query(getProfessorQuery, [id_usuario], (err, results) => {
      if (err) {
        console.error('Erro ao buscar professor:', err);
        return res.json({ success: false, message: 'Erro interno do servidor' });
      }

      if (results.length === 0) {
        return res.json({ success: false, message: 'Professor não encontrado' });
      }

      const professor = results[0];

      res.json({
        success: true,
        id_professor: professor.id_professor,
        message: 'Professor encontrado com sucesso'
      });
    });

  } catch (error) {
    console.error('Erro ao buscar professor:', error);
    res.json({ success: false, message: 'Erro interno do servidor' });
  }
});

app.post('/api/atividades', upload.single('arquivo'), async (req, res) => {
  try {
    const { id_professor, titulo, descricao, id_categoria, tipo_conteudo, conteudo_texto, turmas_ids, publica } = req.body;

    if (!id_professor || !titulo || !id_categoria || !tipo_conteudo) {
      return res.json({ 
        success: false, 
        message: 'Campos obrigatórios faltando' 
      });
    }

    let conteudo = conteudo_texto || '';
    let nome_arquivo = null;

    if (req.file) {
      conteudo = `/uploads/${req.file.filename}`;
      nome_arquivo = req.file.originalname;
    }

    const insertAtividadeQuery = `
      INSERT INTO Atividade 
      (id_professor, titulo, descricao, id_categoria, tipo_conteudo, conteudo, nome_arquivo, publica) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      insertAtividadeQuery, 
      [id_professor, titulo, descricao, id_categoria, tipo_conteudo, conteudo, nome_arquivo, publica || false],
      (err, result) => {
        if (err) {
          console.error('Erro ao inserir atividade:', err);
          return res.json({ success: false, message: 'Erro ao criar atividade' });
        }

        const id_atividade = result.insertId;

        if (turmas_ids && turmas_ids.length > 0) {
          const turmasArray = typeof turmas_ids === 'string' ? JSON.parse(turmas_ids) : turmas_ids;
          const insertTurmaAtividadeQuery = 'INSERT INTO Turma_Atividade (id_turma, id_atividade) VALUES ?';
          const values = turmasArray.map(id_turma => [id_turma, id_atividade]);

          db.query(insertTurmaAtividadeQuery, [values], (err) => {
            if (err) {
              console.error('Erro ao associar turmas:', err);
              return res.json({ success: false, message: 'Atividade criada mas erro ao associar turmas' });
            }

            res.json({
              success: true,
              message: 'Atividade criada e associada às turmas com sucesso!',
              id_atividade: id_atividade
            });
          });
        } else {
          res.json({
            success: true,
            message: 'Atividade criada com sucesso!',
            id_atividade: id_atividade
          });
        }
      }
    );

  } catch (error) {
    console.error('Erro ao criar atividade:', error);
    res.json({ success: false, message: 'Erro interno do servidor' });
  }
});

app.get('/api/atividades/professor/:id_professor', (req, res) => {
  try {
    const { id_professor } = req.params;

    const query = `
      SELECT 
        a.*,
        c.nome_categoria,
        GROUP_CONCAT(DISTINCT t.nome_turma SEPARATOR ', ') as turmas
      FROM Atividade a
      LEFT JOIN Categoria c ON a.id_categoria = c.id_categoria
      LEFT JOIN Turma_Atividade ta ON a.id_atividade = ta.id_atividade
      LEFT JOIN Turma t ON ta.id_turma = t.id_turma
      WHERE a.id_professor = ?
      GROUP BY a.id_atividade
      ORDER BY a.data_criacao DESC
    `;

    db.query(query, [id_professor], (err, results) => {
      if (err) {
        console.error('Erro ao listar atividades:', err);
        return res.json({ success: false, message: 'Erro ao listar atividades' });
      }

      res.json({
        success: true,
        atividades: results
      });
    });

  } catch (error) {
    console.error('Erro ao listar atividades:', error);
    res.json({ success: false, message: 'Erro interno do servidor' });
  }
});

app.get('/api/atividades/turma/:id_turma/categoria/:id_categoria', (req, res) => {
  try {
    const { id_turma, id_categoria } = req.params;

    const query = `
      SELECT 
        a.*,
        c.nome_categoria
      FROM Atividade a
      INNER JOIN Turma_Atividade ta ON a.id_atividade = ta.id_atividade
      INNER JOIN Categoria c ON a.id_categoria = c.id_categoria
      WHERE ta.id_turma = ? AND a.id_categoria = ?
      ORDER BY a.data_criacao DESC
    `;

    db.query(query, [id_turma, id_categoria], (err, results) => {
      if (err) {
        console.error('Erro ao listar atividades da turma:', err);
        return res.json({ success: false, message: 'Erro ao listar atividades' });
      }

      res.json({
        success: true,
        atividades: results
      });
    });

  } catch (error) {
    console.error('Erro ao listar atividades da turma:', error);
    res.json({ success: false, message: 'Erro interno do servidor' });
  }
});

app.delete('/api/atividades/:id_atividade', (req, res) => {
  try {
    const { id_atividade } = req.params;

    db.query('SELECT conteudo, tipo_conteudo FROM Atividade WHERE id_atividade = ?', [id_atividade], (err, results) => {
      if (err || results.length === 0) {
        return res.json({ success: false, message: 'Atividade não encontrada' });
      }

      const atividade = results[0];

      if (atividade.conteudo && atividade.conteudo.startsWith('/uploads/')) {
        const filePath = path.join(__dirname, atividade.conteudo);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      db.query('DELETE FROM Turma_Atividade WHERE id_atividade = ?', [id_atividade], (err) => {
        db.query('DELETE FROM Atividade WHERE id_atividade = ?', [id_atividade], (err, result) => {
          if (err) {
            console.error('Erro ao deletar atividade:', err);
            return res.json({ success: false, message: 'Erro ao deletar atividade' });
          }

          res.json({
            success: true,
            message: 'Atividade deletada com sucesso!'
          });
        });
      });
    });

  } catch (error) {
    console.error('Erro ao deletar atividade:', error);
    res.json({ success: false, message: 'Erro interno do servidor' });
  }
});

app.post('/api/turmas/:id_turma/configuracao', (req, res) => {
  try {
    const { id_turma } = req.params;
    const { permitir_visualizar_outras_categorias } = req.body;

    const query = `
      INSERT INTO Turma_Configuracao (id_turma, permitir_visualizar_outras_categorias) 
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE permitir_visualizar_outras_categorias = ?
    `;

    db.query(query, [id_turma, permitir_visualizar_outras_categorias, permitir_visualizar_outras_categorias], (err) => {
      if (err) {
        console.error('Erro ao salvar configuração:', err);
        return res.json({ success: false, message: 'Erro ao salvar configuração' });
      }

      res.json({
        success: true,
        message: 'Configuração salva com sucesso!'
      });
    });

  } catch (error) {
    console.error('Erro ao salvar configuração:', error);
    res.json({ success: false, message: 'Erro interno do servidor' });
  }
});

app.get('/api/turmas/:id_turma/configuracao', (req, res) => {
  try {
    const { id_turma } = req.params;

    db.query('SELECT * FROM Turma_Configuracao WHERE id_turma = ?', [id_turma], (err, results) => {
      if (err) {
        console.error('Erro ao buscar configuração:', err);
        return res.json({ success: false, message: 'Erro ao buscar configuração' });
      }

      const config = results.length > 0 ? results[0] : { permitir_visualizar_outras_categorias: false };

      res.json({
        success: true,
        configuracao: config
      });
    });

  } catch (error) {
    console.error('Erro ao buscar configuração:', error);
    res.json({ success: false, message: 'Erro interno do servidor' });
  }
});

app.post('/api/entrar-turma', (req, res) => {
  const { id_usuario, codigo_acesso } = req.body;

  if (!id_usuario || !codigo_acesso) {
    return res.json({
      success: false,
      message: 'ID do usuário e código de acesso são obrigatórios'
    });
  }

  const getAlunoQuery = 'SELECT id_aluno FROM Aluno WHERE id_usuario = ?';
  db.query(getAlunoQuery, [id_usuario], (err, alunoResults) => {
    if (err) {
      console.error('Erro ao buscar aluno:', err);
      return res.json({
        success: false,
        message: 'Erro ao processar entrada na turma'
      });
    }

    if (alunoResults.length === 0) {
      return res.json({
        success: false,
        message: 'Aluno não encontrado'
      });
    }

    const id_aluno = alunoResults[0].id_aluno;

    const getTurmaQuery = 'SELECT id_turma, nome_turma FROM Turma WHERE codigo_acesso = ?';
    db.query(getTurmaQuery, [codigo_acesso.toUpperCase()], (err, turmaResults) => {
      if (err) {
        console.error('Erro ao buscar turma:', err);
        return res.json({
          success: false,
          message: 'Erro ao processar entrada na turma'
        });
      }

      if (turmaResults.length === 0) {
        return res.json({
          success: false,
          message: 'Código de turma inválido'
        });
      }

      const turma = turmaResults[0];

      const checkAlunoTurmaQuery = 'SELECT * FROM Turma_Aluno WHERE id_turma = ? AND id_aluno = ?';
      db.query(checkAlunoTurmaQuery, [turma.id_turma, id_aluno], (err, alunoNaTurmaResults) => {
        if (err) {
          console.error('Erro ao verificar aluno na turma:', err);
          return res.json({
            success: false,
            message: 'Erro ao processar entrada na turma'
          });
        }

        if (alunoNaTurmaResults.length > 0) {
          return res.json({
            success: false,
            message: 'Você já está cadastrado nesta turma'
          });
        }

        const insertTurmaAlunoQuery = 'INSERT INTO Turma_Aluno (id_turma, id_aluno) VALUES (?, ?)';
        db.query(insertTurmaAlunoQuery, [turma.id_turma, id_aluno], (err) => {
          if (err) {
            console.error('Erro ao adicionar aluno na turma:', err);
            return res.json({
              success: false,
              message: 'Erro ao processar entrada na turma'
            });
          }

          res.json({
            success: true,
            message: `Você entrou na turma "${turma.nome_turma}" com sucesso!`,
            turma: turma
          });
        });
      });
    });
  });
});

app.get('/api/aluno/:id_usuario', (req, res) => {
  const { id_usuario } = req.params;

  const query = `
    SELECT 
      a.id_aluno,
      a.id_usuario,
      a.id_categoria,
      a.pontuacao_visual,
      a.pontuacao_auditivo,
      a.pontuacao_cinestesico,
      a.pontuacao_leitura_escrita,
      a.teste_realizado,
      u.nome,
      u.email,
      c.nome_categoria
    FROM Aluno a
    JOIN Usuario u ON a.id_usuario = u.id_usuario
    LEFT JOIN Categoria c ON a.id_categoria = c.id_categoria
    WHERE a.id_usuario = ?
  `;

  db.query(query, [id_usuario], (err, results) => {
    if (err) {
      console.error('Erro ao buscar aluno:', err);
      return res.json({ success: false, message: 'Erro ao buscar dados do aluno' });
    }

    if (results.length === 0) {
      return res.json({ success: false, message: 'Aluno não encontrado' });
    }

    res.json({
      success: true,
      aluno: results[0]
    });
  });
});

app.get('/api/aluno/:id_usuario/turmas', (req, res) => {
  const { id_usuario } = req.params;

  const query = `
    SELECT 
      t.id_turma,
      t.nome_turma,
      t.codigo_acesso,
      t.data_criacao
    FROM Turma t
    JOIN Turma_Aluno ta ON t.id_turma = ta.id_turma
    JOIN Aluno a ON ta.id_aluno = a.id_aluno
    WHERE a.id_usuario = ?
    ORDER BY t.data_criacao DESC
  `;

  db.query(query, [id_usuario], (err, results) => {
    if (err) {
      console.error('Erro ao buscar turmas do aluno:', err);
      return res.json({ success: false, message: 'Erro ao buscar turmas' });
    }

    res.json({
      success: true,
      turmas: results
    });
  });
});

app.get('/api/atividades-publicas/:id_categoria', (req, res) => {
  const { id_categoria } = req.params;

  const idCategoriaNum = parseInt(id_categoria);

  if (isNaN(idCategoriaNum)) {
    return res.json({ 
      success: false, 
      message: 'ID da categoria inválido' 
    });
  }

  const query = `
    SELECT 
      a.id_atividade,
      a.titulo,
      a.descricao,
      a.id_categoria,
      a.tipo_conteudo,
      a.conteudo,
      a.nome_arquivo,
      a.data_criacao,
      a.publica,
      c.nome_categoria,
      u.nome as nome_professor
    FROM Atividade a
    JOIN Categoria c ON a.id_categoria = c.id_categoria
    JOIN Professor p ON a.id_professor = p.id_professor
    JOIN Usuario u ON p.id_usuario = u.id_usuario
    WHERE a.publica = true 
      AND a.id_categoria = ?
    ORDER BY a.data_criacao DESC
  `;

  db.query(query, [idCategoriaNum], (err, results) => {
    if (err) {
      console.error('Erro ao buscar atividades públicas:', err);
      return res.json({ 
        success: false, 
        message: 'Erro ao buscar atividades públicas' 
      });
    }
    
    res.json({
      success: true,
      atividades: results,
      categoria_id: idCategoriaNum,
      total: results.length
    });
  });
});

app.get('/api/atividades-publicas', (req, res) => {
  const query = `
    SELECT 
      a.id_atividade,
      a.titulo,
      a.descricao,
      a.id_categoria,
      a.tipo_conteudo,
      a.conteudo,
      a.nome_arquivo,
      a.data_criacao,
      a.publica,
      c.nome_categoria,
      u.nome as nome_professor
    FROM Atividade a
    JOIN Categoria c ON a.id_categoria = c.id_categoria
    JOIN Professor p ON a.id_professor = p.id_professor
    JOIN Usuario u ON p.id_usuario = u.id_usuario
    WHERE a.publica = true
    ORDER BY a.data_criacao DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar atividades públicas:', err);
      return res.json({ success: false, message: 'Erro ao buscar atividades públicas' });
    }
    
    res.json({
      success: true,
      atividades: results
    });
  });
});

app.get('/api/debug/atividades', (req, res) => {
  const query = `
    SELECT 
      a.id_atividade,
      a.titulo,
      a.publica,
      c.nome_categoria,
      u.nome as professor
    FROM Atividade a
    JOIN Categoria c ON a.id_categoria = c.id_categoria
    JOIN Professor p ON a.id_professor = p.id_professor
    JOIN Usuario u ON p.id_usuario = u.id_usuario
    ORDER BY a.data_criacao DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro no debug:', err);
      return res.json({ success: false, message: 'Erro no debug' });
    }

    res.json({
      success: true,
      total: results.length,
      todas: results
    });
  });
});

app.put('/api/atividades/:id_atividade/publica', (req, res) => {
  const { id_atividade } = req.params;
  const { publica } = req.body;

  const query = 'UPDATE Atividade SET publica = ? WHERE id_atividade = ?';
  
  db.query(query, [publica, id_atividade], (err, result) => {
    if (err) {
      console.error('Erro ao atualizar atividade:', err);
      return res.json({ success: false, message: 'Erro ao atualizar atividade' });
    }

    if (result.affectedRows === 0) {
      return res.json({ success: false, message: 'Atividade não encontrada' });
    }

    res.json({
      success: true,
      message: `Atividade ${publica ? 'tornada pública' : 'tornada privada'} com sucesso!`
    });
  });
});

app.get('/api/perfil/:id_usuario', (req, res) => {
  try {
    const { id_usuario } = req.params;

    const query = `
      SELECT 
        u.id_usuario,
        u.nome,
        u.email,
        u.foto_perfil,
        u.tipo_usuario,
        p.id_professor,
        a.id_aluno
      FROM Usuario u
      LEFT JOIN Professor p ON u.id_usuario = p.id_usuario
      LEFT JOIN Aluno a ON u.id_usuario = a.id_usuario
      WHERE u.id_usuario = ?
    `;

    db.query(query, [id_usuario], (err, results) => {
      if (err) {
        console.error('Erro ao buscar perfil:', err);
        return res.json({ success: false, message: 'Erro ao buscar perfil' });
      }

      if (results.length === 0) {
        return res.json({ success: false, message: 'Usuário não encontrado' });
      }

      res.json({
        success: true,
        usuario: results[0]
      });
    });

  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.json({ success: false, message: 'Erro interno do servidor' });
  }
});

app.put('/api/perfil/:id_usuario', (req, res) => {
  try {
    const { id_usuario } = req.params;
    const { nome, email } = req.body;

    if (!nome || !email) {
      return res.json({ success: false, message: 'Nome e email são obrigatórios' });
    }

    const checkEmailQuery = 'SELECT id_usuario FROM Usuario WHERE email = ? AND id_usuario != ?';
    db.query(checkEmailQuery, [email, id_usuario], (err, results) => {
      if (err) {
        console.error('Erro ao verificar email:', err);
        return res.json({ success: false, message: 'Erro interno do servidor' });
      }

      if (results.length > 0) {
        return res.json({ success: false, message: 'Este email já está em uso' });
      }

      const updateQuery = 'UPDATE Usuario SET nome = ?, email = ? WHERE id_usuario = ?';
      db.query(updateQuery, [nome, email, id_usuario], (err, result) => {
        if (err) {
          console.error('Erro ao atualizar perfil:', err);
          return res.json({ success: false, message: 'Erro ao atualizar perfil' });
        }

        res.json({
          success: true,
          message: 'Perfil atualizado com sucesso!',
          usuario: { nome, email }
        });
      });
    });

  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.json({ success: false, message: 'Erro interno do servidor' });
  }
});

app.post('/api/perfil/:id_usuario/foto', upload.single('foto'), (req, res) => {
  try {
    const { id_usuario } = req.params;

    if (!req.file) {
      return res.json({ success: false, message: 'Nenhuma foto enviada' });
    }

    const foto_url = `/uploads/${req.file.filename}`;

    db.query('SELECT foto_perfil FROM Usuario WHERE id_usuario = ?', [id_usuario], (err, results) => {
      if (results.length > 0 && results[0].foto_perfil) {
        const oldPhotoPath = path.join(__dirname, results[0].foto_perfil);
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }

      const updateQuery = 'UPDATE Usuario SET foto_perfil = ? WHERE id_usuario = ?';
      db.query(updateQuery, [foto_url, id_usuario], (err, result) => {
        if (err) {
          console.error('Erro ao atualizar foto:', err);
          return res.json({ success: false, message: 'Erro ao atualizar foto' });
        }

        res.json({
          success: true,
          message: 'Foto atualizada com sucesso!',
          foto_url: foto_url
        });
      });
    });

  } catch (error) {
    console.error('Erro ao fazer upload de foto:', error);
    res.json({ success: false, message: 'Erro interno do servidor' });
  }
});

app.delete('/api/perfil/:id_usuario/foto', (req, res) => {
  try {
    const { id_usuario } = req.params;

    db.query('SELECT foto_perfil FROM Usuario WHERE id_usuario = ?', [id_usuario], (err, results) => {
      if (err || results.length === 0) {
        return res.json({ success: false, message: 'Erro ao buscar foto' });
      }

      const foto_perfil = results[0].foto_perfil;

      if (foto_perfil) {
        const filePath = path.join(__dirname, foto_perfil);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      db.query('UPDATE Usuario SET foto_perfil = NULL WHERE id_usuario = ?', [id_usuario], (err) => {
        if (err) {
          console.error('Erro ao remover foto:', err);
          return res.json({ success: false, message: 'Erro ao remover foto' });
        }

        res.json({
          success: true,
          message: 'Foto removida com sucesso!'
        });
      });
    });

  } catch (error) {
    console.error('Erro ao remover foto:', error);
    res.json({ success: false, message: 'Erro interno do servidor' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});