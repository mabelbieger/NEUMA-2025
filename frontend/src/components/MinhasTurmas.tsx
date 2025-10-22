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

export default function MinhasTurmas() {
  const navigate = useNavigate();
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [idProfessor, setIdProfessor] = useState<number | null>(null);

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

  const voltarPagina = () => {
    navigate('/home-professor');
  };

  const verAlunosTurma = (idTurma: number, nomeTurma: string) => {
    // Por enquanto, apenas uma mensagem
    // Quando você implementar a parte do aluno, essa função vai buscar os alunos da turma
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
              Gerencie suas turmas e compartilhe os códigos de acesso com seus alunos
            </p>
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
                          📋
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
                        👥 Ver Alunos
                      </button>
                      
                      <button
                        onClick={() => excluirTurma(turma.id_turma, turma.nome_turma)}
                        style={{
                          backgroundColor: '#dc2626',
                          color: 'white',
                          padding: '0.75rem 1rem',
                          borderRadius: '0.5rem',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}
                      >
                        🗑️ Excluir Turma
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