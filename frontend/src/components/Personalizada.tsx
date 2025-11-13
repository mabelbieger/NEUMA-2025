import React, { useState, useEffect } from 'react';
import { Eye, Headphones, BookOpen, Hand, Download, LogOut, Search, ArrowLeft } from 'lucide-react';
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
  foto_perfil?: string;
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
  const [searchTerm, setSearchTerm] = useState('');

  const getFotoPerfilUrl = (fotoPath?: string) => {
    if (!fotoPath) return null;
    if (fotoPath.startsWith('http')) {
      return fotoPath;
    }
    return `http://localhost:3001${fotoPath.startsWith('/') ? '' : '/'}${fotoPath}`;
  };

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

      const alunoResponse = await fetch(`http://localhost:3001/api/aluno/${user.id}`);
      const alunoData = await alunoResponse.json();

      if (!alunoData.success) {
        setError('Erro ao carregar dados do aluno: ' + (alunoData.message || 'Erro desconhecido'));
        setLoading(false);
        return;
      }

      setUserData(alunoData.aluno);

      const turmasResponse = await fetch(`http://localhost:3001/api/aluno/${user.id}/turmas`);
      const turmasData = await turmasResponse.json();

      if (turmasData.success && turmasData.turmas.length > 0) {
        setTurmas(turmasData.turmas);

        const todasAtividades: Atividade[] = [];
        
        for (const turma of turmasData.turmas) {
          try {
            const atividadesResponse = await fetch(
              `http://localhost:3001/api/atividades/turma/${turma.id_turma}/categoria/${alunoData.aluno.id_categoria}`
            );
            const atividadesData = await atividadesResponse.json();
            
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
      } else {
        setAtividades([]);
      }

      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar informações. Tente novamente.');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedUser');
    navigate('/login');
  };

  const handlePerfil = () => {
    navigate('/perfil-aluno');
  };

  const handleVoltar = () => {
    navigate('/home-aluno');
  };

  const getCategoriaInfo = () => {
    if (!userData) return null;

    const categorias = {
      1: { 
        nome: 'Visual', 
        icon: Eye, 
        color: '#dc2626', 
        descricao: 'Você aprende melhor através de imagens, gráficos e elementos visuais. Prefere materiais organizados visualmente com cores e diagramas.',
        dicas: [
          'Use gráficos e diagramas para organizar informações',
          'Destaque conteúdos importantes com cores diferentes',
          'Crie mapas mentais para conectar ideias',
          'Assista a vídeos educativos sobre os temas',
          'Use imagens e ilustrações para fixar conceitos'
        ]
      },
      2: { 
        nome: 'Auditivo', 
        icon: Headphones, 
        color: '#2563eb', 
        descricao: 'Você aprende melhor ouvindo e discutindo. Prefere explicações verbais, discussões em grupo e áudios educativos.',
        dicas: [
          'Participe de discussões em grupo sobre o conteúdo',
          'Ouça podcasts e gravações relacionadas aos temas',
          'Leia textos em voz alta para melhor compreensão',
          'Use músicas ou ritmos para memorizar informações',
          'Grave suas próprias explicações e escute depois'
        ]
      },
      3: { 
        nome: 'Cinestésico', 
        icon: Hand, 
        color: '#9333ea', 
        descricao: 'Você aprende melhor através da prática e movimento. Prefere atividades hands-on e experiências interativas.',
        dicas: [
          'Pratique exercícios e atividades físicas relacionadas',
          'Use materiais concretos para representar conceitos abstratos',
          'Faça pausas ativas durante os estudos',
          'Construa modelos físicos quando possível',
          'Associe movimentos corporais aos conceitos estudados'
        ]
      },
      4: { 
        nome: 'Leitura/Escrita', 
        icon: BookOpen, 
        color: '#16a34a', 
        descricao: 'Você aprende melhor lendo e escrevendo. Prefere textos, anotações detalhadas e materiais escritos.',
        dicas: [
          'Faça anotações detalhadas durante as aulas',
          'Leia textos complementares sobre os assuntos',
          'Reescreva conceitos com suas próprias palavras',
          'Mantenha um diário de estudos organizado',
          'Crie listas, resumos e esquemas escritos'
        ]
      }
    };

    return categorias[userData.id_categoria as keyof typeof categorias] || categorias[1];
  };

  const filteredAtividades = atividades.filter(atividade =>
    atividade.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    atividade.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    atividade.nome_turma.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <p style={{ color: '#374151', marginBottom: '1rem' }}>{error}</p>
          <button
            onClick={() => navigate('/home-aluno')}
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
  const fotoPerfilUrl = getFotoPerfilUrl(userData?.foto_perfil);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <header style={{ backgroundColor: '#150B53', padding: '1rem 0', position: 'relative', height: '80px' }}>
        <div style={{ position: 'absolute', left: '2rem', top: '50%', transform: 'translateY(-50%)' }}>
          <button
            onClick={handleVoltar}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid white',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem'
            }}
          >
            <ArrowLeft size={16} />
            Voltar
          </button>
        </div>

        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
          <img
            src="/imagens/logo.png"
            alt="Logo"
            style={{
              width: '6rem',
              height: '6rem',
              objectFit: 'contain'
            }}
          />
        </div>
        
        <div style={{ position: 'absolute', right: '2rem', top: '50%', transform: 'translateY(-50%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid white',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem'
              }}
            >
              <LogOut size={16} />
              Sair
            </button>

            <button
              onClick={handlePerfil}
              style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                backgroundColor: fotoPerfilUrl ? 'transparent' : '#CED0FF',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#150B53',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                overflow: 'hidden',
                padding: 0
              }}
            >
              {fotoPerfilUrl ? (
                <img 
                  src={fotoPerfilUrl}
                  alt="Foto do perfil"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%'
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '👤';
                    e.currentTarget.parentElement!.style.backgroundColor = '#CED0FF';
                  }}
                />
              ) : (
                '👤'
              )}
            </button>
          </div>
        </div>
      </header>

      <main style={{ padding: '2rem 1rem' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          
          <div style={{
            backgroundColor: '#CED0FF',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{
              color: '#150B53',
              fontSize: '1.125rem',
              fontWeight: 'bold',
              marginBottom: '0.5rem'
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
                color: '#150B53',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>
                <span>Sistema {categoriaInfo?.nome}</span>
              </div>

              {turmas.length > 0 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#150B53',
                  fontSize: '0.875rem'
                }}>
                  <span>Turma: {turmas[0].nome_turma}</span>
                </div>
              )}
            </div>
          </div>

          <div style={{
            backgroundColor: '#CED0FF',
            borderRadius: '0.75rem',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h2 style={{
              color: '#150B53',
              fontSize: '1.75rem',
              fontWeight: 'bold',
              marginBottom: '1rem'
            }}>
              Sistema {categoriaInfo?.nome}
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
              Atividades para seu Estilo de Aprendizagem
            </h3>

            <div style={{
              position: 'relative',
              marginBottom: '2rem',
              maxWidth: '500px',
              margin: '0 auto 2rem auto'
            }}>
              <Search style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6b7280',
                width: '1.25rem',
                height: '1.25rem'
              }} />
              <input
                type="text"
                placeholder="Pesquisar atividades por título, descrição ou turma..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 3rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '2rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  backgroundColor: '#f9fafb',
                  color: '#000'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#150B53';
                  e.target.style.backgroundColor = '#ffffff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.backgroundColor = '#f9fafb';
                }}
              />
            </div>

            {filteredAtividades.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem 1rem',
                color: '#6b7280'
              }}>
                <BookOpen style={{ width: '4rem', height: '4rem', margin: '0 auto 1rem', opacity: 0.5 }} />
                <p style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                  {atividades.length === 0 ? 'Nenhuma atividade disponível' : 'Nenhuma atividade encontrada'}
                </p>
                <p style={{ fontSize: '0.875rem' }}>
                  {atividades.length === 0 
                    ? 'Seu professor ainda não adicionou atividades para seu estilo de aprendizagem'
                    : 'Tente alterar os termos da pesquisa'
                  }
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.5rem'
              }}>
                {filteredAtividades.map((atividade) => (
                  <div 
                    key={atividade.id_atividade}
                    style={{
                      backgroundColor: '#f8fafc',
                      borderRadius: '0.75rem',
                      padding: '1.5rem',
                      border: '2px solid #e5e7eb',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      height: 'fit-content',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}
                    onClick={() => setSelectedAtividade(atividade.id_atividade)}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = '#150B53';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <h4 style={{
                      color: '#150B53',
                      fontSize: '1.125rem',
                      fontWeight: 'bold',
                      margin: 0,
                      lineHeight: '1.4'
                    }}>
                      {atividade.titulo}
                    </h4>
                    
                    <p style={{
                      color: '#374151',
                      fontSize: '0.875rem',
                      lineHeight: '1.5',
                      margin: 0,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      flex: 1
                    }}>
                      {atividade.descricao}
                    </p>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginTop: 'auto'
                    }}>
                      <span>Turma: {atividade.nome_turma}</span>
                      <span>
                        {new Date(atividade.data_criacao).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedAtividade && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '1rem'
            }}>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                padding: '2rem',
                maxWidth: '800px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                position: 'relative'
              }}>
                <button
                  onClick={() => setSelectedAtividade(null)}
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '2.5rem',
                    height: '2.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.125rem',
                    fontWeight: 'bold',
                    zIndex: 1001
                  }}
                >
                  ×
                </button>

                {(() => {
                  const atividade = atividades.find(a => a.id_atividade === selectedAtividade);
                  if (!atividade) return null;

                  return (
                    <>
                      <h3 style={{
                        color: '#150B53',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        marginBottom: '1rem',
                        paddingRight: '3rem'
                      }}>
                        {atividade.titulo}
                      </h3>

                      <div style={{
                        display: 'flex',
                        gap: '1rem',
                        marginBottom: '1.5rem',
                        fontSize: '0.875rem',
                        color: '#6b7280',
                        flexWrap: 'wrap'
                      }}>
                        <span>Turma: {atividade.nome_turma}</span>
                        <span>Tipo: {atividade.tipo_conteudo}</span>
                        <span>
                          {new Date(atividade.data_criacao).toLocaleDateString('pt-BR')}
                        </span>
                      </div>

                      {atividade.descricao && (
                        <div style={{
                          backgroundColor: '#f8fafc',
                          padding: '1rem',
                          borderRadius: '0.5rem',
                          marginBottom: '1.5rem',
                          borderLeft: '4px solid #150B53'
                        }}>
                          <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#150B53' }}>
                            Descrição:
                          </strong>
                          <p style={{ margin: 0, lineHeight: '1.6' }}>{atividade.descricao}</p>
                        </div>
                      )}

                      <div>
                        <strong style={{ display: 'block', marginBottom: '1rem', color: '#150B53' }}>
                          Conteúdo:
                        </strong>
                        {renderConteudoAtividade(atividade)}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}

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
                marginBottom: '2rem'
              }}>
                Estratégias de Estudo para {categoriaInfo.nome}
              </h3>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                alignItems: 'center'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '1rem',
                  width: '100%',
                  maxWidth: '800px'
                }}>
                  {categoriaInfo.dicas.slice(0, 3).map((dica, index) => (
                    <div key={index} style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.15)', 
                      padding: '1.5rem',
                      borderRadius: '0.75rem',
                      textAlign: 'center',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      minHeight: '100px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <p style={{ 
                        margin: 0, 
                        fontSize: '0.95rem',
                        lineHeight: '1.5',
                        fontWeight: '400'
                      }}>
                        {dica}
                      </p>
                    </div>
                  ))}
                </div>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '1rem',
                  width: '100%',
                  maxWidth: '600px'
                }}>
                  {categoriaInfo.dicas.slice(3, 5).map((dica, index) => (
                    <div key={index + 3} style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.15)', 
                      padding: '1.5rem',
                      borderRadius: '0.75rem',
                      textAlign: 'center',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      minHeight: '100px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <p style={{ 
                        margin: 0, 
                        fontSize: '0.95rem',
                        lineHeight: '1.5',
                        fontWeight: '400'
                      }}>
                        {dica}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer style={{ backgroundColor: '#150B53', padding: '1rem 1rem' }}>
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
              color: '#ffffffff',
              marginBottom: '1rem'
            }}>
              Contato
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#b6b9ffff', lineHeight: '1.5' }}>
              <p><strong>Instagram:</strong><br />@projeto_neuma</p>
              <p><strong>E-mail:</strong><br />projetoneuma@gmail.com</p>
            </div>
          </div>

          <div style={{ flex: '1 1 250px', minWidth: '250px' }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: '#ffffffff',
              marginBottom: '1rem'
            }}>
              Desenvolvedoras
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#b6b9ffff', lineHeight: '1.5' }}>
              <p>Mariana Machado Welter <br /> Marina Isabel Bieger</p>
            </div>
          </div>

          <div style={{ flex: '0 0 auto', alignSelf: 'center' }}>
            <img
              src="/imagens/logo.png"
              alt="Logo"
              style={{
                width: '8rem',
                height: '8rem',
                objectFit: 'contain',
                display: 'block',
                margin: '0 auto'
              }}
            />
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}