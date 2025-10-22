import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

interface Turma {
  id_turma: number;
  nome_turma: string;
  codigo_acesso: string;
  data_criacao: string;
}

interface Categoria {
  id_categoria: number;
  nome_categoria: string;
  cor: string;
  label: string;
}

interface Atividade {
  id_atividade: number;
  titulo: string;
  descricao: string;
  id_categoria: number;
  tipo_conteudo: string;
  conteudo: string;
  nome_arquivo: string;
  turmas: string;
  data_criacao: string;
}

export default function MinhasTurmas() {
  const navigate = useNavigate();
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [idProfessor, setIdProfessor] = useState<number | null>(null);
  
  // Estados para atividades
  const [showModalAtividade, setShowModalAtividade] = useState(false);
  const [showListaAtividades, setShowListaAtividades] = useState(false);
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [isLoadingAtividades, setIsLoadingAtividades] = useState(false);
  
  const [categorias] = useState<Categoria[]>([
    { id_categoria: 1, nome_categoria: 'visual', cor: '#3B82F6', label: 'Visual' },
    { id_categoria: 2, nome_categoria: 'auditivo', cor: '#10B981', label: 'Auditivo' },
    { id_categoria: 3, nome_categoria: 'cinestesico', cor: '#F59E0B', label: 'Cinestésico' },
    { id_categoria: 4, nome_categoria: 'leitura_escrita', cor: '#8B5CF6', label: 'Leitura/Escrita' }
  ]);

  const [novaAtividade, setNovaAtividade] = useState({
    titulo: '',
    descricao: '',
    id_categoria: 0,
    tipo_conteudo: 'TEXTO',
    conteudo_texto: '',
    arquivo: null as File | null,
    turmas_selecionadas: [] as number[]
  });

  useEffect(() => {
    const loggedUser = localStorage.getItem('loggedUser');
    
    if (!loggedUser) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(loggedUser);
    
    if (user.tipo !== 'Professor' && user.tipo_usuario !== 'Professor') {
      alert('Acesso restrito a professores');
      navigate('/home');
      return;
    }

    if (user.id_professor) {
      setIdProfessor(user.id_professor);
      carregarTurmas(user.id_professor);
    } else if (user.id) {
      buscarIdProfessor(user.id);
    }
  }, [navigate]);

  const buscarIdProfessor = async (idUsuario: number) => {
    try {
      const response = await axios.get(`${API_URL}/professor/${idUsuario}`);
      
      if (response.data.success) {
        setIdProfessor(response.data.id_professor);
        carregarTurmas(response.data.id_professor);
        
        const loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');
        loggedUser.id_professor = response.data.id_professor;
        localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
      }
    } catch (error) {
      console.error('Erro ao buscar id_professor:', error);
      setIsLoading(false);
    }
  };

  const carregarTurmas = async (id_prof: number) => {
    try {
      const response = await axios.get(`${API_URL}/turmas/professor/${id_prof}`);

      if (response.data.success) {
        setTurmas(response.data.turmas);
      } else {
        console.error('Erro ao carregar turmas:', response.data.message);
      }
    } catch (error) {
      console.error('Erro ao carregar turmas:', error);
      alert('Erro ao carregar turmas');
    } finally {
      setIsLoading(false);
    }
  };

  const carregarAtividades = async () => {
    if (!idProfessor) return;

    setIsLoadingAtividades(true);
    try {
      const response = await axios.get(`${API_URL}/atividades/professor/${idProfessor}`);

      if (response.data.success) {
        setAtividades(response.data.atividades);
      }
    } catch (error) {
      console.error('Erro ao carregar atividades:', error);
    } finally {
      setIsLoadingAtividades(false);
    }
  };

  const voltarPagina = () => {
    navigate('/home-professor');
  };

  const verAlunosTurma = (idTurma: number, nomeTurma: string) => {
    alert(`Funcionalidade "Ver Alunos" será implementada quando a parte do aluno estiver pronta.\n\nTurma: ${nomeTurma}`);
  };

  const excluirTurma = async (idTurma: number, nomeTurma: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir a turma "${nomeTurma}"?\n\nEsta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      const response = await axios.delete(`${API_URL}/turmas/${idTurma}`);

      if (response.data.success) {
        alert('Turma excluída com sucesso!');
        setTurmas(turmas.filter(t => t.id_turma !== idTurma));
      } else {
        alert(response.data.message || 'Erro ao excluir turma');
      }
    } catch (error: any) {
      console.error('Erro ao excluir turma:', error);
      alert(error.response?.data?.message || 'Erro ao excluir turma');
    }
  };

  const copiarCodigo = (codigo: string) => {
    navigator.clipboard.writeText(codigo).then(() => {
      alert('Código copiado para a área de transferência! ✓');
    }).catch(() => {
      alert('Erro ao copiar código');
    });
  };

  const abrirModalAtividade = () => {
    setNovaAtividade({
      titulo: '',
      descricao: '',
      id_categoria: 0,
      tipo_conteudo: 'TEXTO',
      conteudo_texto: '',
      arquivo: null,
      turmas_selecionadas: []
    });
    setShowModalAtividade(true);
  };

  const toggleTurmaSelecionada = (idTurma: number) => {
    setNovaAtividade(prev => {
      const turmas = prev.turmas_selecionadas.includes(idTurma)
        ? prev.turmas_selecionadas.filter(id => id !== idTurma)
        : [...prev.turmas_selecionadas, idTurma];
      return { ...prev, turmas_selecionadas: turmas };
    });
  };

  const handleArquivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNovaAtividade(prev => ({ ...prev, arquivo: file }));
    }
  };

  const handleCriarAtividade = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!idProfessor || !novaAtividade.titulo || !novaAtividade.id_categoria) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    if (novaAtividade.tipo_conteudo !== 'TEXTO' && !novaAtividade.arquivo) {
      alert('Por favor, selecione um arquivo!');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('id_professor', idProfessor.toString());
      formData.append('titulo', novaAtividade.titulo);
      formData.append('descricao', novaAtividade.descricao);
      formData.append('id_categoria', novaAtividade.id_categoria.toString());
      formData.append('tipo_conteudo', novaAtividade.tipo_conteudo);
      formData.append('turmas_ids', JSON.stringify(novaAtividade.turmas_selecionadas));

      if (novaAtividade.tipo_conteudo === 'TEXTO') {
        formData.append('conteudo_texto', novaAtividade.conteudo_texto);
      } else if (novaAtividade.arquivo) {
        formData.append('arquivo', novaAtividade.arquivo);
      }

      const response = await axios.post(`${API_URL}/atividades`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        alert('Atividade criada com sucesso!');
        setShowModalAtividade(false);
        carregarAtividades();
      } else {
        alert(response.data.message || 'Erro ao criar atividade');
      }
    } catch (error) {
      console.error('Erro ao criar atividade:', error);
      alert('Erro ao criar atividade');
    }
  };

  const excluirAtividade = async (idAtividade: number, titulo: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir a atividade "${titulo}"?`)) {
      return;
    }

    try {
      const response = await axios.delete(`${API_URL}/atividades/${idAtividade}`);

      if (response.data.success) {
        alert('Atividade excluída com sucesso!');
        carregarAtividades();
      } else {
        alert(response.data.message || 'Erro ao excluir atividade');
      }
    } catch (error) {
      console.error('Erro ao excluir atividade:', error);
      alert('Erro ao excluir atividade');
    }
  };

  const abrirListaAtividades = () => {
    setShowListaAtividades(true);
    carregarAtividades();
  };

  const getCategoriaCor = (idCategoria: number) => {
    const cat = categorias.find(c => c.id_categoria === idCategoria);
    return cat?.cor || '#666';
  };

  const getCategoriaLabel = (idCategoria: number) => {
    const cat = categorias.find(c => c.id_categoria === idCategoria);
    return cat?.label || 'Desconhecido';
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <header style={{ backgroundColor: '#150B53', padding: '2rem 0' }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              onClick={voltarPagina}
              style={{
                backgroundColor: 'transparent',
                border: '2px solid white',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              ← Voltar
            </button>
            
            <div style={{ textAlign: 'center' }}>
              <img 
                src="/imagens/logo.png" 
                alt="Logo" 
                style={{ 
                  width: '8rem', 
                  height: '8rem', 
                  margin: '0 auto', 
                  display: 'block',
                  objectFit: 'contain'
                }} 
              />
            </div>
            
            <div style={{ width: '120px' }}></div>
          </div>
        </div>
      </header>

      <main style={{ padding: '3rem 0' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{
              fontSize: '2.25rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '1rem'
            }}>
              Minhas Turmas
            </h1>
            <p style={{
              color: '#374151',
              fontSize: '1.1rem',
              maxWidth: '48rem',
              margin: '0 auto'
            }}>
              Gerencie suas turmas e crie atividades personalizadas
            </p>
          </div>

          {/* Botões de ação */}
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'center', 
            marginBottom: '3rem',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={abrirModalAtividade}
              style={{
                backgroundColor: '#000000ff',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              ➕ Criar Nova Atividade
            </button>

            <button
              onClick={abrirListaAtividades}
              style={{
                backgroundColor: '#5e19ffff',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              Ver Todas as Atividades
            </button>
          </div>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ fontSize: '1.1rem', color: '#666' }}>Carregando turmas...</p>
            </div>
          ) : turmas.length === 0 ? (
            <div style={{
              backgroundColor: 'white',
              padding: '3rem',
              borderRadius: '1rem',
              textAlign: 'center',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '1rem'
              }}>
                Nenhuma turma encontrada
              </h3>
              <p style={{ color: '#666', marginBottom: '2rem' }}>
                Você ainda não criou nenhuma turma. Que tal criar a primeira?
              </p>
              <button
                onClick={() => navigate('/home-professor')}
                style={{
                  backgroundColor: '#150B53',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}
              >
                Criar Nova Turma
              </button>
            </div>
          ) : (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '2rem'
              }}>
                {turmas.map((turma) => (
                  <div
                    key={turma.id_turma}
                    style={{
                      backgroundColor: 'white',
                      padding: '2rem',
                      borderRadius: '1rem',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h3 style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: '#111827',
                        marginBottom: '0.5rem'
                      }}>
                        {turma.nome_turma}
                      </h3>
                      
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '1rem'
                      }}>
                        <span style={{
                          fontSize: '0.875rem',
                          color: '#666',
                          fontWeight: '500'
                        }}>
                          Código:
                        </span>
                        <code style={{
                          backgroundColor: '#CED0FF',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.875rem',
                          fontWeight: 'bold',
                          color: '#150B53'
                        }}>
                          {turma.codigo_acesso}
                        </code>
                        <button
                          onClick={() => copiarCodigo(turma.codigo_acesso)}
                          style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.25rem',
                            color: '#666',
                            fontSize: '1.2rem'
                          }}
                          title="Copiar código"
                        >
                          🗐
                        </button>
                      </div>

                      <p style={{
                        fontSize: '0.875rem',
                        color: '#666'
                      }}>
                        Criada em: {new Date(turma.data_criacao).toLocaleDateString('pt-BR')}
                      </p>
                    </div>

                    <div style={{
                      display: 'flex',
                      gap: '0.75rem',
                      flexDirection: 'column'
                    }}>
                      <button
                        onClick={() => verAlunosTurma(turma.id_turma, turma.nome_turma)}
                        style={{
                          backgroundColor: '#150B53',
                          color: 'white',
                          padding: '0.75rem 1rem',
                          borderRadius: '0.5rem',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}
                      >
                        Ver Alunos
                      </button>
                      
                      <button
                        onClick={() => excluirTurma(turma.id_turma, turma.nome_turma)}
                        style={{
                          backgroundColor: '#b80000ff',
                          color: 'white',
                          padding: '0.75rem 1rem',
                          borderRadius: '0.5rem',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}
                      >
                        Excluir Turma
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <button
                  onClick={() => navigate('/home-professor')}
                  style={{
                    backgroundColor: '#CED0FF',
                    color: '#150B53',
                    padding: '0.75rem 2rem',
                    borderRadius: '0.5rem',
                    border: '2px solid #150B53',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600'
                  }}
                >
                  + Criar Nova Turma
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Modal - Criar Atividade */}
      {showModalAtividade && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          overflowY: 'auto',
          padding: '2rem 0'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            width: '90%',
            maxWidth: '600px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#111827',
                margin: 0
              }}>
                Criar Nova Atividade
              </h2>
              <button
                onClick={() => setShowModalAtividade(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#666',
                  padding: '0.25rem'
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCriarAtividade}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Título da Atividade *
                </label>
                <input
                  type="text"
                  value={novaAtividade.titulo}
                  onChange={(e) => setNovaAtividade(prev => ({ ...prev, titulo: e.target.value }))}
                  required
                  placeholder="Ex: Equações do 2º Grau"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #CED0FF',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Descrição
                </label>
                <textarea
                  value={novaAtividade.descricao}
                  onChange={(e) => setNovaAtividade(prev => ({ ...prev, descricao: e.target.value }))}
                  placeholder="Descreva a atividade..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #CED0FF',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Perfil Sensorial *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {categorias.map(cat => (
                    <button
                      key={cat.id_categoria}
                      type="button"
                      onClick={() => setNovaAtividade(prev => ({ ...prev, id_categoria: cat.id_categoria }))}
                      style={{
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: `2px solid ${cat.cor}`,
                        backgroundColor: novaAtividade.id_categoria === cat.id_categoria ? cat.cor : 'white',
                        color: novaAtividade.id_categoria === cat.id_categoria ? 'white' : cat.cor,
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.875rem'
                      }}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Tipo de Conteúdo *
                </label>
                <select
                  value={novaAtividade.tipo_conteudo}
                  onChange={(e) => setNovaAtividade(prev => ({ ...prev, tipo_conteudo: e.target.value, arquivo: null }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #CED0FF',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="TEXTO">Texto</option>
                  <option value="PDF">PDF</option>
                  <option value="IMAGEM">Imagem</option>
                  <option value="VIDEO">Vídeo</option>
                  <option value="AUDIO">Áudio</option>
                  <option value="LINK">Link Externo</option>
                </select>
              </div>

              {novaAtividade.tipo_conteudo === 'TEXTO' ? (
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    Conteúdo do Texto *
                  </label>
                  <textarea
                    value={novaAtividade.conteudo_texto}
                    onChange={(e) => setNovaAtividade(prev => ({ ...prev, conteudo_texto: e.target.value }))}
                    required
                    placeholder="Digite o conteúdo da atividade..."
                    rows={6}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #CED0FF',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      outline: 'none',
                      resize: 'vertical',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              ) : novaAtividade.tipo_conteudo === 'LINK' ? (
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    URL do Link *
                  </label>
                  <input
                    type="url"
                    value={novaAtividade.conteudo_texto}
                    onChange={(e) => setNovaAtividade(prev => ({ ...prev, conteudo_texto: e.target.value }))}
                    required
                    placeholder="https://exemplo.com"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #CED0FF',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              ) : (
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    Arquivo * ({novaAtividade.tipo_conteudo})
                  </label>
                  <input
                    type="file"
                    onChange={handleArquivoChange}
                    required
                    accept={
                      novaAtividade.tipo_conteudo === 'PDF' ? '.pdf' :
                      novaAtividade.tipo_conteudo === 'IMAGEM' ? '.jpg,.jpeg,.png,.gif' :
                      novaAtividade.tipo_conteudo === 'VIDEO' ? '.mp4,.avi,.mov' :
                      novaAtividade.tipo_conteudo === 'AUDIO' ? '.mp3,.wav,.ogg' : '*'
                    }
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #CED0FF',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                  />
                  {novaAtividade.arquivo && (
                    <p style={{ marginTop: '0.5rem', color: '#059669', fontSize: '0.875rem' }}>
                      ✓ Arquivo: {novaAtividade.arquivo.name}
                    </p>
                  )}
                </div>
              )}

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Selecione as Turmas (opcional)
                </label>
                <div style={{ 
                  maxHeight: '150px', 
                  overflowY: 'auto', 
                  border: '2px solid #CED0FF', 
                  borderRadius: '0.5rem', 
                  padding: '0.5rem' 
                }}>
                  {turmas.map(turma => (
                    <label
                      key={turma.id_turma}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.5rem',
                        cursor: 'pointer',
                        borderRadius: '0.25rem',
                        marginBottom: '0.25rem',
                        backgroundColor: novaAtividade.turmas_selecionadas.includes(turma.id_turma) ? '#f0f9ff' : 'transparent'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={novaAtividade.turmas_selecionadas.includes(turma.id_turma)}
                        onChange={() => toggleTurmaSelecionada(turma.id_turma)}
                        style={{ marginRight: '0.5rem' }}
                      />
                      <span style={{ fontSize: '0.875rem' }}>{turma.nome_turma}</span>
                    </label>
                  ))}
                </div>
                <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.5rem' }}>
                  Você pode adicionar a atividade em várias turmas ao mesmo tempo
                </p>
              </div>

              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={() => setShowModalAtividade(false)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: '2px solid #CED0FF',
                    backgroundColor: 'white',
                    color: '#374151',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!novaAtividade.titulo || !novaAtividade.id_categoria}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: (!novaAtividade.titulo || !novaAtividade.id_categoria) ? '#cccccc' : '#059669',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: (!novaAtividade.titulo || !novaAtividade.id_categoria) ? 'not-allowed' : 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Criar Atividade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal - Lista de Atividades */}
      {showListaAtividades && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          overflowY: 'auto',
          padding: '2rem 0'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            width: '90%',
            maxWidth: '900px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#111827',
                margin: 0
              }}>
                Todas as Atividades
              </h2>
              <button
                onClick={() => setShowListaAtividades(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#666',
                  padding: '0.25rem'
                }}
              >
                ×
              </button>
            </div>

            {isLoadingAtividades ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p style={{ color: '#666' }}>Carregando atividades...</p>
              </div>
            ) : atividades.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <p style={{ color: '#666', fontSize: '1rem' }}>
                  Nenhuma atividade criada ainda.
                  <br />
                  Clique em "Criar Nova Atividade" para começar!
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {atividades.map(atividade => (
                  <div
                    key={atividade.id_atividade}
                    style={{
                      backgroundColor: '#f9fafb',
                      padding: '1.5rem',
                      borderRadius: '0.75rem',
                      border: '2px solid #e5e7eb'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{
                          fontSize: '1.25rem',
                          fontWeight: 'bold',
                          color: '#111827',
                          marginBottom: '0.5rem'
                        }}>
                          {atividade.titulo}
                        </h3>
                        {atividade.descricao && (
                          <p style={{
                            color: '#666',
                            fontSize: '0.875rem',
                            marginBottom: '0.75rem'
                          }}>
                            {atividade.descricao}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => excluirAtividade(atividade.id_atividade, atividade.titulo)}
                        style={{
                          backgroundColor: '#dc2626',
                          color: 'white',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.5rem',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          marginLeft: '1rem'
                        }}
                      >
                        Excluir
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                      <span style={{
                        backgroundColor: getCategoriaCor(atividade.id_categoria),
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        {getCategoriaLabel(atividade.id_categoria)}
                      </span>

                      <span style={{
                        backgroundColor: '#e5e7eb',
                        color: '#374151',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        {atividade.tipo_conteudo}
                      </span>
                    </div>

                    {atividade.nome_arquivo && (
                      <p style={{
                        color: '#059669',
                        fontSize: '0.875rem',
                        marginBottom: '0.5rem'
                      }}>
                        📎 {atividade.nome_arquivo}
                      </p>
                    )}

                    {atividade.turmas && (
                      <p style={{
                        color: '#666',
                        fontSize: '0.875rem',
                        marginBottom: '0.5rem'
                      }}>
                        <strong>Turmas:</strong> {atividade.turmas}
                      </p>
                    )}

                    <p style={{
                      color: '#999',
                      fontSize: '0.75rem'
                    }}>
                      Criada em: {new Date(atividade.data_criacao).toLocaleDateString('pt-BR')} às {new Date(atividade.data_criacao).toLocaleTimeString('pt-BR')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <footer style={{ backgroundColor: '#CED0FF', padding: '2rem 1rem', marginTop: '4rem' }}>
        <div style={{
          maxWidth: '72rem',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '3rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: '1 1 250px', minWidth: '250px' }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '1rem'
            }}>
              Contato
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#374151', lineHeight: '1.5' }}>
              <p><strong>Instagram:</strong><br />@projeto_neuma</p>
              <p><strong>E-mail:</strong><br />projetoneuma@gmail.com</p>
            </div>
          </div>

          <div style={{ flex: '1 1 250px', minWidth: '250px' }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '1rem'
            }}>
              Desenvolvedoras
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#374151', lineHeight: '1.5' }}>
              <p>Mariana Machado Welter <br /> Marina Isabel Bieger</p>
            </div>
          </div>

          <div style={{ flex: '0 0 auto', alignSelf: 'center' }}>
            <img
              src="/imagens/logo.png"
              alt="Logo"
              style={{
                width: '6rem',
                height: '6rem',
                objectFit: 'contain',
                display: 'block',
                margin: '0 auto'
              }}
            />
          </div>
        </div>
      </footer>
    </div>
  );
}