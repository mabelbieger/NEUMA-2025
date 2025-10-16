import React, { useState } from 'react';

export default function Visual() {
  const [selectedContent, setSelectedContent] = useState(null);

  const handleBackToHome = () => {
    console.log('Navigate back to home');
  };

  const handleContentClick = (content) => {
    setSelectedContent(selectedContent === content ? null : content);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
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
              Sistema Visual
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
            backgroundColor: '#CED0FF',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              backgroundColor: '#150B53',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '1rem'
            }}>
              Turma 63 1
            </div>
            
            <p style={{
              color: '#374151',
              textAlign: 'center',
              margin: 0,
              fontSize: '1rem'
            }}>
              Sistema Sensorial: <strong>Visual</strong>
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
              📊 Aprendizagem Visual
            </h2>
            
            <p style={{
              color: '#374151',
              lineHeight: '1.6',
              fontSize: '1rem',
              maxWidth: '48rem',
              margin: '0 auto'
            }}>
              Você aprende melhor através de <strong>imagens, gráficos e elementos visuais</strong>. 
              Prefere materiais organizados visualmente com cores e diagramas.
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
              📚 Atividades por Conteúdo
            </h3>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <button
                onClick={() => handleContentClick('circunferencia')}
                style={{
                  backgroundColor: selectedContent === 'circunferencia' ? '#150B53' : '#CED0FF',
                  color: selectedContent === 'circunferencia' ? 'white' : '#150B53',
                  border: 'none',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  if (selectedContent !== 'circunferencia') {
                    e.target.style.backgroundColor = '#150B53';
                    e.target.style.color = 'white';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedContent !== 'circunferencia') {
                    e.target.style.backgroundColor = '#CED0FF';
                    e.target.style.color = '#150B53';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '0.75rem' }}>⭕</span>
                  Circunferência
                </div>
                <span style={{ 
                  transform: selectedContent === 'circunferencia' ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease'
                }}>
                  ▼
                </span>
              </button>

              {selectedContent === 'circunferencia' && (
                <div style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: '0.75rem',
                  padding: '2rem',
                  border: '2px solid #CED0FF',
                  animation: 'fadeIn 0.3s ease-in'
                }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem'
                  }}>
                    {/* Mind Map */}
                    <div style={{
                      backgroundColor: 'white',
                      padding: '1.5rem',
                      borderRadius: '0.75rem',
                      textAlign: 'center',
                      border: '2px solid #CED0FF'
                    }}>
                      <img 
                        src="/imagens/mapaMentalNeuma.png" 
                        alt="Mapa Mental da Circunferência"
                        style={{
                          width: '100%',
                          maxWidth: '280px',
                          height: 'auto'
                        }}
                      />
                    </div>

                    {/* Text Content */}
                    <div style={{
                      backgroundColor: 'white',
                      padding: '1.5rem',
                      borderRadius: '0.75rem',
                      textAlign: 'left',
                      fontSize: '0.9rem',
                      lineHeight: '1.6',
                      color: '#374151',
                      border: '2px solid #CED0FF'
                    }}>
                      <p><strong>A circunferência</strong> é o conjunto de todos os pontos de um plano que estão a uma distância fixa de um ponto chamado <strong>centro</strong>. Essa distância constante é denominada <strong>raio</strong>.</p>
                      
                      <p>Em outras palavras, se marcarmos um ponto no plano (o centro) e traçarmos uma linha com comprimento fixo em todas as direções, o caminho formado será uma circunferência. É a base para muitos estudos geométricos, além de ter diversas aplicações práticas no cotidiano.</p>

                      <p><strong>Elementos da Circunferência</strong></p>
                      <ul style={{ paddingLeft: '1.2rem' }}>
                        <li><strong>Centro</strong>: ponto fixo que serve de referência para todos os demais da circunferência.</li>
                        <li><strong>Raio</strong>: segmento que liga o centro a qualquer ponto da circunferência. É a medida que define o "tamanho" da circunferência.</li>
                        <li><strong>Diâmetro</strong>: segmento que liga dois pontos da circunferência passando pelo centro. O diâmetro é sempre o dobro do raio.</li>
                        <li><strong>Corda</strong>: segmento de reta que une dois pontos da circunferência, sem a necessidade de passar pelo centro.</li>
                        <li><strong>Arco</strong>: cada parte da circunferência compreendida entre dois pontos. Pode ser classificado como arco menor, arco maior ou semicircunferência, dependendo da extensão.</li>
                      </ul>

                      <p><strong>Comprimento da circunferência</strong>: corresponde à medida do seu contorno e pode ser calculado pela fórmula C=2πr ou C=πd onde r é o raio e d o diâmetro.</p>

                      <p><strong>Diferença entre Circunferência e Círculo</strong></p>
                      <p>Um erro comum é confundir circunferência com círculo. A circunferência corresponde apenas à <strong>linha curva fechada</strong> que delimita a figura. Já o círculo é a <strong>região interna</strong> delimitada pela circunferência.</p>

                      <p><strong>Importância e Aplicações</strong></p>
                      <p>A circunferência não está presente apenas na matemática abstrata, mas também no mundo real. Relógios, rodas, moedas, pratos, campos esportivos e até construções arquitetônicas utilizam seus princípios. Além disso, o estudo das circunferências é essencial em áreas como a <strong>trigonometria</strong>, a <strong>física</strong> (movimentos circulares, engrenagens, órbitas) e a <strong>engenharia</strong>.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

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
              marginBottom: '1.5rem'
            }}>
              💡 Dicas para Aprendizes Visuais
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginTop: '1.5rem'
            }}>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '1rem',
                borderRadius: '0.5rem'
              }}>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>
                  📊 Use gráficos e diagramas
                </p>
              </div>
              
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '1rem',
                borderRadius: '0.5rem'
              }}>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>
                  🎨 Destaque com cores
                </p>
              </div>
              
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '1rem',
                borderRadius: '0.5rem'
              }}>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>
                  🧠 Crie mapas mentais
                </p>
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