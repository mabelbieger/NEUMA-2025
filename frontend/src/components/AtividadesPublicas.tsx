import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Search, Eye, Headphones, BookOpen, Hand, LogOut, ArrowLeft } from 'lucide-react';

interface AtividadePublica {
  id_atividade: number;
  titulo: string;
  descricao: string;
  id_categoria: number;
  tipo_conteudo: string;
  conteudo: string;
  nome_arquivo: string;
  data_criacao: string;
  publica: boolean;
  nome_categoria: string;
  nome_professor: string;
}

interface UserData {
  id_aluno: number;
  id_usuario: number;
  id_categoria: number;
  nome: string;
  email: string;
  nome_categoria: string;
  teste_realizado: boolean;
  foto_perfil?: string;
}

export default function AtividadesPublicas() {
  const navigate = useNavigate();
  const [atividades, setAtividades] = useState<AtividadePublica[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAtividade, setSelectedAtividade] = useState<number | null>(null);

  const getFotoPerfilUrl = (fotoPath?: string) => {
    if (!fotoPath) return null;
    if (fotoPath.startsWith('http')) {
      return fotoPath;
    }
    return `http://localhost:3001${fotoPath.startsWith('/') ? '' : '/'}${fotoPath}`;
  };

  useEffect(() => {
    loadUserDataAndAtividades();
  }, []);

  const loadUserDataAndAtividades = async () => {
    try {
      setLoading(true);
      const loggedUserData = localStorage.getItem('loggedUser');
      if (!loggedUserData) {
        navigate('/login');
        return;
      }

      const user = JSON.parse(loggedUserData);
      console.log('🔄 Carregando atividades públicas para usuário:', user.id);

      const alunoResponse = await fetch(`http://localhost:3001/api/aluno/${user.id}`);
      
      if (!alunoResponse.ok) {
        throw new Error(`Erro ao buscar aluno: ${alunoResponse.status}`);
      }
      
      const alunoData = await alunoResponse.json();
      console.log('📊 Dados do aluno:', alunoData);

      if (alunoData.success && alunoData.aluno) {
        setUserData(alunoData.aluno);
        
        if (alunoData.aluno.id_categoria) {
          console.log(`🎯 Buscando atividades para categoria: ${alunoData.aluno.id_categoria}`);
          
          const response = await fetch(`http://localhost:3001/api/atividades-publicas/${alunoData.aluno.id_categoria}`);
          
          if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
          }
          
          const data = await response.json();
          console.log('📦 Resposta da API:', data);

          if (data.success) {
            setAtividades(data.atividades);
            console.log(`✅ ${data.atividades.length} atividades carregadas para sistema ${alunoData.aluno.nome_categoria}`);
          } else {
            console.error('❌ Erro na resposta:', data.message);
            alert(`Erro: ${data.message}`);
          }
        } else {
          console.log('ℹ️ Aluno sem categoria definida');
          setAtividades([]);
        }
      } else {
        console.error('❌ Erro ao carregar dados do aluno:', alunoData.message);
        alert('Erro ao carregar dados do aluno');
      }
    } catch (error) {
      console.error('💥 Erro crítico ao carregar dados:', error);
      alert('Erro ao conectar com o servidor. Verifique o console.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/home-aluno');
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedUser');
    navigate('/login');
  };

  const handlePerfil = () => {
    navigate('/perfil-aluno');
  };

  const filteredAtividades = atividades.filter(atividade => {
    const matchesSearch = atividade.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (atividade.descricao && atividade.descricao.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         atividade.nome_professor.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const getCategoriaIcon = (categoria: string) => {
    const icons: { [key: string]: any } = {
      'visual': Eye,
      'auditivo': Headphones,
      'cinestésico': Hand,
      'leitura_escrita': BookOpen
    };
    return icons[categoria.toLowerCase()] || Eye;
  };

  const getCategoriaColor = (categoria: string) => {
    const colors: { [key: string]: string } = {
      'visual': '#dc2626',
      'auditivo': '#2563eb',
      'cinestésico': '#9333ea',
      'leitura_escrita': '#16a34a'
    };
    return colors[categoria.toLowerCase()] || '#6b7280';
  };

  const renderConteudoAtividade = (atividade: AtividadePublica) => {
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
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
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
          <p style={{ color: '#6b7280' }}>Carregando atividades...</p>
        </div>
      </div>
    );
  }

  const fotoPerfilUrl = getFotoPerfilUrl(userData?.foto_perfil);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <header style={{ 
        backgroundColor: '#150B53', 
        padding: '1rem 0', 
        position: 'relative', 
        height: '80px' 
      }}>
        <div style={{ 
          position: 'absolute', 
          left: '2rem', 
          top: '50%', 
          transform: 'translateY(-50%)' 
        }}>
          <button
            onClick={handleBackToHome}
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
        
        <div style={{ 
          position: 'absolute', 
          left: '50%', 
          top: '50%', 
          transform: 'translate(-50%, -50%)' 
        }}>
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
        
        <div style={{ 
          position: 'absolute', 
          right: '2rem', 
          top: '50%', 
          transform: 'translateY(-50%)' 
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem' 
          }}>
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
          
          {userData && userData.id_categoria && (
            <div style={{
              backgroundColor: '#CED0FF',
              borderRadius: '1rem',
              padding: '1.5rem',
              marginBottom: '2rem',
              textAlign: 'center'
            }}>
              <h2 style={{
                color: '#150B53',
                fontSize: '1.25rem',
                fontWeight: 'bold',
                marginBottom: '0.5rem'
              }}>
                Atividades para seu Estilo de Aprendizagem
              </h2>
              <p style={{
                color: '#374151',
                margin: 0
              }}>
                Mostrando apenas atividades públicas do sistema <strong>{userData.nome_categoria}</strong> que combinam com seu perfil
              </p>
            </div>
          )}

          {userData && !userData.id_categoria && (
            <div style={{
              backgroundColor: '#FEF3C7',
              borderRadius: '1rem',
              padding: '1.5rem',
              marginBottom: '2rem',
              textAlign: 'center',
              border: '2px solid #F59E0B'
            }}>
              <h2 style={{
                color: '#92400E',
                fontSize: '1.25rem',
                fontWeight: 'bold',
                marginBottom: '0.5rem'
              }}>
                Complete o Teste VARK
              </h2>
              <p style={{
                color: '#92400E',
                margin: 0
              }}>
                Para ver atividades personalizadas ao seu estilo de aprendizagem, complete o teste VARK primeiro.
              </p>
            </div>
          )}

          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#000000',
                fontSize: '0.875rem'
              }}>
                <Search size={16} style={{ display: 'inline', marginRight: '0.5rem', color: '#000000' }} />
                Buscar atividades
              </label>
              <input
                type="text"
                placeholder="Buscar por título, descrição ou professor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: '#f9fafb',
                  color: '#000000'
                }}
                onFocus={(e) => e.target.style.borderColor = '#150B53'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#150B53',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              {filteredAtividades.length} Atividade(s) Pública(s) Encontrada(s)
            </h2>

            {filteredAtividades.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem 1rem',
                color: '#6b7280'
              }}>
                <p style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                  Nenhuma atividade pública encontrada
                </p>
                <p style={{ fontSize: '0.875rem' }}>
                  {userData && userData.id_categoria ? 
                    `Não há atividades públicas disponíveis para o sistema ${userData.nome_categoria} no momento.` :
                    'Não há atividades públicas disponíveis no momento.'
                  }
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem'
              }}>
                {filteredAtividades.map((atividade) => {
                  const CategoriaIcon = getCategoriaIcon(atividade.nome_categoria);
                  const categoriaColor = getCategoriaColor(atividade.nome_categoria);
                  
                  return (
                    <div key={atividade.id_atividade}>
                      <div
                        onClick={() => setSelectedAtividade(atividade.id_atividade)}
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
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          marginBottom: '0.5rem'
                        }}>
                          <div style={{
                            width: '2.5rem',
                            height: '2.5rem',
                            backgroundColor: categoriaColor,
                            borderRadius: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <CategoriaIcon size={16} color="white" />
                          </div>
                          <h4 style={{
                            color: '#150B53',
                            fontSize: '1.125rem',
                            fontWeight: 'bold',
                            margin: 0,
                            lineHeight: '1.4'
                          }}>
                            {atividade.titulo}
                          </h4>
                        </div>
                        
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
                          {atividade.descricao || 'Sem descrição disponível.'}
                        </p>
                        
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.75rem',
                          color: '#6b7280',
                          marginTop: 'auto'
                        }}>
                          <span>Por: {atividade.nome_professor}</span>
                          <span>
                            {new Date(atividade.data_criacao).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>

                      {selectedAtividade === atividade.id_atividade && (
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
                              <span style={{
                                backgroundColor: categoriaColor,
                                color: 'white',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '1rem',
                                fontSize: '0.7rem',
                                fontWeight: '600'
                              }}>
                                {atividade.nome_categoria}
                              </span>
                              <span>Por: {atividade.nome_professor}</span>
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
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer style={{ 
        backgroundColor: '#150B53', 
        padding: '1rem 1rem'
      }}>
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