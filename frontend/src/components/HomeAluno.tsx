import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Globe, BookOpen, Home, LogOut } from 'lucide-react';

interface UserData {
  id_aluno: number;
  id_usuario: number;
  id_categoria: number;
  nome: string;
  email: string;
  nome_categoria: string;
  teste_realizado: boolean;
}

export default function HomeAluno() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const loggedUserData = localStorage.getItem('loggedUser');
      if (!loggedUserData) {
        navigate('/login');
        return;
      }

      const user = JSON.parse(loggedUserData);
      
      // Buscar dados completos do aluno
      const response = await fetch(`http://localhost:3001/api/aluno/${user.id}`);
      const data = await response.json();

      if (data.success) {
        setUserData(data.aluno);
      } else {
        console.error('Erro ao carregar dados do aluno:', data.message);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedUser');
    navigate('/login');
  };

  const handleMinhasTurmas = () => {
    navigate('/personalizada');
  };

  const handleAtividadesPublicas = () => {
    navigate('/atividades-publicas');
  };

  const getCategoriaEmoji = (categoria: string) => {
    const emojis: { [key: string]: string } = {
      'visual': '👁️',
      'auditivo': '🎧',
      'cinestesico': '✋',
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
          <p style={{ color: '#6b7280' }}>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#150B53', padding: '1rem 0' }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img 
                src="/imagens/logo.png" 
                alt="Logo" 
                style={{ 
                  width: '3rem', 
                  height: '3rem',
                  objectFit: 'contain'
                }} 
              />
              <h1 style={{
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                margin: 0
              }}>
                Bem-vindo(a), {userData?.nome}
              </h1>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {userData && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  padding: '0.5rem 1rem',
                  borderRadius: '2rem',
                  color: 'white',
                  fontSize: '0.875rem'
                }}>
                  <span style={{ fontSize: '1.25rem' }}>
                    {getCategoriaEmoji(userData.nome_categoria)}
                  </span>
                  <span>Sistema {userData.nome_categoria}</span>
                </div>
              )}
              
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
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '2rem 1rem' }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
          
          {/* Welcome Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#150B53',
              marginBottom: '1rem'
            }}>
              Sua Jornada de Aprendizagem
            </h2>
            <p style={{
              color: '#374151',
              fontSize: '1.125rem',
              lineHeight: '1.6',
              maxWidth: '48rem',
              margin: '0 auto'
            }}>
              Descubra atividades personalizadas para seu estilo de aprendizagem {userData?.nome_categoria.toLowerCase()} 
              e explore recursos que tornam o aprendizado de matemática mais eficaz e divertido.
            </p>
          </div>

          {/* Options Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            {/* Minhas Turmas */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: '2px solid transparent'
            }}
            onClick={handleMinhasTurmas}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#150B53';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              <div style={{
                width: '5rem',
                height: '5rem',
                backgroundColor: '#CED0FF',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem'
              }}>
                <Users size={32} color="#150B53" />
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#150B53',
                marginBottom: '1rem'
              }}>
                Minhas Turmas
              </h3>
              <p style={{
                color: '#6b7280',
                lineHeight: '1.5'
              }}>
                Acesse atividades personalizadas criadas pelos seus professores 
                especialmente para seu estilo de aprendizagem {userData?.nome_categoria.toLowerCase()}.
              </p>
            </div>

            {/* Atividades Públicas */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: '2px solid transparent'
            }}
            onClick={handleAtividadesPublicas}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#16a34a';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              <div style={{
                width: '5rem',
                height: '5rem',
                backgroundColor: '#d1fae5',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem'
              }}>
                <Globe size={32} color="#16a34a" />
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#16a34a',
                marginBottom: '1rem'
              }}>
                Atividades Públicas
              </h3>
              <p style={{
                color: '#6b7280',
                lineHeight: '1.5'
              }}>
                Explore atividades disponibilizadas por diversos professores 
                para todos os estilos de aprendizagem.
              </p>
            </div>
          </div>

          {/* Learning Tips */}
          <div style={{
            backgroundColor: '#150B53',
            color: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '1.5rem'
            }}>
              💡 Dicas para Aprendizagem {userData?.nome_categoria}
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem',
              marginTop: '1.5rem'
            }}>
              {userData?.nome_categoria.toLowerCase() === 'visual' && (
                <>
                  <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '1rem', borderRadius: '0.5rem' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>📊 Use gráficos e diagramas</p>
                  </div>
                  <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '1rem', borderRadius: '0.5rem' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>🎨 Destaque com cores</p>
                  </div>
                  <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '1rem', borderRadius: '0.5rem' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>🧠 Crie mapas mentais</p>
                  </div>
                </>
              )}
              {userData?.nome_categoria.toLowerCase() === 'auditivo' && (
                <>
                  <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '1rem', borderRadius: '0.5rem' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>🗣️ Discuta em grupo</p>
                  </div>
                  <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '1rem', borderRadius: '0.5rem' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>🎧 Ouça explicações em áudio</p>
                  </div>
                  <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '1rem', borderRadius: '0.5rem' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>📢 Leia em voz alta</p>
                  </div>
                </>
              )}
              {userData?.nome_categoria.toLowerCase() === 'cinestesico' && (
                <>
                  <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '1rem', borderRadius: '0.5rem' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>✋ Pratique exercícios</p>
                  </div>
                  <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '1rem', borderRadius: '0.5rem' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>🎯 Use materiais concretos</p>
                  </div>
                  <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '1rem', borderRadius: '0.5rem' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>🏃 Faça pausas ativas</p>
                  </div>
                </>
              )}
              {userData?.nome_categoria.toLowerCase() === 'leitura_escrita' && (
                <>
                  <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '1rem', borderRadius: '0.5rem' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>📝 Faça anotações</p>
                  </div>
                  <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '1rem', borderRadius: '0.5rem' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>📚 Leia textos completos</p>
                  </div>
                  <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '1rem', borderRadius: '0.5rem' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>✍️ Reescreva conceitos</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}