import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomeProfessor() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [turmaData, setTurmaData] = useState({
    nome_turma: '',
    codigo_acesso: ''
  });

  const handleCreateTurmaClick = () => {
    setTurmaData({
      nome_turma: '',
      codigo_acesso: ''
    });
    setShowModal(true);
  };

  const handleVerTurmasClick = () => {
    navigate('/MinhasTurmas');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTurmaData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simula um pequeno delay para mostrar o loading
    setTimeout(() => {
      alert('Turma criada com sucesso!');
      setShowModal(false);
      setTurmaData({ nome_turma: '', codigo_acesso: '' });
      setIsLoading(false);
    }, 1000);
  };

  const closeModal = () => {
    setShowModal(false);
    setTurmaData({ nome_turma: '', codigo_acesso: '' });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#150B53', padding: '2rem 0' }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
          {/* Logo */}
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
            Bem-vindo, Professor!<br />
            Gerencie suas turmas com VARK
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
            {/* Identificação de Estilos */}
            <div style={{ 
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
                Identificação de Estilos
              </h3>
              <p style={{ 
                color: '#374151', 
                fontSize: '0.875rem', 
                lineHeight: '1.5' 
              }}>
                Seus alunos podem realizar o teste VARK 
                para identificar suas preferências de 
                aprendizagem, fornecendo insights valiosos 
                para personalizar o ensino.
              </p>
            </div>

            {/* Planejamento Adaptativo */}
            <div style={{ 
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
                Planejamento Adaptativo
              </h3>
              <p style={{ 
                color: '#374151', 
                fontSize: '0.875rem', 
                lineHeight: '1.5' 
              }}>
                Use os resultados do VARK para 
                planejar atividades que contemplem 
                todos os estilos de aprendizagem, 
                garantindo que cada aluno seja 
                atendido adequadamente.
              </p>
            </div>

            {/* Recursos Diversificados */}
            <div style={{ 
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
                Recursos Diversificados
              </h3>
              <p style={{ 
                color: '#374151', 
                fontSize: '0.875rem', 
                lineHeight: '1.5' 
              }}>
                Crie materiais variados: vídeos para 
                visuais, áudios para auditivos, textos 
                para leitura/escrita e atividades 
                práticas para cinestésicos.
              </p>
            </div>

            {/* Acompanhamento Individual */}
            <div style={{ 
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
                Acompanhamento Individual
              </h3>
              <p style={{ 
                color: '#374151', 
                fontSize: '0.875rem', 
                lineHeight: '1.5' 
              }}>
                Monitore o progresso de cada aluno 
                considerando seu estilo de aprendizagem 
                preferido, oferecendo feedback e 
                suporte personalizados.
              </p>
            </div>

            {/* Metodologias Inclusivas */}
            <div style={{ 
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
                Metodologias Inclusivas
              </h3>
              <p style={{ 
                color: '#374151', 
                fontSize: '0.875rem', 
                lineHeight: '1.5' 
              }}>
                Desenvolva estratégias de ensino que 
                integrem múltiplos estilos de 
                aprendizagem, criando um ambiente 
                inclusivo e eficaz para todos.
              </p>
            </div>

            {/* Avaliação Diferenciada */}
            <div style={{ 
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
                Avaliação Diferenciada
              </h3>
              <p style={{ 
                color: '#374151', 
                fontSize: '0.875rem', 
                lineHeight: '1.5' 
              }}>
                Implemente formas variadas de 
                avaliação que permitam aos alunos 
                demonstrar seu conhecimento através 
                de seus estilos preferenciais.
              </p>
            </div>
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
            {/* Auditivos */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'row', 
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
                  Auditivos
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#374151' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <span style={{ color: '#10b981', marginRight: '0.5rem' }}>✓</span>
                    <span>Preferem ouvir explicações e conversas em voz alta;</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <span style={{ color: '#10b981', marginRight: '0.5rem' }}>✓</span>
                    <span>Lembram de detalhes de sons ou palavras ouvidas com clareza;</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <span style={{ color: '#10b981', marginRight: '0.5rem' }}>✓</span>
                    <span>Tendem a gostar de músicas ou gravações relacionadas ao conteúdo.</span>
                  </div>
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

            {/* Cinestésicos */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'row-reverse', 
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
                  Cinestésicos
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#374151' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <span style={{ color: '#10b981', marginRight: '0.5rem' }}>✓</span>
                    <span>Aprendem melhor por meio da prática e experiências;</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <span style={{ color: '#10b981', marginRight: '0.5rem' }}>✓</span>
                    <span>Tendem a lembrar do que fizeram ou sentiram fisicamente durante o aprendizado;</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <span style={{ color: '#10b981', marginRight: '0.5rem' }}>✓</span>
                    <span>Preferem atividades práticas, simulações, experimentos e uso do corpo no processo de aprendizagem.</span>
                  </div>
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

            {/* Visuais */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'row', 
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
                  Visuais
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#374151' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <span style={{ color: '#10b981', marginRight: '0.5rem' }}>✓</span>
                    <span>Preferem imagens, gráficos, diagramas e cores;</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <span style={{ color: '#10b981', marginRight: '0.5rem' }}>✓</span>
                    <span>Têm facilidade em lembrar o que viram, como esquemas ou mapas mentais;</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <span style={{ color: '#10b981', marginRight: '0.5rem' }}>✓</span>
                    <span>Gostam de materiais com organização visual clara, como quadros, slides e vídeos.</span>
                  </div>
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

            {/* Leitura/Escrita */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'row-reverse', 
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
                  Leitura/Escrita
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#374151' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <span style={{ color: '#10b981', marginRight: '0.5rem' }}>✓</span>
                    <span>Preferem aprender por meio de textos e materiais escritos;</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <span style={{ color: '#10b981', marginRight: '0.5rem' }}>✓</span>
                    <span>Têm facilidade em ler, escrever e reescrever informações para memorizar conteúdos;</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <span style={{ color: '#10b981', marginRight: '0.5rem' }}>✓</span>
                    <span>Tendem a organizar o aprendizado com resumos, esquemas, artigos e manuais.</span>
                  </div>
                </div>
              </div>
              <div style={{ flex: '1', minWidth: '300px', display: 'flex', justifyContent: 'center' }}>
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
            </div>
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
                <input
                  type="text"
                  name="codigo_acesso"
                  value={turmaData.codigo_acesso}
                  onChange={handleInputChange}
                  required
                  placeholder="Digite o código que os alunos usarão"
                  maxLength="20"
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
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: '2px solid #CED0FF',
                    backgroundColor: 'white',
                    color: '#374151',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
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