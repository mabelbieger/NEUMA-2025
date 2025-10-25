import React, { useState, useEffect } from 'react';
import { Eye, Headphones, BookOpen, Hand, Home, AlertCircle, Users, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserData {
  id_aluno: number;
  id_usuario: number;
  id_categoria: number;
  nome: string;
  email: string;
  nome_categoria: string;
  teste_realizado: boolean;
  pontuacao_visual: number;
  pontuacao_auditivo: number;
  pontuacao_cinestesico: number;
  pontuacao_leitura_escrita: number;
}

interface Turma {
  id_turma: number;
  nome_turma: string;
  codigo_acesso: string;
  data_criacao: string;
}

interface Atividade {
  id_atividade: number;
  titulo: string;
  descricao: string;
  id_categoria: number;
  tipo_conteudo: string;
  conteudo: string;
  nome_arquivo: string;
  data_criacao: string;
  nome_categoria: string;
  nome_turma: string;
}

export default function Personalizada() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAtividade, setSelectedAtividade] = useState<number | null>(null);

  useEffect(() => {
    loadUserDataAndActivities();
  }, []);

  const loadUserDataAndActivities = async () => {
    try {
      setLoading(true);
      const loggedUserData = localStorage.getItem('loggedUser');
      if (!loggedUserData) {
        setError('Usuário não encontrado. Faça login novamente.');
        setLoading(false);
        return;
      }

      const user = JSON.parse(loggedUserData);
      console.log('Carregando dados para usuário:', user);

      const alunoResponse = await fetch(`http://localhost:3001/api/aluno/${user.id}`);
      const alunoData = await alunoResponse.json();

      console.log('Resposta dados aluno:', alunoData);

      if (!alunoData.success) {
        setError('Erro ao carregar dados do aluno: ' + (alunoData.message || 'Erro desconhecido'));
        setLoading(false);
        return;
      }

      setUserData(alunoData.aluno);

      const turmasResponse = await fetch(`http://localhost:3001/api/aluno/${user.id}/turmas`);
      const turmasData = await turmasResponse.json();

      console.log('Resposta turmas:', turmasData);

      if (turmasData.success && turmasData.turmas.length > 0) {
        setTurmas(turmasData.turmas);

        const todasAtividades: Atividade[] = [];
        
        for (const turma of turmasData.turmas) {
          try {
            const atividadesResponse = await fetch(
              `http://localhost:3001/api/atividades/turma/${turma.id_turma}/categoria/${alunoData.aluno.id_categoria}`
            );
            const atividadesData = await atividadesResponse.json();
            
            console.log(`Atividades para turma ${turma.nome_turma}:`, atividadesData);
            
            if (atividadesData.success && atividadesData.atividades) {
              const atividadesComTurma = atividadesData.atividades.map((atividade: any) => ({
                ...atividade,
                nome_turma: turma.nome_turma
              }));
              todasAtividades.push(...atividadesComTurma);
            }
          } catch (error) {
            console.error(`Erro ao buscar atividades da turma ${turma.id_turma}:`, error);
          }
        }
        
        setAtividades(todasAtividades);
        console.log('Todas atividades carregadas:', todasAtividades);
      } else {
        console.log('Aluno não está em nenhuma turma ou erro ao carregar turmas');
        setAtividades([]);
      }

      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar informações. Tente novamente.');
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/home');
  };

  const getCategoriaInfo = () => {
    if (!userData) return null;

    const categorias = {
      1: { 
        nome: 'Visual', 
        icon: Eye, 
        color: '#dc2626', 
        emoji: '👁️',
        descricao: 'Você aprende melhor através de imagens, gráficos e elementos visuais. Prefere materiais organizados visualmente com cores e diagramas.',
        dicas: [
          '📊 Use gráficos e diagramas',
          '🎨 Destaque informações com cores',
          '🧠 Crie mapas mentais',
          '📸 Utilize imagens e vídeos',
          '📐 Desenhe conceitos matemáticos'
        ]
      },
      2: { 
        nome: 'Auditivo', 
        icon: Headphones, 
        color: '#2563eb', 
        emoji: '🎧',
        descricao: 'Você aprende melhor ouvindo e discutindo. Prefere explicações verbais, discussões em grupo e áudios educativos.',
        dicas: [
          '🗣️ Discuta em grupo',
          '🎧 Ouça podcasts educativos',
          '📢 Leia em voz alta',
          '🎵 Use música para memorizar',
          '💬 Grave suas próprias explicações'
        ]
      },
      3: { 
        nome: 'Cinestésico', 
        icon: Hand, 
        color: '#9333ea', 
        emoji: '✋',
        descricao: 'Você aprende melhor através da prática e movimento. Prefere atividades hands-on e experiências interativas.',
        dicas: [
          '✋ Pratique exercícios',
          '🎯 Use materiais concretos',
          '🏃 Faça pausas ativas',
          '🔧 Construa modelos físicos',
          '🎪 Associe movimentos a conceitos'
        ]
      },
      4: { 
        nome: 'Leitura/Escrita', 
        icon: BookOpen, 
        color: '#16a34a', 
        emoji: '📖',
        descricao: 'Você aprende melhor lendo e escrevendo. Prefere textos, anotações detalhadas e materiais escritos.',
        dicas: [
          '📝 Faça anotações detalhadas',
          '📚 Leia textos completos',
          '✍️ Reescreva conceitos',
          '📓 Mantenha um diário de estudos',
          '📋 Crie listas e resumos'
        ]
      }
    };

    return categorias[userData.id_categoria as keyof typeof categorias] || categorias[1];
  };

  const renderConteudoAtividade = (atividade: Atividade) => {
    const getFileExtension = (filename: string) => {
      return filename?.split('.').pop()?.toLowerCase() || 'arquivo';
    };

    switch (atividade.tipo_conteudo) {
      case 'TEXTO':
        return (
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            lineHeight: '1.6',
            color: '#374151',
            border: '1px solid #e5e7eb'
          }}>
            <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{atividade.conteudo}</p>
          </div>
        );
      
      case 'IMAGEM':
        return (
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            textAlign: 'center',
            border: '1px solid #e5e7eb'
          }}>
            <img 
              src={`http://localhost:3001${atividade.conteudo}`}
              alt={atividade.titulo}
              style={{
                maxWidth: '100%',
                maxHeight: '400px',
                height: 'auto',
                borderRadius: '0.5rem'
              }}
            />
            {atividade.nome_arquivo && (
              <div style={{ marginTop: '1rem' }}>
                <a 
                  href={`http://localhost:3001${atividade.conteudo}`}
                  download={atividade.nome_arquivo}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: '#150B53',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                    fontSize: '0.875rem'
                  }}
                >
                  <Download size={16} />
                  Baixar Imagem
                </a>
              </div>
            )}
          </div>
        );
      
      case 'VIDEO':
        return (
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            border: '1px solid #e5e7eb'
          }}>
            <video 
              controls 
              style={{ 
                width: '100%', 
                maxHeight: '400px',
                borderRadius: '0.5rem',
                backgroundColor: '#000'
              }}
              src={`http://localhost:3001${atividade.conteudo}`}
            />
            {atividade.nome_arquivo && (
              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <a 
                  href={`http://localhost:3001${atividade.conteudo}`}
                  download={atividade.nome_arquivo}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: '#150B53',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                    fontSize: '0.875rem'
                  }}
                >
                  <Download size={16} />
                  Baixar Vídeo
                </a>
              </div>
            )}
          </div>
        );
      
      case 'AUDIO':
        return (
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            textAlign: 'center',
            border: '1px solid #e5e7eb'
          }}>
            <audio 
              controls 
              style={{ width: '100%', maxWidth: '400px' }}
              src={`http://localhost:3001${atividade.conteudo}`}
            />
            {atividade.nome_arquivo && (
              <div style={{ marginTop: '1rem' }}>
                <a 
                  href={`http://localhost:3001${atividade.conteudo}`}
                  download={atividade.nome_arquivo}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: '#150B53',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                    fontSize: '0.875rem'
                  }}
                >
                  <Download size={16} />
                  Baixar Áudio
                </a>
              </div>
            )}
          </div>
        );
      
      case 'PDF':
        return (
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            textAlign: 'center',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ 
                fontSize: '3rem',
                display: 'block',
                marginBottom: '0.5rem'
              }}>
                📄
              </span>
              <p style={{ margin: 0, color: '#6b7280' }}>
                {atividade.nome_arquivo || 'Documento PDF'}
              </p>
            </div>
            <a 
              href={`http://localhost:3001${atividade.conteudo}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#150B53',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontWeight: '500',
                marginRight: '0.5rem'
              }}
            >
              Abrir PDF
            </a>
            <a 
              href={`http://localhost:3001${atividade.conteudo}`}
              download={atividade.nome_arquivo}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#16a34a',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              <Download size={16} />
              Baixar
            </a>
          </div>
        );
      
      case 'LINK':
        return (
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            textAlign: 'center',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: '0.5rem' }}>🔗</span>
              <p style={{ margin: 0, color: '#6b7280' }}>Link externo</p>
            </div>
            <a 
              href={atividade.conteudo}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                backgroundColor: '#150B53',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              Acessar Link
            </a>
          </div>
        );
      
      default:
        return (
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            textAlign: 'center',
            border: '1px solid #e5e7eb',
            color: '#6b7280'
          }}>
            <p>Conteúdo não disponível para visualização</p>
            {atividade.nome_arquivo && (
              <a 
                href={`http://localhost:3001${atividade.conteudo}`}
                download={atividade.nome_arquivo}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#150B53',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none'
                }}
              >
                <Download size={16} />
                Baixar {getFileExtension(atividade.nome_arquivo).toUpperCase()}
              </a>
            )}
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            border: '4px solid #150B53',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#6b7280' }}>Carregando suas atividades personalizadas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f9fafb',
        padding: '1rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <AlertCircle style={{ width: '3rem', height: '3rem', color: '#dc2626', margin: '0 auto 1rem' }} />
          <p style={{ color: '#374151', marginBottom: '1rem' }}>{error}</p>
          <button
            onClick={handleBackToHome}
            style={{
              backgroundColor: '#150B53',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  const categoriaInfo = getCategoriaInfo();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <header style={{ backgroundColor: '#150B53', padding: '1.5rem 0' }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              onClick={handleBackToHome}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                fontSize: '1.5rem',
                padding: '0.5rem'
              }}
            >
              ← 
            </button>

            <h1 style={{
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              margin: 0,
              textAlign: 'center',
              flex: 1
            }}>
              Sistema {categoriaInfo?.nome}
            </h1>

            <div>
              <img 
                src="/imagens/logo.png" 
                alt="Logo" 
                style={{ 
                  width: '3rem', 
                  height: '3rem',
                  objectFit: 'contain'
                }} 
              />
            </div>
          </div>
        </div>
      </header>

      <main style={{ padding: '2rem 1rem' }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
          
          {/* Info do Usuário */}
          <div style={{
            backgroundColor: '#CED0FF',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              backgroundColor: '#150B53',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              fontSize: '1.125rem',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '1rem'
            }}>
              {userData?.nome}
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '2rem',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>
                <span style={{ fontSize: '1.25rem' }}>{categoriaInfo?.emoji}</span>
                <span>Sistema {categoriaInfo?.nome}</span>
              </div>

              {turmas.length > 0 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '2rem',
                  fontSize: '0.875rem'
                }}>
                  <Users size={16} />
                  <span>{turmas.length} turma(s)</span>
                </div>
              )}
            </div>
          </div>

          {/* Descrição do Sistema */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '4rem',
              marginBottom: '1rem'
            }}>
              {categoriaInfo?.emoji}
            </div>
            
            <h2 style={{
              color: '#150B53',
              fontSize: '1.75rem',
              fontWeight: 'bold',
              marginBottom: '1rem'
            }}>
              Aprendizagem {categoriaInfo?.nome}
            </h2>
            
            <p style={{
              color: '#374151',
              lineHeight: '1.6',
              fontSize: '1rem',
              maxWidth: '48rem',
              margin: '0 auto'
            }}>
              {categoriaInfo?.descricao}
            </p>
          </div>

          {/* Atividades */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{
              color: '#150B53',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              📚 Atividades para seu Estilo de Aprendizagem
            </h3>

            {atividades.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem 1rem',
                color: '#6b7280'
              }}>
                <BookOpen style={{ width: '4rem', height: '4rem', margin: '0 auto 1rem', opacity: 0.5 }} />
                <p style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                  {turmas.length === 0 ? 'Você não está em nenhuma turma' : 'Nenhuma atividade disponível'}
                </p>
                <p style={{ fontSize: '0.875rem' }}>
                  {turmas.length === 0 
                    ? 'Entre em uma turma para ver atividades personalizadas' 
                    : 'Seu professor ainda não adicionou atividades para seu estilo de aprendizagem'
                  }
                </p>
              </div>
            ) : (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                {atividades.map((atividade) => (
                  <div key={atividade.id_atividade}>
                    <button
                      onClick={() => setSelectedAtividade(
                        selectedAtividade === atividade.id_atividade ? null : atividade.id_atividade
                      )}
                      style={{
                        width: '100%',
                        backgroundColor: selectedAtividade === atividade.id_atividade ? '#150B53' : '#f8fafc',
                        color: selectedAtividade === atividade.id_atividade ? 'white' : '#150B53',
                        border: '2px solid #150B53',
                        borderRadius: '0.75rem',
                        padding: '1.5rem',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.3s ease',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem', flex: 1 }}>
                        <span>{atividade.titulo}</span>
                        <div style={{ 
                          display: 'flex',
                          gap: '1rem',
                          fontSize: '0.75rem',
                          opacity: 0.8,
                          fontWeight: 'normal',
                          flexWrap: 'wrap'
                        }}>
                          <span>Turma: {atividade.nome_turma}</span>
                          <span>Tipo: {atividade.tipo_conteudo}</span>
                          <span>
                            {new Date(atividade.data_criacao).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                      <span style={{ 
                        transform: selectedAtividade === atividade.id_atividade ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease',
                        fontSize: '0.875rem'
                      }}>
                        ▼
                      </span>
                    </button>

                    {selectedAtividade === atividade.id_atividade && (
                      <div style={{
                        backgroundColor: '#f8fafc',
                        borderRadius: '0 0 0.75rem 0.75rem',
                        padding: '2rem',
                        marginTop: '-1rem',
                        border: '2px solid #150B53',
                        borderTop: 'none',
                        animation: 'fadeIn 0.3s ease-in'
                      }}>
                        {atividade.descricao && (
                          <div style={{
                            color: '#374151',
                            marginBottom: '1.5rem',
                            padding: '1rem',
                            backgroundColor: 'white',
                            borderRadius: '0.5rem',
                            borderLeft: '4px solid #150B53'
                          }}>
                            <strong style={{ display: 'block', marginBottom: '0.5rem' }}>Descrição:</strong>
                            {atividade.descricao}
                          </div>
                        )}
                        
                        <div style={{ marginBottom: '1.5rem' }}>
                          <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#150B53' }}>
                            Conteúdo:
                          </strong>
                          {renderConteudoAtividade(atividade)}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dicas de Estudo */}
          {categoriaInfo && (
            <div style={{
              backgroundColor: '#150B53',
              color: 'white',
              borderRadius: '0.75rem',
              padding: '2rem',
              textAlign: 'center'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '1.5rem'
              }}>
                💡 Dicas para seu Estilo de Aprendizagem
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem',
                marginTop: '1.5rem'
              }}>
                {categoriaInfo.dicas.map((dica, index) => (
                  <div key={index} style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                    padding: '1rem', 
                    borderRadius: '0.5rem',
                    textAlign: 'left'
                  }}>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>{dica}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}