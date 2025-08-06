import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Eye, Headphones, BookOpen, Hand, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Resultado from './resultado';

interface Question {
  id: number;
  question: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
}

const questions: Question[] = [
  {
    id: 1,
    question: "Quando você precisa aprender a usar um novo aplicativo, você prefere:",
    options: {
      a: "Assistir a um vídeo tutorial mostrando o passo a passo.",
      b: "Ouvir alguém explicando como usar e fazer perguntas.",
      c: "Ler o manual ou as instruções escritas.",
      d: "Ir testando e explorando por conta própria."
    }
  },
  {
    id: 2,
    question: "Em uma palestra ou aula, o que mais ajuda você a entender o conteúdo?",
    options: {
      a: "Slides com gráficos, esquemas e imagens.",
      b: "A fala clara e a entonação do palestrante.",
      c: "Receber um resumo por escrito.",
      d: "Participar com atividades, demonstrações ou experiências."
    }
  },
  {
    id: 3,
    question: "Quando você tenta memorizar algo, o que costuma fazer?",
    options: {
      a: "Associa imagens ou esquemas mentais ao conteúdo.",
      b: "Repete em voz alta ou grava áudios para ouvir depois.",
      c: "Faz anotações, resumos ou reescreve várias vezes.",
      d: "Associa com movimentos, situações práticas ou exemplos do dia a dia."
    }
  },
  {
    id: 4,
    question: "Ao receber uma receita culinária nova, você prefere:",
    options: {
      a: "Ver um vídeo mostrando a receita sendo preparada.",
      b: "Ouvir alguém explicando o passo a passo por telefone ou pessoalmente.",
      c: "Ler a receita escrita com todos os detalhes.",
      d: "Ir preparando enquanto aprende, mesmo que erre."
    }
  },
  {
    id: 5,
    question: "Quando está em um museu ou local histórico, o que mais chama sua atenção?",
    options: {
      a: "As imagens, maquetes e exposições visuais.",
      b: "Os áudios com explicações ou guias falando sobre o local.",
      c: "As placas com textos explicativos.",
      d: "As reconstruções interativas ou a possibilidade de tocar objetos."
    }
  },
  {
    id: 6,
    question: "Para aprender um novo idioma, você prefere:",
    options: {
      a: "Usar aplicativos com imagens e associações visuais.",
      b: "Ouvir músicas, podcasts ou conversar com nativos.",
      c: "Ler textos e fazer anotações de vocabulário.",
      d: "Praticar situações reais, como simulações de diálogos."
    }
  },
  {
    id: 7,
    question: "Quando está tentando lembrar o nome de uma pessoa, você costuma:",
    options: {
      a: "Visualizar o rosto dela ou o local onde a viu.",
      b: "Recordar a voz ou a conversa que tiveram.",
      c: "Lembrar como o nome era escrito.",
      d: "Recordar o que estavam fazendo juntos."
    }
  },
  {
    id: 8,
    question: "Diante de um novo conteúdo na escola/faculdade, você sente mais facilidade quando:",
    options: {
      a: "O professor usa esquemas, gráficos e imagens.",
      b: "A explicação é verbal e clara.",
      c: "Há materiais de leitura, apostilas ou slides disponíveis.",
      d: "Você participa de experimentos ou atividades práticas."
    }
  },
  {
    id: 9,
    question: "Em uma loja ou lugar novo, você costuma se orientar melhor:",
    options: {
      a: "Observando placas, mapas ou sinalizações visuais.",
      b: "Perguntando a alguém como chegar ao local.",
      c: "Lendo descrições ou instruções do local.",
      d: "Caminhando, testando caminhos até encontrar."
    }
  },
  {
    id: 10,
    question: "Qual destas atividades você acha mais agradável para aprender algo novo?",
    options: {
      a: "Desenhar ou assistir vídeos explicativos.",
      b: "Participar de discussões em grupo ou ouvir podcasts.",
      c: "Ler livros, artigos e fazer anotações.",
      d: "Praticar diretamente, montar, desmontar, experimentar."
    }
  }
];

type Answer = 'a' | 'b' | 'c' | 'd' | null;

export default function Teste() {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>(new Array(10).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const handleAnswer = (questionIndex: number, answer: Answer) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answer;
    setAnswers(newAnswers);
  };

  const goToNextSection = () => {
    if (currentSection < questions.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const goToPreviousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const canGoNext = () => {
    return answers[currentSection] !== null;
  };

  const finishTest = () => {
    setShowResults(true);
  };

  const calculateResults = () => {
    const scores = { V: 0, A: 0, R: 0, K: 0 };
    
    answers.forEach(answer => {
      if (answer === 'a') scores.V++;
      else if (answer === 'b') scores.A++;
      else if (answer === 'c') scores.R++;
      else if (answer === 'd') scores.K++;
    });

    return scores;
  };

  const restartTest = () => {
    setCurrentSection(0);
    setAnswers(new Array(10).fill(null));
    setShowResults(false);
    setIsStarted(false);
  };

  const goBackToHome = () => {
    navigate('/home');
  };

  if (showResults) {
    return <Resultado scores={calculateResults()} onRestart={restartTest} onBackToHome={goBackToHome} />;
  }

  if (!isStarted) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        {/* Header */}
        <header style={{ backgroundColor: '#150B53', padding: '2rem 0' }}>
          <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
            <div style={{ marginBottom: '1.5rem' }}>
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
          </div>
        </header>

        <div style={{ padding: '4rem 1rem' }}>
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '1rem', 
            boxShadow: '0 1px 7px rgba(57, 0, 227, 0.78)', 
            padding: '3rem', 
            maxWidth: '48rem', 
            width: '100%', 
            margin: '0 auto',
            textAlign: 'center' 
          }}>
            <div style={{ marginBottom: '2rem' }}>
              
              <h1 style={{ 
                fontSize: '2.25rem', 
                fontWeight: 'bold', 
                color: '#111827', 
                marginBottom: '1rem' 
              }}>
                Teste VARK
              </h1>
              <p style={{ 
                color: '#374151', 
                fontSize: '1.125rem', 
                lineHeight: '1.6' 
              }}>
                Descubra seu estilo de aprendizagem preferido e potencialize seus estudos em matemática!
              </p>
            </div>


            <div style={{ 
              backgroundColor: '#CED0FF', 
              padding: '1.5rem', 
              borderRadius: '0.75rem', 
              marginBottom: '2rem' 
            }}>
              <h2 style={{ fontWeight: '600', color: '#111827', marginBottom: '0.75rem' }}>Como funciona:</h2>
              <ul style={{ 
                fontSize: '0.875rem', 
                color: '#374151', 
                listStyle: 'none', 
                padding: 0, 
                margin: 0,
                textAlign: 'left'
              }}>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ 
                    width: '0.5rem', 
                    height: '0.5rem', 
                    backgroundColor: '#150B53', 
                    borderRadius: '50%', 
                    marginRight: '0.75rem' 
                  }}></div>
                  10 perguntas sobre suas preferências de aprendizagem
                </li>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ 
                    width: '0.5rem', 
                    height: '0.5rem', 
                    backgroundColor: '#150B53', 
                    borderRadius: '50%', 
                    marginRight: '0.75rem' 
                  }}></div>
                  Cada pergunta tem 4 alternativas (A, B, C, D)
                </li>
                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ 
                    width: '0.5rem', 
                    height: '0.5rem', 
                    backgroundColor: '#150B53', 
                    borderRadius: '50%', 
                    marginRight: '0.75rem' 
                  }}></div>
                  Resultado personalizado com dicas de estudo
                </li>
                <li style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ 
                    width: '0.5rem', 
                    height: '0.5rem', 
                    backgroundColor: '#150B53', 
                    borderRadius: '50%', 
                    marginRight: '0.75rem' 
                  }}></div>
                  Tempo estimado: 5-10 minutos
                </li>
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => setIsStarted(true)}
                style={{ 
                  backgroundColor: '#150B53', 
                  color: 'white', 
                  padding: '1rem 2rem', 
                  borderRadius: '0.75rem', 
                  fontWeight: '600', 
                  fontSize: '1.125rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 6px rgba(21, 11, 83, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#1a0f5c';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#150B53';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Iniciar Teste
              </button>
              
              <button
                onClick={goBackToHome}
                style={{ 
                  backgroundColor: '#f3f4f6', 
                  color: '#374151', 
                  padding: '1rem 2rem', 
                  borderRadius: '0.75rem', 
                  fontWeight: '600', 
                  fontSize: '1.125rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#e5e7eb';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
              >
                Voltar ao Início
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentSection];
  const progress = ((currentSection + 1) / questions.length) * 100;

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
          {/* Header com progresso */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '1rem', 
            boxShadow: '0 1px 7px rgba(57, 0, 227, 0.78)', 
            padding: '1.5rem', 
            marginBottom: '1.5rem' 
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              marginBottom: '1rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                Teste VARK
              </h1>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Pergunta {currentSection + 1} de {questions.length}
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
                  backgroundColor: '#150B53', 
                  height: '0.75rem', 
                  borderRadius: '9999px', 
                  transition: 'width 0.3s ease',
                  width: `${progress}%`
                }}
              ></div>
            </div>
          </div>

          {/* Pergunta atual */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '1rem', 
            boxShadow: '0 1px 7px rgba(57, 0, 227, 0.78)', 
            padding: '2rem' 
          }}>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                color: '#111827', 
                lineHeight: '1.6',
                margin: 0
              }}>
                {currentQuestion.question}
              </h2>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              {Object.entries(currentQuestion.options).map(([key, option]) => (
                <label
                  key={key}
                  style={{
                    display: 'block',
                    padding: '1rem',
                    border: answers[currentSection] === key ? '2px solid #150B53' : '2px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    marginBottom: '1rem',
                    backgroundColor: answers[currentSection] === key ? '#CED0FF' : 'white'
                  }}
                  onMouseOver={(e) => {
                    if (answers[currentSection] !== key) {
                      e.currentTarget.style.backgroundColor = '#f9fafb';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (answers[currentSection] !== key) {
                      e.currentTarget.style.backgroundColor = 'white';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <input
                      type="radio"
                      name={`question-${currentSection}`}
                      value={key}
                      checked={answers[currentSection] === key}
                      onChange={() => handleAnswer(currentSection, key as Answer)}
                      style={{ 
                        marginTop: '0.25rem', 
                        width: '1rem', 
                        height: '1rem',
                        accentColor: '#150B53'
                      }}
                    />
                    <div>
                      <span style={{ 
                        fontWeight: '600', 
                        color: '#150B53', 
                        marginRight: '0.5rem' 
                      }}>
                        {key.toUpperCase()})
                      </span>
                      <span style={{ color: '#374151' }}>{option}</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {/* Navegação */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <button
                onClick={goToPreviousSection}
                disabled={currentSection === 0}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.75rem',
                  fontWeight: '500',
                  border: 'none',
                  cursor: currentSection === 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  backgroundColor: currentSection === 0 ? '#f3f4f6' : '#e5e7eb',
                  color: currentSection === 0 ? '#9ca3af' : '#374151'
                }}
                onMouseOver={(e) => {
                  if (currentSection !== 0) {
                    e.currentTarget.style.backgroundColor = '#d1d5db';
                  }
                }}
                onMouseOut={(e) => {
                  if (currentSection !== 0) {
                    e.currentTarget.style.backgroundColor = '#e5e7eb';
                  }
                }}
              >
                <ChevronLeft style={{ width: '1rem', height: '1rem' }} />
                <span>Anterior</span>
              </button>

              {currentSection === questions.length - 1 ? (
                <button
                  onClick={finishTest}
                  disabled={!canGoNext()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 2rem',
                    borderRadius: '0.75rem',
                    fontWeight: '600',
                    border: 'none',
                    cursor: canGoNext() ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s',
                    backgroundColor: canGoNext() ? '#16a34a' : '#f3f4f6',
                    color: canGoNext() ? 'white' : '#9ca3af',
                    boxShadow: canGoNext() ? '0 4px 6px rgba(22, 163, 74, 0.3)' : 'none'
                  }}
                  onMouseOver={(e) => {
                    if (canGoNext()) {
                      e.currentTarget.style.backgroundColor = '#15803d';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (canGoNext()) {
                      e.currentTarget.style.backgroundColor = '#16a34a';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  <span>Finalizar Teste</span>
                  <BarChart3 style={{ width: '1rem', height: '1rem' }} />
                </button>
              ) : (
                <button
                  onClick={goToNextSection}
                  disabled={!canGoNext()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.75rem',
                    fontWeight: '500',
                    border: 'none',
                    cursor: canGoNext() ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s',
                    backgroundColor: canGoNext() ? '#150B53' : '#f3f4f6',
                    color: canGoNext() ? 'white' : '#9ca3af',
                    boxShadow: canGoNext() ? '0 4px 6px rgba(21, 11, 83, 0.3)' : 'none'
                  }}
                  onMouseOver={(e) => {
                    if (canGoNext()) {
                      e.currentTarget.style.backgroundColor = '#1a0f5c';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (canGoNext()) {
                      e.currentTarget.style.backgroundColor = '#150B53';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  <span>Próxima</span>
                  <ChevronRight style={{ width: '1rem', height: '1rem' }} />
                </button>
              )}
            </div>
          </div>

          {/* Indicador de seções */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            marginTop: '1.5rem', 
            gap: '0.5rem',
            flexWrap: 'wrap'
          }}>
            {questions.map((_, index) => (
              <div
                key={index}
                style={{
                  width: '0.75rem',
                  height: '0.75rem',
                  borderRadius: '50%',
                  transition: 'all 0.2s',
                  backgroundColor: 
                    index === currentSection
                      ? '#150B53'
                      : answers[index] !== null
                      ? '#16a34a'
                      : '#d1d5db',
                  boxShadow: index === currentSection ? '0 0 0 2px rgba(21, 11, 83, 0.3)' : 'none'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}