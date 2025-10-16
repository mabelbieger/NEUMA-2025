import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Headphones, BookOpen, Hand, RotateCcw, Download, Share2, Home } from 'lucide-react';


interface ResultadoProps {
  scores: {
    V: number;
    A: number;
    R: number;
    K: number;
  };
  onRestart: () => void;
  onBackToHome: () => void;
}


export default function Resultado({ scores, onRestart, onBackToHome }: ResultadoProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate();

  const saveResultsToDatabase = async () => {
    try {
      setIsSaving(true);
      
      const loggedUserData = localStorage.getItem('loggedUser');
      if (!loggedUserData) {
        console.error('Usuário não encontrado no localStorage');
        return;
      }

      const user = JSON.parse(loggedUserData);
      console.log('Usuário logado:', user);
      
      if (user.tipo !== 'Aluno') {
        console.log('Apenas alunos podem salvar resultados do teste');
        return;
      }

      const dataToSend = {
        userId: user.id,
        scores: scores
      };

      console.log('Salvando resultados:', dataToSend);

      const response = await fetch('http://localhost:3001/api/salvar-teste', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });

      const result = await response.json();
      console.log('Resposta do servidor:', result);

      if (result.success) {
        setIsSaved(true);
        console.log('Resultados salvos com sucesso no banco de dados');
      } else {
        console.error('Erro ao salvar resultados:', result.message);
      }

    } catch (error) {
      console.error('Erro ao salvar resultados no banco:', error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const loggedUserData = localStorage.getItem('loggedUser');
    if (loggedUserData) {
      const user = JSON.parse(loggedUserData);
      if (user.tipo === 'Aluno') {
        saveResultsToDatabase();
      }
    }
  }, []);

  const getDominantStyle = () => {
    const styles = [
      { name: 'Visual', code: 'V', score: scores.V },
      { name: 'Auditivo', code: 'A', score: scores.A },
      { name: 'Leitura/Escrita', code: 'R', score: scores.R },
      { name: 'Cinestésico', code: 'K', score: scores.K }
    ];

    return styles.sort((a, b) => b.score - a.score);
  };

  const sortedStyles = getDominantStyle();
  const dominantStyle = sortedStyles[0];
  const total = Object.values(scores).reduce((sum, score) => sum + score, 0);

  const getStyleInfo = (code: string) => {
    const styles = {
      V: {
        name: 'Visual',
        icon: Eye,
        color: '#dc2626',
        bgColor: '#fef2f2',
        textColor: '#991b1b',
        borderColor: '#fecaca',
        description: 'Você aprende melhor através de elementos visuais',
        tips: [
          'Use gráficos, diagramas e mapas mentais',
          'Destaque informações importantes com cores',
          'Desenhe conceitos matemáticos',
          'Use flashcards com imagens',
          'Prefira vídeos educativos e animações'
        ],
        mathTips: [
          'Visualize problemas através de desenhos e gráficos',
          'Use representações geométricas para álgebra',
          'Crie esquemas coloridos para fórmulas',
          'Utilize software de geometria dinâmica'
        ]
      },
      A: {
        name: 'Auditivo',
        icon: Headphones,
        color: '#2563eb',
        bgColor: '#eff6ff',
        textColor: '#1d4ed8',
        borderColor: '#bfdbfe',
        description: 'Você aprende melhor ouvindo e discutindo',
        tips: [
          'Participe de discussões em grupo',
          'Grave áudios para revisar conteúdo',
          'Leia em voz alta',
          'Use música ou ritmo para memorizar',
          'Prefira explicações verbais'
        ],
        mathTips: [
          'Explique problemas matemáticos em voz alta',
          'Participe de grupos de estudo',
          'Use apps com explicações em áudio',
          'Grave suas próprias explicações de fórmulas'
        ]
      },
      R: {
        name: 'Leitura/Escrita',
        icon: BookOpen,
        color: '#16a34a',
        bgColor: '#f0fdf4',
        textColor: '#15803d',
        borderColor: '#bbf7d0',
        description: 'Você aprende melhor lendo e escrevendo',
        tips: [
          'Faça anotações detalhadas',
          'Reescreva conceitos com suas palavras',
          'Use listas e resumos',
          'Prefira textos e artigos',
          'Mantenha um diário de estudos'
        ],
        mathTips: [
          'Escreva os passos de resolução detalhadamente',
          'Crie resumos de fórmulas e conceitos',
          'Faça listas de exercícios organizadas',
          'Anote definições e teoremas importantes'
        ]
      },
      K: {
        name: 'Cinestésico',
        icon: Hand,
        color: '#9333ea',
        bgColor: '#faf5ff',
        textColor: '#7c3aed',
        borderColor: '#d8b4fe',
        description: 'Você aprende melhor através da prática e movimento',
        tips: [
          'Pratique com experimentos hands-on',
          'Use objetos físicos para aprender',
          'Faça pausas regulares durante o estudo',
          'Associe movimentos a conceitos',
          'Prefira atividades interativas'
        ],
        mathTips: [
          'Use materiais manipuláveis (blocos, réguas)',
          'Resolva muitos exercícios práticos',
          'Crie modelos físicos de conceitos geométricos',
          'Pratique em ambientes diferentes'
        ]
      }
    };

    return styles[code as keyof typeof styles];
  };

  const getPercentage = (score: number) => {
    return total > 0 ? Math.round((score / total) * 100) : 0;
  };

  const primaryStyle = getStyleInfo(dominantStyle.code);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#150B53', padding: '1.5rem 0' }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
          <img
            src="/imagens/logo.png"
            alt="Logo"
            style={{
              width: '6rem',
              height: '6rem',
              margin: '0 auto',
              display: 'block',
              objectFit: 'contain'
            }}
          />
        </div>
      </header>

      <div style={{ padding: '2rem 1rem' }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            boxShadow: '0 1px 7px rgba(57, 0, 227, 0.78)',
            padding: '2rem',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            {isSaving && (
              <div style={{
                backgroundColor: '#fef3c7',
                color: '#92400e',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                marginBottom: '1rem',
                fontSize: '0.875rem'
              }}>
                Salvando seus resultados...
              </div>
            )}
           
            {isSaved && (
              <div style={{
                backgroundColor: '#d1fae5',
                color: '#065f46',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                marginBottom: '1rem',
                fontSize: '0.875rem'
              }}>
                ✓ Resultados salvos com sucesso!
              </div>
            )}

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{
                width: '5rem',
                height: '5rem',
                backgroundColor: primaryStyle.bgColor,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
                border: `2px solid ${primaryStyle.borderColor}`
              }}>
                <primaryStyle.icon style={{ width: '2.5rem', height: '2.5rem', color: primaryStyle.color }} />
              </div>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '0.5rem'
              }}>
                Resultado do seu Teste VARK
              </h1>
              <p style={{ fontSize: '1.25rem', color: '#374151' }}>
                Seu estilo de aprendizagem predominante é:
                <span style={{ fontWeight: 'bold', color: primaryStyle.textColor, marginLeft: '0.5rem' }}>
                  {primaryStyle.name}
                </span>
              </p>
            </div>

            <div style={{
              backgroundColor: primaryStyle.bgColor,
              border: `2px solid ${primaryStyle.borderColor}`,
              borderRadius: '0.75rem',
              padding: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <p style={{ color: primaryStyle.textColor, fontSize: '1.125rem', fontWeight: '500', margin: 0 }}>
                {primaryStyle.description}
              </p>
            </div>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '1rem'
            }}>
              <button
                onClick={onRestart}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.75rem',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#4b5563';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#6b7280';
                }}
              >
                <RotateCcw style={{ width: '1rem', height: '1rem' }} />
                <span>Refazer Teste</span>
              </button>
             
              <button
                onClick={onBackToHome}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#150B53',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.75rem',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#1a0f5c';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#150B53';
                }}
              >
                <Home style={{ width: '1rem', height: '1rem' }} />
                <span>Voltar ao Início</span>
              </button>
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            boxShadow: '0 1px 7px rgba(57, 0, 227, 0.78)',
            padding: '2rem',
            marginBottom: '1.5rem'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '1.5rem'
            }}>
              Distribuição dos seus Estilos
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {sortedStyles.map((style, index) => {
                const styleInfo = getStyleInfo(style.code);
                const percentage = getPercentage(style.score);
               
                return (
                  <div key={style.code} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '3rem',
                      height: '3rem',
                      backgroundColor: styleInfo.bgColor,
                      borderRadius: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      border: `1px solid ${styleInfo.borderColor}`
                    }}>
                      <styleInfo.icon style={{ width: '1.5rem', height: '1.5rem', color: styleInfo.color }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.5rem'
                      }}>
                        <span style={{ fontWeight: '600', color: '#374151' }}>{styleInfo.name}</span>
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {style.score}/10 ({percentage}%)
                        </span>
                      </div>
                      <div style={{
                        width: '100%',
                        backgroundColor: '#e5e7eb',
                        borderRadius: '9999px',
                        height: '0.75rem'
                      }}>
                        <div
                          style={{
                            backgroundColor: styleInfo.color,
                            height: '0.75rem',
                            borderRadius: '9999px',
                            transition: 'width 1s ease',
                            width: `${percentage}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              boxShadow: '0 1px 7px rgba(57, 0, 227, 0.78)',
              padding: '2rem'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '1rem'
              }}>
                Dicas Gerais de Estudo
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {primaryStyle.tips.map((tip, index) => (
                  <li key={index} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    marginBottom: '0.75rem'
                  }}>
                    <div style={{
                      width: '0.5rem',
                      height: '0.5rem',
                      backgroundColor: primaryStyle.color,
                      borderRadius: '50%',
                      marginTop: '0.5rem',
                      flexShrink: 0
                    }}></div>
                    <span style={{ color: '#374151' }}>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              boxShadow: '0 1px 7px rgba(57, 0, 227, 0.78)',
              padding: '2rem'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '1rem'
              }}>
                Dicas para Matemática
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {primaryStyle.mathTips.map((tip, index) => (
                  <li key={index} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    marginBottom: '0.75rem'
                  }}>
                    <div style={{
                      width: '0.5rem',
                      height: '0.5rem',
                      backgroundColor: primaryStyle.color,
                      borderRadius: '50%',
                      marginTop: '0.5rem',
                      flexShrink: 0
                    }}></div>
                    <span style={{ color: '#374151' }}>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {sortedStyles[1].score > 0 && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              boxShadow: '0 1px 7px rgba(57, 0, 227, 0.78)',
              padding: '2rem',
              marginTop: '1.5rem'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '1rem'
              }}>
                Estilos Secundários
              </h3>
              <p style={{ color: '#374151', marginBottom: '1rem' }}>
                Você também apresenta características dos seguintes estilos de aprendizagem:
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem'
              }}>
                {sortedStyles.slice(1).filter(style => style.score > 0).map(style => {
                  const styleInfo = getStyleInfo(style.code);
                  return (
                    <div key={style.code} style={{
                      backgroundColor: styleInfo.bgColor,
                      border: `1px solid ${styleInfo.borderColor}`,
                      borderRadius: '0.75rem',
                      padding: '1rem'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        marginBottom: '0.5rem'
                      }}>
                        <styleInfo.icon style={{ width: '1.25rem', height: '1.25rem', color: styleInfo.color }} />
                        <span style={{ fontWeight: '600', color: styleInfo.textColor }}>{styleInfo.name}</span>
                      </div>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                        {getPercentage(style.score)}% das suas respostas
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{
            background: '#150B53',
            borderRadius: '1rem',
            boxShadow: '0 1px 7px rgba(57, 0, 227, 0.78)',
            padding: '2rem',
            marginTop: '1.5rem',
            color: 'white',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>
              Siga em frente!
            </h3>
           
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '1rem'
            }}>
              <button
                style={{
                  backgroundColor: 'white',
                  color: '#150B53',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.75rem',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => navigate('/personalizada')}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                Ir para a sua página personalizada
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}