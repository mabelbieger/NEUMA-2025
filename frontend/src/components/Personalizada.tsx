import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserData {
  id: number;
  nome: string;
  email: string;
  tipo: string;
  learningStyle?: string;
  learningStyleName?: string;
  testCompleted?: boolean;
}

interface LearningStyleInfo {
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  description: string;
  generalTips: string[];
  mathTips: string[];
  activities: ContentActivity[];
}

interface ContentActivity {
  id: string;
  title: string;
  type: string;
  resources: ActivityResource[];
}

interface ActivityResource {
  type: 'image' | 'video' | 'text' | 'interactive' | 'audio';
  title: string;
  content: string;
  url?: string;
}

export default function PaginaPersonalizada() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [learningStyle, setLearningStyle] = useState<LearningStyleInfo | null>(null);
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const navigate = useNavigate();

  const learningStyles: { [key: string]: LearningStyleInfo } = {
    V: {
      name: 'Visual',
      icon: '👁️',
      color: '#dc2626',
      bgColor: '#fef2f2',
      textColor: '#991b1b',
      borderColor: '#fecaca',
      description: 'Você aprende melhor através de elementos visuais como imagens, gráficos e cores',
      generalTips: [
        'Use gráficos, diagramas e mapas mentais',
        'Destaque informações importantes com cores',
        'Assista a vídeos educativos',
        'Use flashcards com imagens',
        'Crie linhas do tempo visuais'
      ],
      mathTips: [
        'Visualize problemas através de desenhos',
        'Use representações geométricas',
        'Crie esquemas coloridos para fórmulas',
        'Utilize software de geometria dinâmica'
      ],
      activities: [
        {
          id: 'circunferencia',
          title: '⭕ Circunferência',
          type: 'matematica',
          resources: [
            {
              type: 'image',
              title: 'Mapa Mental da Circunferência',
              content: 'Visualize os conceitos principais através de um mapa mental',
              url: '/imagens/mapaMentalNeuma.png'
            },
            {
              type: 'video',
              title: 'Vídeo Explicativo - Circunferência',
              content: 'Assista a uma explicação visual sobre circunferência e seus elementos'
            },
            {
              type: 'interactive',
              title: 'Construa sua Circunferência',
              content: 'Use ferramentas interativas para criar e explorar circunferências'
            }
          ]
        },
        {
          id: 'algebra',
          title: '📐 Álgebra Básica',
          type: 'matematica',
          resources: [
            {
              type: 'image',
              title: 'Gráficos de Funções',
              content: 'Visualize funções algébricas através de gráficos coloridos'
            },
            {
              type: 'interactive',
              title: 'Resolva Equações Visualmente',
              content: 'Use balanças visuais para entender equações'
            }
          ]
        }
      ]
    },
    A: {
      name: 'Auditivo',
      icon: '🎧',
      color: '#2563eb',
      bgColor: '#eff6ff',
      textColor: '#1d4ed8',
      borderColor: '#bfdbfe',
      description: 'Você aprende melhor ouvindo e discutindo conteúdos',
      generalTips: [
        'Participe de discussões em grupo',
        'Grave áudios para revisar conteúdo',
        'Leia em voz alta',
        'Use podcasts educativos',
        'Explique conceitos para outras pessoas'
      ],
      mathTips: [
        'Explique problemas matemáticos em voz alta',
        'Participe de grupos de estudo',
        'Use apps com explicações em áudio',
        'Grave suas próprias explicações'
      ],
      activities: [
        {
          id: 'circunferencia',
          title: '⭕ Circunferência',
          type: 'matematica',
          resources: [
            {
              type: 'audio',
              title: 'Áudio Explicativo',
              content: 'Ouça uma explicação detalhada sobre circunferência'
            },
            {
              type: 'interactive',
              title: 'Discussão em Grupo',
              content: 'Participe de uma discussão sobre os conceitos'
            }
          ]
        }
      ]
    },
    R: {
      name: 'Leitura/Escrita',
      icon: '📖',
      color: '#16a34a',
      bgColor: '#f0fdf4',
      textColor: '#15803d',
      borderColor: '#bbf7d0',
      description: 'Você aprende melhor lendo e escrevendo',
      generalTips: [
        'Faça anotações detalhadas',
        'Reescreva conceitos com suas palavras',
        'Use listas e resumos',
        'Mantenha um diário de estudos',
        'Leia textos complementares'
      ],
      mathTips: [
        'Escreva os passos de resolução detalhadamente',
        'Crie resumos de fórmulas e conceitos',
        'Faça listas de exercícios organizadas',
        'Anote definições importantes'
      ],
      activities: [
        {
          id: 'circunferencia',
          title: '⭕ Circunferência',
          type: 'matematica',
          resources: [
            {
              type: 'text',
              title: 'Texto Explicativo Completo',
              content: 'Leia uma explicação detalhada sobre circunferência...'
            },
            {
              type: 'interactive',
              title: 'Exercícios de Escrita',
              content: 'Descreva os conceitos com suas próprias palavras'
            }
          ]
        }
      ]
    },
    K: {
      name: 'Cinestésico',
      icon: '✋',
      color: '#9333ea',
      bgColor: '#faf5ff',
      textColor: '#7c3aed',
      borderColor: '#d8b4fe',
      description: 'Você aprende melhor através da prática e movimento',
      generalTips: [
        'Pratique com experimentos hands-on',
        'Use objetos físicos para aprender',
        'Faça pausas regulares durante o estudo',
        'Associe movimentos a conceitos',
        'Prefira atividades interativas'
      ],
      mathTips: [
        'Use materiais manipuláveis',
        'Resolva muitos exercícios práticos',
        'Crie modelos físicos',
        'Pratique em ambientes diferentes'
      ],
      activities: [
        {
          id: 'circunferencia',
          title: '⭕ Circunferência',
          type: 'matematica',
          resources: [
            {
              type: 'interactive',
              title: 'Construa uma Circunferência Física',
              content: 'Use compasso e outros materiais para criar circunferências'
            },
            {
              type: 'interactive',
              title: 'Atividade Prática',
              content: 'Meça circunferências de objetos reais'
            }
          ]
        }
      ]
    }
  };

  useEffect(() => {
    const loggedUserData = localStorage.getItem('loggedUser');
    if (loggedUserData) {
      const user = JSON.parse(loggedUserData);
      setUserData(user);
      
      if (user.learningStyle && learningStyles[user.learningStyle]) {
        setLearningStyle(learningStyles[user.learningStyle]);
      } else {
        navigate('/teste');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleBackToHome = () => {
    navigate('/home');
  };

  const handleContentClick = (contentId: string) => {
    setSelectedContent(selectedContent === contentId ? null : contentId);
  };

  const handleBackToTest = () => {
    navigate('/teste');
  };

  if (!userData || !learningStyle) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f9fafb',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div>Carregando...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
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
                fontSize: '1.5rem'
              }}
            >
              ←
            </button>

            <h1 style={{
              color: 'white',
              fontSize: '2rem',
              fontWeight: 'bold',
              margin: 0,
              textAlign: 'center',
              flex: 1
            }}>
              {learningStyle.icon} {learningStyle.name}
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
          
          <div style={{
            backgroundColor: learningStyle.bgColor,
            border: `2px solid ${learningStyle.borderColor}`,
            borderRadius: '0.75rem',
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}>
              <h2 style={{
                color: learningStyle.textColor,
                fontSize: '1.5rem',
                fontWeight: 'bold',
                margin: 0
              }}>
                Bem-vindo, {userData.nome}!
              </h2>
              
              <button
                onClick={handleBackToTest}
                style={{
                  backgroundColor: learningStyle.color,
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                Refazer Teste
              </button>
            </div>
            
            <p style={{
              color: learningStyle.textColor,
              margin: 0,
              fontSize: '1rem',
              lineHeight: '1.5'
            }}>
              {learningStyle.description}
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
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
              🎯 Seu Perfil de Aprendizagem
            </h2>
            
            <p style={{
              color: '#374151',
              lineHeight: '1.6',
              fontSize: '1rem',
              maxWidth: '48rem',
              margin: '0 auto'
            }}>
              Sua página foi personalizada para o estilo <strong>{learningStyle.name.toLowerCase()}</strong>. 
              Aqui você encontrará recursos e atividades que se alinham com sua forma preferida de aprender.
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
              📚 Conteúdos Personalizados
            </h3>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {learningStyle.activities.map((activity) => (
                <div key={activity.id}>
                  <button
                    onClick={() => handleContentClick(activity.id)}
                    style={{
                      backgroundColor: selectedContent === activity.id ? learningStyle.color : learningStyle.bgColor,
                      color: selectedContent === activity.id ? 'white' : learningStyle.textColor,
                      border: `2px solid ${learningStyle.borderColor}`,
                      borderRadius: '0.75rem',
                      padding: '1.5rem',
                      cursor: 'pointer',
                      fontSize: '1.25rem',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.3s ease',
                      width: '100%',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: '0.75rem' }}>{activity.title.split(' ')[0]}</span>
                      {activity.title.split(' ').slice(1).join(' ')}
                    </div>
                    <span style={{ 
                      transform: selectedContent === activity.id ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease'
                    }}>
                      ▼
                    </span>
                  </button>

                  {selectedContent === activity.id && (
                    <div style={{
                      backgroundColor: learningStyle.bgColor,
                      borderRadius: '0.75rem',
                      padding: '2rem',
                      border: `2px solid ${learningStyle.borderColor}`,
                      marginTop: '0.5rem',
                      animation: 'fadeIn 0.3s ease-in'
                    }}>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem'
                      }}>
                        {activity.resources.map((resource, index) => (
                          <div key={index} style={{
                            backgroundColor: 'white',
                            padding: '1.5rem',
                            borderRadius: '0.75rem',
                            border: `1px solid ${learningStyle.borderColor}`
                          }}>
                            <h4 style={{
                              color: learningStyle.textColor,
                              fontSize: '1.125rem',
                              fontWeight: 'bold',
                              marginBottom: '0.5rem'
                            }}>
                              {getResourceIcon(resource.type)} {resource.title}
                            </h4>
                            <p style={{
                              color: '#374151',
                              fontSize: '0.9rem',
                              lineHeight: '1.5',
                              margin: 0
                            }}>
                              {resource.content}
                            </p>
                            {resource.url && (
                              <div style={{ marginTop: '1rem' }}>
                                <img 
                                  src={resource.url} 
                                  alt={resource.title}
                                  style={{
                                    width: '100%',
                                    maxWidth: '280px',
                                    height: 'auto',
                                    borderRadius: '0.5rem'
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{
            backgroundColor: learningStyle.color,
            color: 'white',
            borderRadius: '0.75rem',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              💡 Dicas para {learningStyle.name}
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem'
            }}>
              <div>
                <h4 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Dicas Gerais</h4>
                <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                  {learningStyle.generalTips.slice(0, 3).map((tip, index) => (
                    <li key={index} style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Para Matemática</h4>
                <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                  {learningStyle.mathTips.slice(0, 3).map((tip, index) => (
                    <li key={index} style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function getResourceIcon(type: string): string {
  const icons = {
    image: '🖼️',
    video: '🎥',
    text: '📝',
    interactive: '🔄',
    audio: '🔊'
  };
  return icons[type] || '📄';
}