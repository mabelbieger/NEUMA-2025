import React, { useState, useEffect } from 'react';

export default function MinhasTurmas() {
  const [turmas, setTurmas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAtividades, setShowAtividades] = useState(false);
  const [categoriasSensoriais] = useState([
    { id: 1, nome: 'Visual', cor: '#3B82F6' },
    { id: 2, nome: 'Auditivo', cor: '#10B981' },
    { id: 3, nome: 'Cinestésico', cor: '#F59E0B' },
    { id: 4, nome: 'Leitura e Escrita', cor: '#8B5CF6' }
  ]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [turmasSelecionadas, setTurmasSelecionadas] = useState(new Set());
  const [atividades, setAtividades] = useState([]);
  const [showAdicionarAtividade, setShowAdicionarAtividade] = useState(false);
  const [novaAtividade, setNovaAtividade] = useState({
    titulo: '',
    descricao: '',
    tipo: 'TEXTO',
    arquivo: null,
    textoConteudo: ''
  });

  useEffect(() => {
    carregarTurmas();
  }, []);

  const carregarTurmas = () => {
    // Simulando dados com a turma 63 1 já criada
    const turmasSimuladas = [
      {
        id: 63,
        nome_turma: "Turma 63 1",
        codigo_acesso: "QM2025A",
        data_criacao: "2025-08-18T00:00:00.000Z"
      }
    ];
    
    setTimeout(() => {
      setTurmas(turmasSimuladas);
      setIsLoading(false);
    }, 1000);
  };

  const voltarPagina = () => {
    window.history.back();
  };

  const verAlunosTurma = (idTurma, nomeTurma) => {
    alert(`Visualizando alunos da ${nomeTurma}`);
  };

  const excluirTurma = (idTurma, nomeTurma) => {
    if (window.confirm(`Tem certeza que deseja excluir a turma "${nomeTurma}"?`)) {
      alert('Turma excluída com sucesso!');
      setTurmas(turmas.filter(t => t.id !== idTurma));
    }
  };

  const copiarCodigo = (codigo) => {
    navigator.clipboard.writeText(codigo).then(() => {
      alert('Código copiado!');
    });
  };

  const selecionarCategoria = (categoria) => {
    setCategoriaSelecionada(categoria);
    setTurmasSelecionadas(new Set());
  };

  const toggleTurmaSelecionada = (turmaId) => {
    const novaSelecao = new Set(turmasSelecionadas);
    if (novaSelecao.has(turmaId)) {
      novaSelecao.delete(turmaId);
    } else {
      novaSelecao.add(turmaId);
    }
    setTurmasSelecionadas(novaSelecao);
  };

  const adicionarNovaAtividade = () => {
    if (!novaAtividade.titulo || !categoriaSelecionada) {
      alert('Preencha pelo menos o título e selecione uma categoria!');
      return;
    }

    const atividade = {
      id: Date.now(),
      titulo: novaAtividade.titulo,
      descricao: novaAtividade.descricao,
      categoria: categoriaSelecionada.id,
      tipo: novaAtividade.tipo,
      arquivo: novaAtividade.arquivo,
      textoConteudo: novaAtividade.textoConteudo,
      dataAdicao: new Date().toLocaleDateString('pt-BR')
    };

    setAtividades([...atividades, atividade]);
    
    setNovaAtividade({
      titulo: '',
      descricao: '',
      tipo: 'TEXTO',
      arquivo: null,
      textoConteudo: ''
    });
    setShowAdicionarAtividade(false);
    
    alert('Atividade adicionada com sucesso!');
  };

  const handleArquivoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      let tipo = 'ARQUIVO';
      const extension = file.name.toLowerCase();
      
      if (extension.includes('.pdf')) tipo = 'PDF';
      else if (extension.includes('.jpg') || extension.includes('.jpeg') || extension.includes('.png') || extension.includes('.gif')) tipo = 'IMAGEM';
      else if (extension.includes('.mp4') || extension.includes('.avi') || extension.includes('.mov')) tipo = 'VIDEO';
      else if (extension.includes('.mp3') || extension.includes('.wav') || extension.includes('.ogg')) tipo = 'AUDIO';
      
      setNovaAtividade(prev => ({
        ...prev,
        arquivo: file,
        tipo: tipo
      }));
    }
  };

  const removerAtividade = (atividadeId) => {
    setAtividades(atividades.filter(a => a.id !== atividadeId));
    alert('Atividade removida!');
  };

  const adicionarAtividadesTurmas = () => {
    if (!categoriaSelecionada || turmasSelecionadas.size === 0) {
      alert('Selecione uma categoria e pelo menos uma turma!');
      return;
    }

    const atividadesDaCategoria = atividades.filter(a => a.categoria === categoriaSelecionada.id);
    
    if (atividadesDaCategoria.length === 0) {
      alert('Não há atividades cadastradas para esta categoria. Adicione algumas atividades primeiro!');
      return;
    }

    const turmasNomes = Array.from(turmasSelecionadas).map(id => 
      turmas.find(t => t.id === id)?.nome_turma
    ).join(', ');

    alert(`${atividadesDaCategoria.length} atividades da categoria "${categoriaSelecionada.nome}" foram adicionadas às turmas: ${turmasNomes}`);
    
    // Reset
    setCategoriaSelecionada(null);
    setTurmasSelecionadas(new Set());
    setShowAtividades(false);
  };

  const atividadesFiltradas = categoriaSelecionada 
    ? atividades.filter(a => a.categoria === categoriaSelecionada.id)
    : [];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <header style={{ backgroundColor: '#150B53', padding: '2rem 0' }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              onClick={voltarPagina}
              style={{
                backgroundColor: 'transparent',
                border: '2px solid white',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              ← Voltar
            </button>
            
            <div style={{ textAlign: 'center' }}>
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
            
            <div style={{ width: '120px' }}></div>
          </div>
        </div>
      </header>

      <main style={{ padding: '3rem 0' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{
              fontSize: '2.25rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '1rem'
            }}>
              Minhas Turmas
            </h1>
            <p style={{
              color: '#374151',
              fontSize: '1.1rem',
              maxWidth: '48rem',
              margin: '0 auto'
            }}>
              Gerencie suas turmas e adicione atividades personalizadas por perfil sensorial
            </p>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <button
              onClick={() => setShowAtividades(!showAtividades)}
              style={{
                backgroundColor: '#059669',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '0.75rem',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                marginRight: '1rem'
              }}
            >
              🎯 Gerenciar Atividades por Perfil
            </button>
          </div>

          {showAtividades && (
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              marginBottom: '2rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
              border: '2px solid #e5e7eb'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '1.5rem',
                color: '#111827'
              }}>
                Sistema de Atividades Adaptativas
              </h2>

              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: '600' }}>
                  1. Selecione o Perfil Sensorial:
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem'
                }}>
                  {categoriasSensoriais.map(categoria => (
                    <button
                      key={categoria.id}
                      onClick={() => selecionarCategoria(categoria)}
                      style={{
                        backgroundColor: categoriaSelecionada?.id === categoria.id ? categoria.cor : 'white',
                        color: categoriaSelecionada?.id === categoria.id ? 'white' : categoria.cor,
                        border: `2px solid ${categoria.cor}`,
                        padding: '1rem',
                        borderRadius: '0.75rem',
                        cursor: 'pointer',
                        fontWeight: '600',
                        transition: 'all 0.2s'
                      }}
                    >
                      {categoria.nome}
                    </button>
                  ))}
                </div>
              </div>

              {categoriaSelecionada && (
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: 0 }}>
                      Atividades - {categoriaSelecionada.nome}:
                    </h3>
                    <button
                      onClick={() => setShowAdicionarAtividade(true)}
                      style={{
                        backgroundColor: categoriaSelecionada.cor,
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '500'
                      }}
                    >
                      + Adicionar Atividade
                    </button>
                  </div>
                  
                  {atividadesFiltradas.length === 0 ? (
                    <div style={{
                      backgroundColor: '#f8fafc',
                      padding: '2rem',
                      borderRadius: '0.5rem',
                      border: '2px dashed #cbd5e1',
                      textAlign: 'center'
                    }}>
                      <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>
                        Nenhuma atividade cadastrada para esta categoria.
                        <br />Clique em "Adicionar Atividade" para começar!
                      </p>
                    </div>
                  ) : (
                    <div style={{
                      backgroundColor: '#f8fafc',
                      padding: '1rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #e2e8f0'
                    }}>
                      {atividadesFiltradas.map(atividade => (
                        <div key={atividade.id} style={{
                          padding: '0.75rem',
                          borderBottom: '1px solid #e2e8f0',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div>
                            <strong>{atividade.titulo}</strong>
                            <p style={{ margin: '0.25rem 0', color: '#666', fontSize: '0.9rem' }}>
                              {atividade.descricao}
                            </p>
                            {atividade.arquivo && (
                              <p style={{ margin: '0.25rem 0', color: '#059669', fontSize: '0.8rem' }}>
                                📎 {atividade.arquivo.name}
                              </p>
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <span style={{
                              backgroundColor: categoriaSelecionada.cor,
                              color: 'white',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '0.25rem',
                              fontSize: '0.8rem'
                            }}>
                              {atividade.tipo}
                            </span>
                            <button
                              onClick={() => removerAtividade(atividade.id)}
                              style={{
                                backgroundColor: '#dc2626',
                                color: 'white',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '0.25rem',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '0.8rem'
                              }}
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {showAdicionarAtividade && categoriaSelecionada && (
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
                    maxWidth: '500px',
                    width: '90%',
                    maxHeight: '80vh',
                    overflow: 'auto'
                  }}>
                    <h3 style={{
                      marginBottom: '1.5rem',
                      fontSize: '1.3rem',
                      fontWeight: 'bold',
                      color: categoriaSelecionada.cor
                    }}>
                      Nova Atividade - {categoriaSelecionada.nome}
                    </h3>

                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Título da Atividade *
                      </label>
                      <input
                        type="text"
                        value={novaAtividade.titulo}
                        onChange={(e) => setNovaAtividade(prev => ({ ...prev, titulo: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '0.5rem',
                          border: '1px solid #d1d5db',
                          fontSize: '1rem'
                        }}
                        placeholder="Ex: Experimento de Densidade"
                      />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Descrição
                      </label>
                      <textarea
                        value={novaAtividade.descricao}
                        onChange={(e) => setNovaAtividade(prev => ({ ...prev, descricao: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '0.5rem',
                          border: '1px solid #d1d5db',
                          fontSize: '1rem',
                          minHeight: '80px',
                          resize: 'vertical'
                        }}
                        placeholder="Descreva brevemente a atividade..."
                      />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Tipo de Conteúdo
                      </label>
                      <select
                        value={novaAtividade.tipo}
                        onChange={(e) => setNovaAtividade(prev => ({ ...prev, tipo: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '0.5rem',
                          border: '1px solid #d1d5db',
                          fontSize: '1rem'
                        }}
                      >
                        <option value="TEXTO">Texto</option>
                        <option value="PDF">PDF</option>
                        <option value="IMAGEM">Imagem</option>
                        <option value="VIDEO">Vídeo</option>
                        <option value="AUDIO">Áudio</option>
                        <option value="PRATICA">Atividade Prática</option>
                      </select>
                    </div>

                    {novaAtividade.tipo === 'TEXTO' ? (
                      <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                          Conteúdo do Texto
                        </label>
                        <textarea
                          value={novaAtividade.textoConteudo}
                          onChange={(e) => setNovaAtividade(prev => ({ ...prev, textoConteudo: e.target.value }))}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            border: '1px solid #d1d5db',
                            fontSize: '1rem',
                            minHeight: '120px',
                            resize: 'vertical'
                          }}
                          placeholder="Digite o texto da atividade aqui..."
                        />
                      </div>
                    ) : (
                      <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                          Arquivo ({novaAtividade.tipo})
                        </label>
                        <input
                          type="file"
                          onChange={handleArquivoChange}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            border: '1px solid #d1d5db',
                            fontSize: '1rem'
                          }}
                          accept={
                            novaAtividade.tipo === 'PDF' ? '.pdf' :
                            novaAtividade.tipo === 'IMAGEM' ? '.jpg,.jpeg,.png,.gif' :
                            novaAtividade.tipo === 'VIDEO' ? '.mp4,.avi,.mov' :
                            novaAtividade.tipo === 'AUDIO' ? '.mp3,.wav,.ogg' : '*'
                          }
                        />
                        {novaAtividade.arquivo && (
                          <p style={{ marginTop: '0.5rem', color: '#059669', fontSize: '0.9rem' }}>
                            ✓ Arquivo selecionado: {novaAtividade.arquivo.name}
                          </p>
                        )}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => setShowAdicionarAtividade(false)}
                        style={{
                          backgroundColor: '#6b7280',
                          color: 'white',
                          padding: '0.75rem 1.5rem',
                          borderRadius: '0.5rem',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '1rem'
                        }}
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={adicionarNovaAtividade}
                        style={{
                          backgroundColor: categoriaSelecionada.cor,
                          color: 'white',
                          padding: '0.75rem 1.5rem',
                          borderRadius: '0.5rem',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          fontWeight: '500'
                        }}
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {categoriaSelecionada && (
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: '600' }}>
                    2. Selecione as Turmas (pode escolher várias):
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                    {turmas.map(turma => (
                      <button
                        key={turma.id}
                        onClick={() => toggleTurmaSelecionada(turma.id)}
                        style={{
                          backgroundColor: turmasSelecionadas.has(turma.id) ? '#150B53' : 'white',
                          color: turmasSelecionadas.has(turma.id) ? 'white' : '#150B53',
                          border: '2px solid #150B53',
                          padding: '0.75rem 1rem',
                          borderRadius: '0.5rem',
                          cursor: 'pointer',
                          fontWeight: '500'
                        }}
                      >
                        ✓ {turma.nome_turma}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {categoriaSelecionada && turmasSelecionadas.size > 0 && (
                <div style={{ textAlign: 'center' }}>
                  <button
                    onClick={adicionarAtividadesTurmas}
                    style={{
                      backgroundColor: '#dc2626',
                      color: 'white',
                      padding: '1rem 2rem',
                      borderRadius: '0.75rem',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '600'
                    }}
                  >
                    🚀 Aplicar {atividadesFiltradas.length} Atividades às {turmasSelecionadas.size} Turma(s)
                  </button>
                </div>
              )}
            </div>
          )}

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ fontSize: '1.1rem', color: '#666' }}>Carregando turmas...</p>
            </div>
          ) : turmas.length === 0 ? (
            <div style={{
              backgroundColor: 'white',
              padding: '3rem',
              borderRadius: '1rem',
              textAlign: 'center',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '1rem'
              }}>
                Nenhuma turma encontrada
              </h3>
              <p style={{ color: '#666', marginBottom: '2rem' }}>
                Você ainda não criou nenhuma turma. Que tal criar a primeira?
              </p>
              <button
                onClick={() => alert('Navegar para criar turma')}
                style={{
                  backgroundColor: '#150B53',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}
              >
                Criar Nova Turma
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '2rem'
            }}>
              {turmas.map((turma) => (
                <div
                  key={turma.id}
                  style={{
                    backgroundColor: 'white',
                    padding: '2rem',
                    borderRadius: '1rem',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
                    border: '1px solid #e5e7eb'
                  }}
                >
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: '#111827',
                      marginBottom: '0.5rem'
                    }}>
                      {turma.nome_turma}
                    </h3>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '1rem'
                    }}>
                      <span style={{
                        fontSize: '0.875rem',
                        color: '#666',
                        fontWeight: '500'
                      }}>
                        Código:
                      </span>
                      <code style={{
                        backgroundColor: '#CED0FF',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.875rem',
                        fontWeight: 'bold',
                        color: '#150B53'
                      }}>
                        {turma.codigo_acesso}
                      </code>
                      <button
                        onClick={() => copiarCodigo(turma.codigo_acesso)}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0.25rem',
                          color: '#666',
                          fontSize: '0.875rem'
                        }}
                        title="Copiar código"
                      >
                        📋
                      </button>
                    </div>

                    <p style={{
                      fontSize: '0.875rem',
                      color: '#666'
                    }}>
                      Criada em: {new Date(turma.data_criacao).toLocaleDateString('pt-BR')}
                    </p>
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '0.75rem',
                    flexDirection: 'column'
                  }}>
                    <button
                      onClick={() => verAlunosTurma(turma.id, turma.nome_turma)}
                      style={{
                        backgroundColor: '#150B53',
                        color: 'white',
                        padding: '0.75rem 1rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}
                    >
                      Ver Alunos
                    </button>
                    
                    <button
                      onClick={() => excluirTurma(turma.id, turma.nome_turma)}
                      style={{
                        backgroundColor: '#dc2626',
                        color: 'white',
                        padding: '0.75rem 1rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}
                    >
                      Excluir Turma
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {turmas.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <button
                onClick={() => alert('Navegar para criar turma')}
                style={{
                  backgroundColor: '#CED0FF',
                  color: '#150B53',
                  padding: '0.75rem 2rem',
                  borderRadius: '0.5rem',
                  border: '2px solid #150B53',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}
              >
                + Criar Nova Turma
              </button>
            </div>
          )}
        </div>
      </main>

      <footer style={{ backgroundColor: '#CED0FF', padding: '2rem 1rem', marginTop: '4rem' }}>
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
                width: '6rem',
                height: '6rem',
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