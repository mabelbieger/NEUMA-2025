import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

interface TurmaData {
  nome_turma: string;
  codigo_acesso: string;
}

export default function HomeProfessor() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [idProfessor, setIdProfessor] = useState<number | null>(null);
  const [turmaData, setTurmaData] = useState<TurmaData>({
    nome_turma: '',
    codigo_acesso: ''
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

    // Buscar id_professor se não estiver salvo
    if (user.id_professor) {
      setIdProfessor(user.id_professor);
    } else if (user.id) {
      buscarIdProfessor(user.id);
    }
  }, [navigate]);

  const buscarIdProfessor = async (idUsuario: number) => {
    try {
      const response = await axios.get(`${API_URL}/professor/${idUsuario}`);
      
      if (response.data.success) {
        setIdProfessor(response.data.id_professor);
        
        // Atualiza o localStorage com o id_professor
        const loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');
        loggedUser.id_professor = response.data.id_professor;
        localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
      }
    } catch (error) {
      console.error('Erro ao buscar id_professor:', error);
    }
  };

  const handleCreateTurmaClick = () => {
    setTurmaData({
      nome_turma: '',
      codigo_acesso: ''
    });
    setError('');
    setShowModal(true);
  };

  const handleVerTurmasClick = () => {
    navigate('/MinhasTurmas');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTurmaData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const gerarCodigoAleatorio = () => {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numeros = '0123456789';
    let codigo = '';
    
    for (let i = 0; i < 2; i++) {
      codigo += letras.charAt(Math.floor(Math.random() * letras.length));
    }
    
    for (let i = 0; i < 4; i++) {
      codigo += numeros.charAt(Math.floor(Math.random() * numeros.length));
    }
    
    codigo += letras.charAt(Math.floor(Math.random() * letras.length));
    
    return codigo;
  };

  const handleGerarCodigo = () => {
    const novoCodigo = gerarCodigoAleatorio();
    setTurmaData(prev => ({
      ...prev,
      codigo_acesso: novoCodigo
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!idProfessor) {
      setError('ID do professor não encontrado. Faça login novamente.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/turmas`, {
        id_professor: idProfessor,
        nome_turma: turmaData.nome_turma.trim(),
        codigo_acesso: turmaData.codigo_acesso.trim().toUpperCase()
      });

      if (response.data.success) {
        alert('Turma criada com sucesso!');
        setShowModal(false);
        setTurmaData({ nome_turma: '', codigo_acesso: '' });
      } else {
        setError(response.data.message || 'Erro ao criar turma');
      }
    } catch (err: any) {
      console.error('Erro ao criar turma:', err);
      setError(err.response?.data?.message || 'Erro ao criar turma. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setTurmaData({ nome_turma: '', codigo_acesso: '' });
    setError('');
  };

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
                width: '10rem', 
                height: '10rem', 
                margin: '0 auto', 
                display: 'block',
                objectFit: 'contain'
              }} 
            />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ backgroundColor: 'white', padding: '4rem 0' }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '2.25rem', 
            fontWeight: 'bold', 
            color: '#111827', 
            marginBottom: '1.5rem',
            lineHeight: '1.2'
          }}>
            Bem-vindo(a), Professor(a)!<br />
            Gerencie suas turmas com o VARK
          </h1>
          
          <p style={{ 
            color: '#374151', 
            maxWidth: '48rem', 
            margin: '0 auto 2rem auto', 
            lineHeight: '1.6',
            fontSize: '1rem'
          }}>
            O VARK é uma abordagem que identifica quatro estilos de 
            aprendizagem — <strong>Visual, Auditivo, Leitura/Escrita e Cinestésico</strong> — 
            para entender como cada pessoa prefere receber informações. 
            Crie turmas personalizadas e adapte seu ensino às necessidades 
            individuais dos seus alunos.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={handleCreateTurmaClick}
              style={{ 
                backgroundColor: '#150B53', 
                color: 'white', 
                padding: '0.75rem 2rem', 
                borderRadius: '0.5rem', 
                fontWeight: '600', 
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'background-color 0.2s'
              }}
            >
              Criar Nova Turma
            </button>
            
            <button 
              onClick={handleVerTurmasClick}
              style={{ 
                backgroundColor: '#CED0FF', 
                color: '#150B53', 
                padding: '0.75rem 2rem', 
                borderRadius: '0.5rem', 
                fontWeight: '600', 
                border: '2px solid #150B53',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'background-color 0.2s'
              }}
            >
              Ver Minhas Turmas
            </button>
          </div>
        </div>
      </section>

      {/* VARK Section */}
      <section style={{ backgroundColor: '#CED0FF', padding: '4rem 0' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ 
              fontSize: '1.875rem', 
              fontWeight: 'bold', 
              color: '#111827', 
              marginBottom: '1.5rem' 
            }}>
              VARK para Professores
            </h2>
            <p style={{ 
              color: '#374151', 
              maxWidth: '64rem', 
              margin: '0 auto', 
              lineHeight: '1.6'
            }}>
              Como professor, você pode utilizar o VARK para criar um ambiente 
              de aprendizagem mais inclusivo e eficaz. Identifique os estilos de 
              aprendizagem dos seus alunos e adapte suas metodologias para 
              maximizar o potencial de cada estudante.
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem', 
            marginBottom: '3rem' 
          }}>
            {[
              {
                titulo: 'Identificação de Estilos',
                texto: 'Seus alunos podem realizar o teste VARK para identificar suas preferências de aprendizagem, fornecendo insights valiosos para personalizar o ensino.'
              },
              {
                titulo: 'Planejamento Adaptativo',
                texto: 'Use os resultados do VARK para planejar atividades que contemplem todos os estilos de aprendizagem, garantindo que cada aluno seja atendido adequadamente.'
              },
              {
                titulo: 'Recursos Diversificados',
                texto: 'Crie materiais variados: vídeos para visuais, áudios para auditivos, textos para leitura/escrita e atividades práticas para cinestésicos.'
              },
              {
                titulo: 'Acompanhamento Individual',
                texto: 'Monitore o progresso de cada aluno considerando seu estilo de aprendizagem preferido, oferecendo feedback e suporte personalizados.'
              },
              {
                titulo: 'Metodologias Inclusivas',
                texto: 'Desenvolva estratégias de ensino que integrem múltiplos estilos de aprendizagem, criando um ambiente inclusivo e eficaz para todos.'
              },
              {
                titulo: 'Avaliação Diferenciada',
                texto: 'Implemente formas variadas de avaliação que permitam aos alunos demonstrar seu conhecimento através de seus estilos preferenciais.'
              }
            ].map((item, index) => (
              <div key={index} style={{ 
                backgroundColor: 'white', 
                padding: '1.5rem', 
                borderRadius: '0.5rem', 
                boxShadow: '0 1px 7px rgba(57, 0, 227, 0.78)' 
              }}>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold', 
                  color: '#111827', 
                  marginBottom: '1rem' 
                }}>
                  {item.titulo}
                </h3>
                <p style={{ 
                  color: '#374151', 
                  fontSize: '0.875rem', 
                  lineHeight: '1.5' 
                }}>
                  {item.texto}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Systems Section */}
      <section style={{ backgroundColor: 'white', padding: '4rem 0' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ 
              fontSize: '1.875rem', 
              fontWeight: 'bold', 
              color: '#111827', 
              marginBottom: '1.5rem' 
            }}>
              Sistemas Sensoriais
            </h2>
            <p style={{ 
              color: '#374151', 
              maxWidth: '64rem', 
              margin: '0 auto', 
              lineHeight: '1.6' 
            }}>
              O VARK identifica quatro principais sistemas sensoriais: visual, 
              auditivo, cinestésico e leitura/escrita, que influenciam como cada 
              pessoa aprende e percebe o mundo ao seu redor.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {[
              {
                titulo: 'Auditivos',
                itens: [
                  'Preferem ouvir explicações e conversas em voz alta',
                  'Lembram de detalhes de sons ou palavras ouvidas com clareza',
                  'Tendem a gostar de músicas ou gravações relacionadas ao conteúdo'
                ],
                reverse: false
              },
              {
                titulo: 'Cinestésicos',
                itens: [
                  'Aprendem melhor por meio da prática e experiências',
                  'Tendem a lembrar do que fizeram ou sentiram fisicamente durante o aprendizado',
                  'Preferem atividades práticas, simulações, experimentos e uso do corpo no processo de aprendizagem'
                ],
                reverse: true
              },
              {
                titulo: 'Visuais',
                itens: [
                  'Preferem imagens, gráficos, diagramas e cores',
                  'Têm facilidade em lembrar o que viram, como esquemas ou mapas mentais',
                  'Gostam de materiais com organização visual clara, como quadros, slides e vídeos'
                ],
                reverse: false
              },
              {
                titulo: 'Leitura/Escrita',
                itens: [
                  'Preferem aprender por meio de textos e materiais escritos',
                  'Têm facilidade em ler, escrever e reescrever informações para memorizar conteúdos',
                  'Tendem a organizar o aprendizado com resumos, esquemas, artigos e manuais'
                ],
                reverse: true
              }
            ].map((sistema, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                flexDirection: sistema.reverse ? 'row-reverse' : 'row', 
                alignItems: 'center', 
                gap: '2rem',
                flexWrap: 'wrap'
              }}>
                <div style={{ flex: '1', minWidth: '300px' }}>
                  <h3 style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold', 
                    color: '#111827', 
                    marginBottom: '1rem' 
                  }}>
                    {sistema.titulo}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#374151' }}>
                    {sistema.itens.map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start' }}>
                        <span style={{ color: '#10b981', marginRight: '0.5rem' }}>✓</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ 
                  flex: '1', 
                  minWidth: '300px', 
                  display: 'flex', 
                  justifyContent: 'center' 
                }}>
                  <img 
                    src="/imagens/brain.png" 
                    alt="Brain" 
                    style={{ 
                      width: '20rem', 
                      height: '12rem', 
                      borderRadius: '0.5rem', 
                      objectFit: 'cover', 
                      display: 'block' 
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#CED0FF', padding: '1rem 1rem' }}>
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

      {/* Modal para criar turma */}
      {showModal && (
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
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
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
                Criar Nova Turma
              </h2>
              <button
                onClick={closeModal}
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

            {error && (
              <div style={{
                backgroundColor: '#fee2e2',
                border: '1px solid #ef4444',
                color: '#991b1b',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                marginBottom: '1rem',
                fontSize: '0.875rem'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Nome da Turma *
                </label>
                <input
                  type="text"
                  name="nome_turma"
                  value={turmaData.nome_turma}
                  onChange={handleInputChange}
                  required
                  placeholder="Ex: Matemática - 1º Ano"
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

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Código de Acesso *
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    name="codigo_acesso"
                    value={turmaData.codigo_acesso}
                    onChange={handleInputChange}
                    required
                    placeholder="Ex: AB1234C"
                    maxLength={10}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      border: '2px solid #CED0FF',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      outline: 'none',
                      textTransform: 'uppercase'
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleGerarCodigo}
                    style={{
                      padding: '0.75rem 1rem',
                      backgroundColor: '#059669',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontWeight: '500',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    🎲 Gerar
                  </button>
                </div>
                <p style={{
                  fontSize: '0.75rem',
                  color: '#666',
                  marginTop: '0.25rem'
                }}>
                  Os alunos usarão este código para ingressar na turma
                </p>
              </div>

              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isLoading}
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: '2px solid #CED0FF',
                    backgroundColor: 'white',
                    color: '#374151',
                    borderRadius: '0.5rem',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !turmaData.nome_turma.trim() || !turmaData.codigo_acesso.trim()}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: isLoading || !turmaData.nome_turma.trim() || !turmaData.codigo_acesso.trim() ? '#cccccc' : '#150B53',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: isLoading || !turmaData.nome_turma.trim() || !turmaData.codigo_acesso.trim() ? 'not-allowed' : 'pointer',
                    fontWeight: '500'
                  }}
                >
                  {isLoading ? 'Criando...' : 'Criar Turma'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}