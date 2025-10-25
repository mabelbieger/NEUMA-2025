import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Download, Search, Filter, Eye, Headphones, BookOpen, Hand } from 'lucide-react';

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
}

export default function AtividadesPublicas() {
  const navigate = useNavigate();
  const [atividades, setAtividades] = useState<AtividadePublica[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('todas');
  const [selectedAtividade, setSelectedAtividade] = useState<number | null>(null);

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

      // Buscar dados do aluno
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
          
          // Buscar atividades públicas FILTRADAS pela categoria do aluno
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
          // Não carrega atividades se não tem categoria
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

  const filteredAtividades = atividades.filter(atividade => {
    const matchesSearch = atividade.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (atividade.descricao && atividade.descricao.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         atividade.nome_professor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategoria === 'todas' || 
                           atividade.nome_categoria.toLowerCase() === filterCategoria.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  const categorias = ['todas', 'visual', 'auditivo', 'cinestésico', 'leitura_escrita'];

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

  const getCategoriaEmoji = (categoria: string) => {
    const emojis: { [key: string]: string } = {
      'visual': '👁️',
      'auditivo': '🎧',
      'cinestésico': '✋',
      'leitura_escrita': '📖'
    };
    return emojis[categoria.toLowerCase()] || '🎓';
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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <header style={{ backgroundColor: '#150B53', padding: '1rem 0' }}>
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
                gap: '0.5rem',
                fontSize: '1rem'
              }}
            >
              <Home size={20} />
              Voltar
            </button>

            <div style={{ textAlign: 'center' }}>
              <h1 style={{
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                margin: 0
              }}>
                Atividades Públicas
              </h1>
              {userData && userData.id_categoria && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginTop: '0.25rem'
                }}>
                  <span style={{ 
                    fontSize: '1.25rem',
                    color: '#CED0FF'
                  }}>
                    {getCategoriaEmoji(userData.nome_categoria)}
                  </span>
                  <span style={{ 
                    fontSize: '0.875rem',
                    color: '#CED0FF'
                  }}>
                    Sistema {userData.nome_categoria}
                  </span>
                </div>
              )}
            </div>

            <div style={{ width: '100px' }}></div>
          </div>
        </div>
      </header>

      <main style={{ padding: '2rem 1rem' }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
          
          {/* Info do Aluno */}
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

          {/* Search and Filter */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem',
              alignItems: 'end'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151',
                  fontSize: '0.875rem'
                }}>
                  <Search size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
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
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#150B53'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151',
                  fontSize: '0.875rem'
                }}>
                  <Filter size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                  Filtrar por categoria
                </label>
                <select
                  value={filterCategoria}
                  onChange={(e) => setFilterCategoria(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    outline: 'none',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}
                >
                  {categorias.map(categoria => (
                    <option key={categoria} value={categoria}>
                      {categoria === 'todas' ? 'Todas as categorias' : categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Activities List */}
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
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                {filteredAtividades.map((atividade) => {
                  const CategoriaIcon = getCategoriaIcon(atividade.nome_categoria);
                  const categoriaColor = getCategoriaColor(atividade.nome_categoria);
                  
                  return (
                    <div key={atividade.id_atividade}>
                      <button
                        onClick={() => setSelectedAtividade(
                          selectedAtividade === atividade.id_atividade ? null : atividade.id_atividade
                        )}
                        style={{
                          width: '100%',
                          backgroundColor: selectedAtividade === atividade.id_atividade ? '#150B53' : '#f8fafc',
                          color: selectedAtividade === atividade.id_atividade ? 'white' : '#150B53',
                          border: `2px solid ${categoriaColor}`,
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
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: 1 }}>
                          <div style={{
                            width: '3rem',
                            height: '3rem',
                            backgroundColor: categoriaColor,
                            borderRadius: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <CategoriaIcon size={20} color="white" />
                          </div>
                          
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
                              <span style={{
                                backgroundColor: categoriaColor,
                                color: 'white',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '1rem',
                                fontSize: '0.7rem'
                              }}>
                                {atividade.nome_categoria}
                              </span>
                              <span>Por: {atividade.nome_professor}</span>
                              <span>Tipo: {atividade.tipo_conteudo}</span>
                              <span>
                                {new Date(atividade.data_criacao).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
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
                          border: `2px solid ${categoriaColor}`,
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
                              borderLeft: `4px solid ${categoriaColor}`
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
                  );
                })}
              </div>
            )}
          </div>
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