const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const port = 3001;

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuração do Multer para upload de arquivos
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
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
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

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

    console.log('=== DEBUG BACKEND LOGIN ===');
    console.log('Email recebido:', email);
    console.log('Senha recebida:', senha);
    console.log('Tamanho da senha recebida:', senha.length);

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
        console.log('Usuário não encontrado para o email:', email);
        return res.json({ success: false, message: 'Email não encontrado' });
      }

      const user = results[0];
      console.log('Usuário encontrado:', user.email);
      console.log('Senha no banco:', user.senha);
      console.log('Tamanho da senha no banco:', user.senha.length);
      console.log('Tipo:', user.tipo_usuario);

      try {
        let isValidPassword = false;

        console.log('=== DEBUG SENHA ===');
        console.log('Senha recebida:', `"${senha}"`);
        console.log('Senha no banco:', `"${user.senha}"`);
        console.log('É bcrypt?', user.senha.startsWith('$2'));

        if (user.senha && user.senha.startsWith('$2')) {
          console.log('Tentando comparação bcrypt...');
          isValidPassword = await bcrypt.compare(senha, user.senha);
          console.log('Resultado bcrypt.compare:', isValidPassword);
        } else {
          console.log('Tentando comparação texto simples...');
          isValidPassword = (senha === user.senha);
          console.log('Resultado comparação direta:', isValidPassword);
          
          if (isValidPassword) {
            console.log('Convertendo senha para bcrypt...');
            try {
              const hashedPassword = await bcrypt.hash(senha, 10);
              console.log('Novo hash gerado, tamanho:', hashedPassword.length);
              
              const updateQuery = 'UPDATE Usuario SET senha = ? WHERE id_usuario = ?';
              db.query(updateQuery, [hashedPassword, user.id_usuario], (updateErr) => {
                if (updateErr) {
                  console.error('Erro ao atualizar senha para bcrypt:', updateErr);
                } else {
                  console.log('Senha atualizada para bcrypt com sucesso');
                }
              });
            } catch (hashError) {
              console.error('Erro ao gerar hash bcrypt:', hashError);
            }
          }
        }
       
        if (!isValidPassword) {
          console.log('Senha incorreta para usuário:', user.email);
          console.log('Esperado:', user.senha);
          console.log('Recebido:', senha);
          return res.json({ success: false, message: 'Senha incorreta' });
        }

        // ====== CORREÇÃO APLICADA AQUI ======
        const responseUser = {
          id: user.id_usuario,
          nome: user.nome,
          email: user.email,
          tipo: user.tipo_usuario,
          tipo_usuario: user.tipo_usuario  // ← LINHA ADICIONADA
        };

        if (user.tipo_usuario === 'Professor' && user.id_professor) {
          responseUser.id_professor = user.id_professor;
        }
        if (user.tipo_usuario === 'Aluno' && user.id_aluno) {
          responseUser.id_aluno = user.id_aluno;
        }

        console.log('Login bem-sucedido para:', email);
        console.log('Dados do usuário retornados:', responseUser);  // ← LOG ADICIONADO
        
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


app.post('/api/turmas', (req, res) => {
  try {
    const { id_professor, nome_turma, codigo_acesso } = req.body;

    console.log('=== CRIANDO TURMA ===');
    console.log('ID Professor:', id_professor);
    console.log('Nome da Turma:', nome_turma);
    console.log('Código de Acesso:', codigo_acesso);

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
        console.log('Professor não encontrado com ID:', id_professor);
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

          console.log('Turma criada com sucesso! ID:', result.insertId);
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
   
    console.log('=== SALVANDO TESTE VARK ===');
    console.log('User ID:', userId);
    console.log('Scores:', scores);

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

    console.log('Categoria dominante:', categoriaDominante);

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


app.post('/api/recuperar-senha', async (req, res) => {
  try {
    const { email } = req.body;

    console.log('=== SOLICITAÇÃO DE RECUPERAÇÃO DE SENHA ===');
    console.log('Email:', email);

    if (!email) {
      return res.json({ success: false, message: 'Email é obrigatório' });
    }

    const checkEmailQuery = 'SELECT id_usuario, nome FROM Usuario WHERE email = ?';
    db.query(checkEmailQuery, [email], (err, results) => {
      if (err) {
        console.error('Erro ao verificar email:', err);
        return res.json({ success: false, message: 'Erro interno do servidor' });
      }

      if (results.length === 0) {
        console.log('Email não encontrado:', email);
        return res.json({ success: false, message: 'Email não encontrado' });
      }

      const user = results[0];
   
      console.log('Email de recuperação seria enviado para:', email);
      console.log('Usuário:', user.nome);
      
      res.json({
        success: true,
        message: 'Email de recuperação enviado com sucesso! Verifique sua caixa de entrada.'
      });
    });

  } catch (error) {
    console.error('Erro na recuperação de senha:', error);
    res.json({ success: false, message: 'Erro interno do servidor' });
  }
});

app.get('/api/turmas/professor/:id_professor', (req, res) => {
  try {
    const { id_professor } = req.params;

    console.log('=== LISTANDO TURMAS DO PROFESSOR ===');
    console.log('ID Professor:', id_professor);

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

      console.log(`Encontradas ${results.length} turmas`);
      
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

    console.log('=== EXCLUINDO TURMA ===');
    console.log('ID Turma:', id_turma);

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

      console.log('Turma excluída com sucesso!');
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

    console.log('=== ATUALIZANDO TURMA ===');
    console.log('ID Turma:', id_turma);
    console.log('Novo nome:', nome_turma);
    console.log('Novo código:', codigo_acesso);

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

        console.log('Turma atualizada com sucesso!');
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

    console.log('=== BUSCANDO ID_PROFESSOR ===');
    console.log('ID Usuario:', id_usuario);

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
        console.log('Professor não encontrado para id_usuario:', id_usuario);
        return res.json({ success: false, message: 'Professor não encontrado' });
      }

      const professor = results[0];
      console.log('Professor encontrado:', professor);

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

// ==================== ROTAS DE ATIVIDADES ====================

// Criar atividade com upload de arquivo
app.post('/api/atividades', upload.single('arquivo'), async (req, res) => {
  try {
    const { id_professor, titulo, descricao, id_categoria, tipo_conteudo, conteudo_texto, turmas_ids } = req.body;

    console.log('=== CRIANDO ATIVIDADE ===');
    console.log('Professor:', id_professor);
    console.log('Título:', titulo);
    console.log('Categoria:', id_categoria);
    console.log('Tipo:', tipo_conteudo);
    console.log('Turmas:', turmas_ids);

    if (!id_professor || !titulo || !id_categoria || !tipo_conteudo) {
      return res.json({ 
        success: false, 
        message: 'Campos obrigatórios faltando' 
      });
    }

    let conteudo = conteudo_texto || '';
    let nome_arquivo = null;

    // Se enviou arquivo
    if (req.file) {
      conteudo = `/uploads/${req.file.filename}`;
      nome_arquivo = req.file.originalname;
    }

    // Inserir atividade
    const insertAtividadeQuery = `
      INSERT INTO Atividade 
      (id_professor, titulo, descricao, id_categoria, tipo_conteudo, conteudo, nome_arquivo) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      insertAtividadeQuery, 
      [id_professor, titulo, descricao, id_categoria, tipo_conteudo, conteudo, nome_arquivo],
      (err, result) => {
        if (err) {
          console.error('Erro ao inserir atividade:', err);
          return res.json({ success: false, message: 'Erro ao criar atividade' });
        }

        const id_atividade = result.insertId;

        // Se tem turmas, associar
        if (turmas_ids && turmas_ids.length > 0) {
          const turmasArray = JSON.parse(turmas_ids);
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

// Listar atividades do professor
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

// Listar atividades de uma turma por categoria
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

// Excluir atividade
app.delete('/api/atividades/:id_atividade', (req, res) => {
  try {
    const { id_atividade } = req.params;

    // Primeiro, buscar o arquivo para deletar
    db.query('SELECT conteudo, tipo_conteudo FROM Atividade WHERE id_atividade = ?', [id_atividade], (err, results) => {
      if (err || results.length === 0) {
        return res.json({ success: false, message: 'Atividade não encontrada' });
      }

      const atividade = results[0];

      // Se tem arquivo, deletar do sistema
      if (atividade.conteudo && atividade.conteudo.startsWith('/uploads/')) {
        const filePath = path.join(__dirname, atividade.conteudo);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      // Deletar registros relacionados e a atividade
      db.query('DELETE FROM Turma_Atividade WHERE id_atividade = ?', [id_atividade], (err) => {
        if (err) console.error('Erro ao deletar relacionamentos:', err);

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

// Configurar permissão de visualização de outras categorias na turma
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

// Buscar configuração da turma
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

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});