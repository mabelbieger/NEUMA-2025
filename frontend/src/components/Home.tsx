import React from 'react';

export default function Home() {
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
            Site para estímulo do VARK na<br />
            disciplina de Matemática
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
            Conhecer esses estilos permite adaptar o ensino às necessidades 
            individuais dos alunos, tornando o aprendizado mais eficaz.
          </p>
          
          <button style={{ 
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
            Realizar o Teste VARK
          </button>
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
              VARK
            </h2>
            <p style={{ 
              color: '#374151', 
              maxWidth: '64rem', 
              margin: '0 auto', 
              lineHeight: '1.6'
            }}>
              O VARK é uma abordagem que identifica quatro estilos de 
              aprendizagem — <strong>Visual, Auditivo, Leitura/Escrita e Cinestésico</strong> — 
              para entender como cada pessoa prefere receber informações. O 
              objetivo é melhorar a comunicação no ensino e promover um 
              aprendizado mais eficaz, de acordo com os métodos de acordo com os 
              estilos de aprendizagem.
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem', 
            marginBottom: '3rem' 
          }}>
            {/* O que é VARK? */}
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
                O que é VARK?
              </h3>
              <p style={{ 
                color: '#374151', 
                fontSize: '0.875rem', 
                lineHeight: '1.5' 
              }}>
                Modelo que categoriza as preferências individuais de 
                aprendizagem em quatro estilos: 
                Visual, Auditivo, Leitura/
                Escrita e Cinestésico.
              </p>
            </div>

            {/* Adaptação */}
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
                Adaptação
              </h3>
              <p style={{ 
                color: '#374151', 
                fontSize: '0.875rem', 
                lineHeight: '1.5' 
              }}>
                Adequar estratégias de ensino 
                para tornar o aprendizado mais 
                eficaz e significativo, 
                respeitando as formas únicas 
                de interação com o conteúdo.
              </p>
            </div>

            {/* Melhora na Comunicação */}
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
                Melhora na Comunicação
              </h3>
              <p style={{ 
                color: '#374151', 
                fontSize: '0.875rem', 
                lineHeight: '1.5' 
              }}>
                Adaptar o ensino ao estilo 
                do aluno torna a 
                comunicação mais clara e 
                compreensível mais eficaz.
              </p>
            </div>

            {/* Estilos de Aprendizagem */}
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
                Estilos de Aprendizagem
              </h3>
              <p style={{ 
                color: '#374151', 
                fontSize: '0.875rem', 
                lineHeight: '1.5' 
              }}>
                Propõe que os indivíduos 
                aprendem melhor quando o 
                conteúdo é apresentado de 
                acordo com seu estilo preferido. 
                Conhecer esses estilos permite 
                otimizar o ensino para maximizar 
                a assimilação do conteúdo.
              </p>
            </div>

            {/* Dificuldades de Aprendizagem */}
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
                Dificuldades de Aprendizagem
              </h3>
              <p style={{ 
                color: '#374151', 
                fontSize: '0.875rem', 
                lineHeight: '1.5' 
              }}>
                Ajuda a identificar quando há 
                desalinhamento entre o 
                método de ensino e o estilo do 
                aluno, oferecendo alternativas do 
                desempenho acadêmico de 
                forma personalizada.
              </p>
            </div>

            {/* Aplicações do VARK */}
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
                Aplicações do VARK
              </h3>
              <p style={{ 
                color: '#374151', 
                fontSize: '0.875rem', 
                lineHeight: '1.5' 
              }}>
                Utilizado em contextos 
                como educação, 
                treinamento corporativo, 
                orientação profissional e 
                desenvolvimento pessoal.
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
                  width: '16rem', 
                  height: '12rem', 
                  background: 'linear-gradient(to right, #7c3aed, #2563eb)', 
                  borderRadius: '0.5rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
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
        </div>
      </section>

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



    </div>
  );
}