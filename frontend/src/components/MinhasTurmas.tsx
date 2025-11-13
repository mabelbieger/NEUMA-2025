import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, ArrowLeft } from 'lucide-react';
const API_URL = 'http://localhost:3001/api';
const BASE_URL = 'http://localhost:3001';

interface Turma {
  id_turma: number;
  nome_turma: string;
  codigo_acesso: string;
  data_criacao: string;
}

interface Aluno {
  id_aluno: number;
  nome: string;
  email: string;
  foto_perfil: string;
  perfil_sensorial: string;
  id_usuario: number;
}

interface Categoria {
  id_categoria: number;
  nome_categoria: string;
  cor: string;
  label: string;
}

interface Atividade {
  id_atividade: number;
  titulo: string;
  descricao: string;
  id_categoria: number;
  tipo_conteudo: string;
  conteudo: string;
  nome_arquivo: string;
  turmas: string;
  data_criacao: string;
  publica: boolean;
}

interface UserData {
  id_professor: number;
  id_usuario: number;
  nome: string;
  email: string;
  tipo_usuario: string;
  foto_perfil?: string;
}

export default function MinhasTurmas() {
  const navigate = useNavigate();
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [turmasFiltradas, setTurmasFiltradas] = useState<Turma[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [idProfessor, setIdProfessor] = useState<number | null>(null);
  const [pesquisaTurmas, setPesquisaTurmas] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);
  
  const [showModalAtividade, setShowModalAtividade] = useState(false);
  const [showListaAtividades, setShowListaAtividades] = useState(false);
  const [showAlunosTurma, setShowAlunosTurma] = useState(false);
  const [alunosTurma, setAlunosTurma] = useState<Aluno[]>([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState<Turma | null>(null);
  const [isLoadingAlunos, setIsLoadingAlunos] = useState(false);
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [atividadesFiltradas, setAtividadesFiltradas] = useState<Atividade[]>([]);
  const [isLoadingAtividades, setIsLoadingAtividades] = useState(false);
  const [pesquisaAtividades, setPesquisaAtividades] = useState('');
  const [alertMessage, setAlertMessage] = useState<{type: 'success' | 'error', message: string} | null>(null);
  
  const [categorias] = useState<Categoria[]>([
    { id_categoria: 1, nome_categoria: 'visual', cor: '#3B82F6', label: 'Visual' },
    { id_categoria: 2, nome_categoria: 'auditivo', cor: '#10B981', label: 'Auditivo' },
    { id_categoria: 3, nome_categoria: 'cinestesico', cor: '#F59E0B', label: 'Cinestésico' },
    { id_categoria: 4, nome_categoria: 'leitura_escrita', cor: '#8B5CF6', label: 'Leitura/Escrita' }
  ]);

  const [novaAtividade, setNovaAtividade] = useState({
    titulo: '',
    descricao: '',
    id_categoria: 0,
    tipo_conteudo: 'TEXTO',
    conteudo_texto: '',
    arquivo: null as File | null,
    turmas_selecionadas: [] as number[],
    publica: false
  });

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlertMessage({ type, message });
    setTimeout(() => setAlertMessage(null), 4000);
  };

  // Função para obter a URL completa da foto
  const getFotoPerfilUrl = (fotoPath?: string) => {
    if (!fotoPath) return null;
    
    // Se já for uma URL completa, retorna como está
    if (fotoPath.startsWith('http')) {
      return fotoPath;
    }
    
    // Se for um caminho relativo, adiciona o base URL
    return `${BASE_URL}${fotoPath.startsWith('/') ? '' : '/'}${fotoPath}`;
  };

  const fotoPerfilUrl = getFotoPerfilUrl(userData?.foto_perfil);

  // Função para carregar dados atualizados do perfil
  const carregarDadosPerfil = async (idUsuario: number) => {
    try {
      const perfilResponse = await axios.get(`${API_URL}/perfil/${idUsuario}`);
      
      if (perfilResponse.data.success) {
        const userData = perfilResponse.data.usuario;
        setUserData(userData);

        // Atualiza localStorage com dados atualizados
        const loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');
        loggedUser.foto_perfil = userData.foto_perfil;
        loggedUser.nome = userData.nome;
        loggedUser.email = userData.email;
        localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
      }
    } catch (error) {
      console.error('Erro ao carregar dados do perfil:', error);
    }
  };

  useEffect(() => {
    const loggedUser = localStorage.getItem('loggedUser');
    
    if (!loggedUser) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(loggedUser);
    
    if (user.tipo !== 'Professor' && user.tipo_usuario !== 'Professor') {
      showAlert('error', 'Acesso restrito a professores');
      setTimeout(() => navigate('/home'), 2000);
      return;
    }

    setUserData(user);
    
    if (user.id_professor) {
      setIdProfessor(user.id_professor);
      carregarTurmas(user.id_professor);
    } else if (user.id) {
      buscarIdProfessor(user.id);
    }

    // Carrega dados atualizados do perfil
    carregarDadosPerfil(user.id);
  }, [navigate]);

  useEffect(() => {
    if (pesquisaTurmas) {
      const filtradas = turmas.filter(turma =>
        turma.nome_turma.toLowerCase().includes(pesquisaTurmas.toLowerCase()) ||
        turma.codigo_acesso.toLowerCase().includes(pesquisaTurmas.toLowerCase())
      );
      setTurmasFiltradas(filtradas);
    } else {
      setTurmasFiltradas(turmas);
    }
  }, [pesquisaTurmas, turmas]);

  useEffect(() => {
    if (pesquisaAtividades) {
      const filtradas = atividades.filter(atividade =>
        atividade.titulo.toLowerCase().includes(pesquisaAtividades.toLowerCase()) ||
        atividade.descricao.toLowerCase().includes(pesquisaAtividades.toLowerCase()) ||
        (atividade.turmas && atividade.turmas.toLowerCase().includes(pesquisaAtividades.toLowerCase()))
      );
      setAtividadesFiltradas(filtradas);
    } else {
      setAtividadesFiltradas(atividades);
    }
  }, [pesquisaAtividades, atividades]);

  const buscarIdProfessor = async (idUsuario: number) => {
    try {
      const response = await axios.get(`${API_URL}/professor/${idUsuario}`);
      
      if (response.data.success) {
        setIdProfessor(response.data.id_professor);
        carregarTurmas(response.data.id_professor);
        
        const loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');
        loggedUser.id_professor = response.data.id_professor;
        localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
        setUserData(loggedUser);
      }
    } catch (error) {
      console.error('Erro ao buscar id_professor:', error);
      setIsLoading(false);
    }
  };

  const carregarTurmas = async (id_prof: number) => {
    try {
      const response = await axios.get(`${API_URL}/turmas/professor/${id_prof}`);

      if (response.data.success) {
        setTurmas(response.data.turmas);
        setTurmasFiltradas(response.data.turmas);
      } else {
        console.error('Erro ao carregar turmas:', response.data.message);
      }
    } catch (error) {
      console.error('Erro ao carregar turmas:', error);
      showAlert('error', 'Erro ao carregar turmas');
    } finally {
      setIsLoading(false);
    }
  };

  const carregarAlunosTurma = async (idTurma: number, turma: Turma) => {
    setIsLoadingAlunos(true);
    try {
      const response = await axios.get(`${API_URL}/turmas/${idTurma}/alunos`);
      
      if (response.data.success) {
        setAlunosTurma(response.data.alunos);
        setTurmaSelecionada(turma);
        setShowAlunosTurma(true);
      } else {
        showAlert('error', 'Erro ao carregar alunos da turma');
      }
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
      showAlert('error', 'Erro ao carregar alunos da turma');
    } finally {
      setIsLoadingAlunos(false);
    }
  };

  const carregarAtividades = async () => {
    if (!idProfessor) return;

    setIsLoadingAtividades(true);
    try {
      const response = await axios.get(`${API_URL}/atividades/professor/${idProfessor}`);

      if (response.data.success) {
        // Remove atividades duplicadas baseado no id_atividade
        const atividadesUnicas = response.data.atividades.reduce((unique: Atividade[], atividade: Atividade) => {
          const exists = unique.find(item => item.id_atividade === atividade.id_atividade);
          if (!exists) {
            unique.push(atividade);
          }
          return unique;
        }, []);
        
        setAtividades(atividadesUnicas);
        setAtividadesFiltradas(atividadesUnicas);
      }
    } catch (error) {
      console.error('Erro ao carregar atividades:', error);
      showAlert('error', 'Erro ao carregar atividades');
    } finally {
      setIsLoadingAtividades(false);
    }
  };

  const voltarPagina = () => {
    navigate('/home-professor');
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedUser');
    navigate('/login');
  };

  const handlePerfil = () => {
    navigate('/perfil-professor');
  };

  const excluirTurma = async (idTurma: number, nomeTurma: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir a turma "${nomeTurma}"?\n\nEsta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      const response = await axios.delete(`${API_URL}/turmas/${idTurma}`);

      if (response.data.success) {
        showAlert('success', 'Turma excluída com sucesso!');
        setTurmas(turmas.filter(t => t.id_turma !== idTurma));
      } else {
        showAlert('error', response.data.message || 'Erro ao excluir turma');
      }
    } catch (error: any) {
      console.error('Erro ao excluir turma:', error);
      showAlert('error', error.response?.data?.message || 'Erro ao excluir turma');
    }
  };

  const copiarCodigo = (codigo: string) => {
    navigator.clipboard.writeText(codigo).then(() => {
      showAlert('success', 'Código copiado para a área de transferência!');
    }).catch(() => {
      showAlert('error', 'Erro ao copiar código');
    });
  };

  const abrirModalAtividade = () => {
    setNovaAtividade({
      titulo: '',
      descricao: '',
      id_categoria: 0,
      tipo_conteudo: 'TEXTO',
      conteudo_texto: '',
      arquivo: null,
      turmas_selecionadas: [],
      publica: false
    });
    setShowModalAtividade(true);
  };

  const toggleTurmaSelecionada = (idTurma: number) => {
    setNovaAtividade(prev => {
      const turmas = prev.turmas_selecionadas.includes(idTurma)
        ? prev.turmas_selecionadas.filter(id => id !== idTurma)
        : [...prev.turmas_selecionadas, idTurma];
      return { ...prev, turmas_selecionadas: turmas };
    });
  };

  const handleArquivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNovaAtividade(prev => ({ ...prev, arquivo: file }));
    }
  };

  const handleCriarAtividade = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!idProfessor) {
      showAlert('error', 'Erro: Professor não identificado');
      return;
    }

    if (!novaAtividade.titulo.trim()) {
      showAlert('error', 'Preencha o título da atividade!');
      return;
    }

    if (!novaAtividade.id_categoria) {
      showAlert('error', 'Selecione um perfil sensorial!');
      return;
    }

    if (novaAtividade.tipo_conteudo !== 'TEXTO' && !novaAtividade.arquivo) {
      showAlert('error', 'Por favor, selecione um arquivo!');
      return;
    }

    if (novaAtividade.tipo_conteudo === 'TEXTO' && !novaAtividade.conteudo_texto.trim()) {
      showAlert('error', 'Preencha o conteúdo do texto!');
      return;
    }

    if (novaAtividade.tipo_conteudo === 'LINK' && !novaAtividade.conteudo_texto.trim()) {
      showAlert('error', 'Preencha a URL do link!');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('id_professor', idProfessor.toString());
      formData.append('titulo', novaAtividade.titulo);
      formData.append('descricao', novaAtividade.descricao);
      formData.append('id_categoria', novaAtividade.id_categoria.toString());
      formData.append('tipo_conteudo', novaAtividade.tipo_conteudo);
      formData.append('turmas_ids', JSON.stringify(novaAtividade.turmas_selecionadas));
      formData.append('publica', novaAtividade.publica.toString());

      if (novaAtividade.tipo_conteudo === 'TEXTO') {
        formData.append('conteudo_texto', novaAtividade.conteudo_texto);
      } else if (novaAtividade.tipo_conteudo === 'LINK') {
        formData.append('conteudo_texto', novaAtividade.conteudo_texto);
      } else if (novaAtividade.arquivo) {
        formData.append('arquivo', novaAtividade.arquivo);
      }

      const response = await axios.post(`${API_URL}/atividades`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        showAlert('success', 'Atividade criada com sucesso!');
        setShowModalAtividade(false);
        carregarAtividades();
      } else {
        showAlert('error', response.data.message || 'Erro ao criar atividade');
      }
    } catch (error) {
      console.error('Erro ao criar atividade:', error);
      showAlert('error', 'Erro ao criar atividade');
    }
  };

  const excluirAtividade = async (idAtividade: number, titulo: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir a atividade "${titulo}"?`)) {
      return;
    }

    try {
      const response = await axios.delete(`${API_URL}/atividades/${idAtividade}`);

      if (response.data.success) {
        showAlert('success', 'Atividade excluída com sucesso!');
        carregarAtividades();
      } else {
        showAlert('error', response.data.message || 'Erro ao excluir atividade');
      }
    } catch (error) {
      console.error('Erro ao excluir atividade:', error);
      showAlert('error', 'Erro ao excluir atividade');
    }
  };

  const toggleAtividadePublica = async (idAtividade: number, titulo: string, atualPublica: boolean) => {
    try {
      const response = await axios.put(`${API_URL}/atividades/${idAtividade}/publica`, {
        publica: !atualPublica
      });

      if (response.data.success) {
        showAlert('success', `Atividade "${titulo}" ${!atualPublica ? 'tornada pública' : 'tornada privada'} com sucesso!`);
        carregarAtividades();
      } else {
        showAlert('error', response.data.message || 'Erro ao atualizar atividade');
      }
    } catch (error) {
      console.error('Erro ao atualizar atividade:', error);
      showAlert('error', 'Erro ao atualizar atividade');
    }
  };

  const abrirListaAtividades = () => {
    setShowListaAtividades(true);
    carregarAtividades();
  };

  const getCategoriaCor = (idCategoria: number) => {
    const cat = categorias.find(c => c.id_categoria === idCategoria);
    return cat?.cor || '#666';
  };

  const getCategoriaLabel = (idCategoria: number) => {
    const cat = categorias.find(c => c.id_categoria === idCategoria);
    return cat?.label || 'Desconhecido';
  };

  const getPerfilSensorialInfo = (perfil: string) => {
    const perfis = {
      'visual': { label: 'Visual', cor: '#3B82F6', descricao: 'Aprende melhor com imagens, gráficos e cores' },
      'auditivo': { label: 'Auditivo', cor: '#10B981', descricao: 'Aprende melhor ouvindo e discutindo' },
      'cinestesico': { label: 'Cinestésico', cor: '#F59E0B', descricao: 'Aprende melhor com movimento e prática' },
      'leitura_escrita': { label: 'Leitura/Escrita', cor: '#8B5CF6', descricao: 'Aprende melhor lendo e escrevendo' }
    };
    
    return perfis[perfil as keyof typeof perfis] || { label: perfil, cor: '#666', descricao: 'Perfil sensorial' };
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Alert Message */}
      {alertMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          padding: '12px 20px',
          borderRadius: '8px',
          backgroundColor: alertMessage.type === 'success' ? '#d4edda' : '#f8d7da',
          border: `1px solid ${alertMessage.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
          color: alertMessage.type === 'success' ? '#155724' : '#721c24',
          fontWeight: '500',
          fontSize: '14px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center',
          minWidth: '300px',
          maxWidth: '90vw'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '16px' }}>
              {alertMessage.type === 'success' ? '✅' : '❌'}
            </span>
            {alertMessage.message}
          </div>
        </div>
      )}

      {/* Header */}
      <header style={{ 
        backgroundColor: '#150B53', 
        padding: '1rem 0', 
        position: 'relative', 
        height: '80px' 
      }}>
        {/* Botão Voltar à Esquerda */}
        <div style={{ 
          position: 'absolute', 
          left: '2rem', 
          top: '50%', 
          transform: 'translateY(-50%)' 
        }}>
          <button
            onClick={voltarPagina}
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
            <ArrowLeft size={16} />
            Voltar
          </button>
        </div>
        
        {/* Logo Centralizada */}
        <div style={{ 
          position: 'absolute', 
          left: '50%', 
          top: '50%', 
          transform: 'translate(-50%, -50%)' 
        }}>
          <img 
            src="/imagens/logo.png" 
            alt="Logo" 
            style={{ 
              width: '6rem', 
              height: '6rem',
              objectFit: 'contain'
            }} 
          />
        </div>
        
        {/* Botões à Direita */}
        <div style={{ 
          position: 'absolute', 
          right: '2rem', 
          top: '50%', 
          transform: 'translateY(-50%)' 
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem' 
          }}>
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

            <button
              onClick={handlePerfil}
              style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                backgroundColor: fotoPerfilUrl ? 'transparent' : '#CED0FF',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#150B53',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                overflow: 'hidden',
                padding: 0
              }}
            >
              {fotoPerfilUrl ? (
                <img 
                  src={fotoPerfilUrl} 
                  alt="Foto do perfil" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%'
                  }}
                  onError={(e) => {
                    // Se a imagem não carregar, mostra o emoji
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '👤';
                    e.currentTarget.parentElement!.style.backgroundColor = '#CED0FF';
                  }}
                />
              ) : (
                '👤'
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '20px 0', minHeight: 'calc(100vh - 140px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#150B53',
              marginBottom: '8px'
            }}>
              Minhas Turmas
            </h1>
            <p style={{
              color: '#6B7280',
              fontSize: '16px'
            }}>
              Gerencie suas turmas e crie atividades personalizadas
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            justifyContent: 'center', 
            marginBottom: '30px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={abrirModalAtividade}
              style={{
                backgroundColor: '#150B53',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              ➕ Criar Nova Atividade
            </button>

            <button
              onClick={abrirListaAtividades}
              style={{
                backgroundColor: '#5e19ff',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              📋 Ver Todas as Atividades
            </button>
          </div>

          {/* Search Bar */}
          <div style={{ marginBottom: '25px' }}>
            <div style={{
              backgroundColor: 'white',
              padding: '15px',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #E5E7EB'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                backgroundColor: '#F3F4F6',
                padding: '10px 15px',
                borderRadius: '6px'
              }}>
                <div style={{ fontSize: '16px', color: '#6B7280' }}>🔍</div>
                <input
                  type="text"
                  placeholder="Pesquisar turmas por nome ou código..."
                  value={pesquisaTurmas}
                  onChange={(e) => setPesquisaTurmas(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    color: '#000000'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Turmas List */}
          {isLoading ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <p style={{ fontSize: '16px', color: '#6B7280' }}>Carregando turmas...</p>
            </div>
          ) : turmasFiltradas.length === 0 ? (
            <div style={{
              backgroundColor: 'white',
              padding: '40px 20px',
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px dashed #E5E7EB'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏫</div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#150B53',
                marginBottom: '8px'
              }}>
                {pesquisaTurmas ? 'Nenhuma turma encontrada' : 'Nenhuma turma criada'}
              </h3>
              <p style={{ 
                color: '#6B7280', 
                fontSize: '14px',
                marginBottom: '20px'
              }}>
                {pesquisaTurmas ? 'Tente ajustar os termos da pesquisa.' : 'Comece criando sua primeira turma.'}
              </p>
              {!pesquisaTurmas && (
                <button
                  onClick={() => navigate('/home-professor')}
                  style={{
                    backgroundColor: '#150B53',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  Criar Primeira Turma
                </button>
              )}
            </div>
          ) : (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '20px',
                marginBottom: '30px'
              }}>
                {turmasFiltradas.map((turma) => (
                  <div
                    key={turma.id_turma}
                    style={{
                      backgroundColor: 'white',
                      padding: '20px',
                      borderRadius: '8px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      border: '1px solid #E5E7EB'
                    }}
                  >
                    <div style={{ marginBottom: '20px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#150B53',
                        marginBottom: '12px'
                      }}>
                        {turma.nome_turma}
                      </h3>
                      
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '12px',
                        flexWrap: 'wrap'
                      }}>
                        <span style={{
                          fontSize: '13px',
                          color: '#6B7280',
                          fontWeight: '500'
                        }}>
                          Código:
                        </span>
                        <code style={{
                          backgroundColor: '#F3F4F6',
                          padding: '6px 10px',
                          borderRadius: '4px',
                          fontSize: '13px',
                          fontWeight: 'bold',
                          color: '#150B53',
                          border: '1px solid #E5E7EB',
                          fontFamily: 'monospace'
                        }}>
                          {turma.codigo_acesso}
                        </code>
                        <button
                          onClick={() => copiarCodigo(turma.codigo_acesso)}
                          style={{
                            backgroundColor: '#150B53',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '6px',
                            borderRadius: '4px',
                            fontSize: '12px'
                          }}
                          title="Copiar código"
                        >
                          📋
                        </button>
                      </div>

                      <p style={{
                        fontSize: '13px',
                        color: '#6B7280',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <span>📅</span>
                        Criada em: {new Date(turma.data_criacao).toLocaleDateString('pt-BR')}
                      </p>
                    </div>

                    <div style={{
                      display: 'flex',
                      gap: '10px',
                      flexDirection: 'column'
                    }}>
                      <button
                        onClick={() => carregarAlunosTurma(turma.id_turma, turma)}
                        style={{
                          backgroundColor: '#150B53',
                          color: 'white',
                          padding: '10px 16px',
                          borderRadius: '6px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: '600'
                        }}
                      >
                        👥 Ver Alunos
                      </button>
                      
                      <button
                        onClick={() => excluirTurma(turma.id_turma, turma.nome_turma)}
                        style={{
                          backgroundColor: '#DC2626',
                          color: 'white',
                          padding: '10px 16px',
                          borderRadius: '6px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: '600'
                        }}
                      >
                        🗑️ Excluir Turma
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={() => navigate('/home-professor')}
                  style={{
                    backgroundColor: 'white',
                    color: '#150B53',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    border: '2px solid #150B53',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  ➕ Criar Nova Turma
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Modal Criar Atividade */}
      {showModalAtividade && (
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
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#150B53',
                margin: 0
              }}>
                Criar Nova Atividade
              </h2>
              <button
                onClick={() => setShowModalAtividade(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6B7280'
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCriarAtividade}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Título da Atividade *
                </label>
                <input
                  type="text"
                  value={novaAtividade.titulo}
                  onChange={(e) => setNovaAtividade(prev => ({ ...prev, titulo: e.target.value }))}
                  required
                  placeholder="Ex: Equações do 2º Grau"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Descrição
                </label>
                <textarea
                  value={novaAtividade.descricao}
                  onChange={(e) => setNovaAtividade(prev => ({ ...prev, descricao: e.target.value }))}
                  placeholder="Descreva a atividade..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Perfil Sensorial *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {categorias.map(cat => (
                    <button
                      key={cat.id_categoria}
                      type="button"
                      onClick={() => setNovaAtividade(prev => ({ ...prev, id_categoria: cat.id_categoria }))}
                      style={{
                        padding: '10px',
                        borderRadius: '6px',
                        border: `2px solid ${cat.cor}`,
                        backgroundColor: novaAtividade.id_categoria === cat.id_categoria ? cat.cor : 'white',
                        color: novaAtividade.id_categoria === cat.id_categoria ? 'white' : cat.cor,
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '12px'
                      }}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Tipo de Conteúdo *
                </label>
                <select
                  value={novaAtividade.tipo_conteudo}
                  onChange={(e) => setNovaAtividade(prev => ({ ...prev, tipo_conteudo: e.target.value, arquivo: null }))}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="TEXTO">Texto</option>
                  <option value="PDF">PDF</option>
                  <option value="IMAGEM">Imagem</option>
                  <option value="VIDEO">Vídeo</option>
                  <option value="AUDIO">Áudio</option>
                  <option value="LINK">Link Externo</option>
                </select>
              </div>

              {novaAtividade.tipo_conteudo === 'TEXTO' ? (
                <div style={{ marginBottom: '15px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '6px',
                    fontWeight: '600',
                    color: '#374151',
                    fontSize: '14px'
                  }}>
                    Conteúdo do Texto *
                  </label>
                  <textarea
                    value={novaAtividade.conteudo_texto}
                    onChange={(e) => setNovaAtividade(prev => ({ ...prev, conteudo_texto: e.target.value }))}
                    required
                    placeholder="Digite o conteúdo da atividade..."
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      resize: 'vertical',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              ) : novaAtividade.tipo_conteudo === 'LINK' ? (
                <div style={{ marginBottom: '15px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '6px',
                    fontWeight: '600',
                    color: '#374151',
                    fontSize: '14px'
                  }}>
                    URL do Link *
                  </label>
                  <input
                    type="url"
                    value={novaAtividade.conteudo_texto}
                    onChange={(e) => setNovaAtividade(prev => ({ ...prev, conteudo_texto: e.target.value }))}
                    required
                    placeholder="https://exemplo.com"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              ) : (
                <div style={{ marginBottom: '15px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '6px',
                    fontWeight: '600',
                    color: '#374151',
                    fontSize: '14px'
                  }}>
                    Arquivo * ({novaAtividade.tipo_conteudo})
                  </label>
                  <input
                    type="file"
                    onChange={handleArquivoChange}
                    required
                    accept={
                      novaAtividade.tipo_conteudo === 'PDF' ? '.pdf' :
                      novaAtividade.tipo_conteudo === 'IMAGEM' ? '.jpg,.jpeg,.png,.gif' :
                      novaAtividade.tipo_conteudo === 'VIDEO' ? '.mp4,.avi,.mov' :
                      novaAtividade.tipo_conteudo === 'AUDIO' ? '.mp3,.wav,.ogg' : '*'
                    }
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                  {novaAtividade.arquivo && (
                    <p style={{ marginTop: '6px', color: '#059669', fontSize: '12px' }}>
                      ✅ {novaAtividade.arquivo.name}
                    </p>
                  )}
                </div>
              )}

              <div style={{ marginBottom: '15px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Vincular a Turmas (opcional)
                </label>
                <div style={{ 
                  maxHeight: '120px', 
                  overflowY: 'auto', 
                  border: '1px solid #E5E7EB', 
                  borderRadius: '6px', 
                  padding: '10px'
                }}>
                  {turmas.map(turma => (
                    <label
                      key={turma.id_turma}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '8px',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        marginBottom: '4px',
                        backgroundColor: novaAtividade.turmas_selecionadas.includes(turma.id_turma) ? '#F0F9FF' : 'transparent'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={novaAtividade.turmas_selecionadas.includes(turma.id_turma)}
                        onChange={() => toggleTurmaSelecionada(turma.id_turma)}
                        style={{ marginRight: '8px' }}
                      />
                      <span style={{ fontSize: '13px', color: 'black' }}>{turma.nome_turma}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={novaAtividade.publica}
                    onChange={(e) => setNovaAtividade(prev => ({ ...prev, publica: e.target.checked }))}
                  />
                  <span style={{ fontWeight: '600', color: '#374151', fontSize: '14px' }}>
                    Tornar atividade pública
                  </span>
                </label>
                <p style={{ fontSize: '12px', color: '#6B7280', margin: '4px 0 0 24px' }}>
                  Disponível para todos os alunos na seção "Atividades Públicas"
                </p>
              </div>

              <div style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={() => setShowModalAtividade(false)}
                  style={{
                    padding: '10px 16px',
                    border: '1px solid #E5E7EB',
                    backgroundColor: 'white',
                    color: '#374151',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!novaAtividade.titulo || !novaAtividade.id_categoria}
                  style={{
                    padding: '10px 16px',
                    backgroundColor: (!novaAtividade.titulo || !novaAtividade.id_categoria) ? '#9CA3AF' : '#150B53',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: (!novaAtividade.titulo || !novaAtividade.id_categoria) ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}
                >
                  Criar Atividade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Lista Atividades */}
      {showListaAtividades && (
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
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#150B53',
                margin: 0
              }}>
                Todas as Atividades
              </h2>
              <button
                onClick={() => setShowListaAtividades(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6B7280'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{
                backgroundColor: 'white',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #E5E7EB'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  backgroundColor: '#F3F4F6',
                  padding: '8px 12px',
                  borderRadius: '4px'
                }}>
                  <div style={{ fontSize: '14px', color: '#6B7280' }}>🔍</div>
                  <input
                    type="text"
                    placeholder="Pesquisar atividades..."
                    value={pesquisaAtividades}
                    onChange={(e) => setPesquisaAtividades(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '6px',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'transparent',
                      color: '#000000'
                    }}
                  />
                </div>
              </div>
            </div>

            {isLoadingAtividades ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p style={{ color: '#6B7280' }}>Carregando atividades...</p>
              </div>
            ) : atividadesFiltradas.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#150B53',
                  marginBottom: '8px'
                }}>
                  {pesquisaAtividades ? 'Nenhuma atividade encontrada' : 'Nenhuma atividade criada'}
                </h3>
                <p style={{ color: '#6B7280', fontSize: '14px' }}>
                  {pesquisaAtividades ? 'Tente ajustar os termos da pesquisa.' : 'Comece criando sua primeira atividade!'}
                </p>
              </div>
            ) : (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                gap: '15px' 
              }}>
                {atividadesFiltradas.map(atividade => (
                  <div
                    key={atividade.id_atividade}
                    style={{
                      backgroundColor: '#F9FAFB',
                      padding: '20px',
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB'
                    }}
                  >
                    <div style={{ marginBottom: '15px' }}>
                      <h3 style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: '#150B53',
                        marginBottom: '8px'
                      }}>
                        {atividade.titulo}
                      </h3>
                      {atividade.descricao && (
                        <p style={{
                          color: '#6B7280',
                          fontSize: '13px',
                          marginBottom: '10px'
                        }}>
                          {atividade.descricao}
                        </p>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                      <span style={{
                        backgroundColor: getCategoriaCor(atividade.id_categoria),
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>
                        {getCategoriaLabel(atividade.id_categoria)}
                      </span>
                      <span style={{
                        backgroundColor: '#E5E7EB',
                        color: '#374151',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '500'
                      }}>
                        {atividade.tipo_conteudo}
                      </span>
                      {atividade.publica && (
                        <span style={{
                          backgroundColor: '#10B981',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '600'
                        }}>
                          Pública
                        </span>
                      )}
                    </div>

                    {atividade.nome_arquivo && (
                      <p style={{
                        color: '#059669',
                        fontSize: '12px',
                        marginBottom: '8px'
                      }}>
                        📎 {atividade.nome_arquivo}
                      </p>
                    )}

                    {atividade.turmas && atividade.turmas.trim() !== '' && (
                      <p style={{
                        color: '#6B7280',
                        fontSize: '12px',
                        marginBottom: '8px'
                      }}>
                        <strong>Turmas:</strong> {atividade.turmas}
                      </p>
                    )}

                    {(!atividade.turmas || atividade.turmas.trim() === '') && (
                      <p style={{
                        color: '#9CA3AF',
                        fontSize: '12px',
                        marginBottom: '8px',
                        fontStyle: 'italic'
                      }}>
                        Não vinculada a nenhuma turma
                      </p>
                    )}

                    <p style={{
                      color: '#9CA3AF',
                      fontSize: '11px',
                      marginBottom: '15px'
                    }}>
                      Criada em: {new Date(atividade.data_criacao).toLocaleDateString('pt-BR')}
                    </p>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => toggleAtividadePublica(atividade.id_atividade, atividade.titulo, atividade.publica)}
                        style={{
                          backgroundColor: atividade.publica ? '#10B981' : '#6B7280',
                          color: 'white',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '600',
                          flex: 1
                        }}
                      >
                        {atividade.publica ? 'Pública' : 'Privada'}
                      </button>
                      <button
                        onClick={() => excluirAtividade(atividade.id_atividade, atividade.titulo)}
                        style={{
                          backgroundColor: '#DC2626',
                          color: 'white',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '600',
                          flex: 1
                        }}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Alunos da Turma */}
      {showAlunosTurma && (
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
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <div>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#150B53',
                  margin: 0,
                  marginBottom: '4px'
                }}>
                  Alunos da Turma
                </h2>
                <p style={{
                  color: '#6B7280',
                  fontSize: '14px',
                  margin: 0
                }}>
                  {turmaSelecionada?.nome_turma}
                </p>
              </div>
              <button
                onClick={() => setShowAlunosTurma(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6B7280'
                }}
              >
                ×
              </button>
            </div>

            {isLoadingAlunos ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p style={{ color: '#6B7280' }}>Carregando alunos...</p>
              </div>
            ) : alunosTurma.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#150B53',
                  marginBottom: '8px'
                }}>
                  Nenhum aluno encontrado
                </h3>
                <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '20px' }}>
                  Esta turma ainda não tem alunos matriculados.
                </p>
                {turmaSelecionada && (
                  <div style={{
                    backgroundColor: '#F3F4F6',
                    padding: '12px',
                    borderRadius: '6px',
                    display: 'inline-block'
                  }}>
                    <p style={{ margin: 0, fontWeight: '600', color: '#374151' }}>
                      Código: <code style={{ 
                        backgroundColor: '#E5E7EB', 
                        padding: '4px 8px', 
                        borderRadius: '4px',
                        fontWeight: 'bold'
                      }}>{turmaSelecionada.codigo_acesso}</code>
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div style={{
                  backgroundColor: '#F0F9FF',
                  padding: '12px',
                  borderRadius: '6px',
                  marginBottom: '20px',
                  border: '1px solid #BAE6FD'
                }}>
                  <p style={{ margin: 0, color: '#0369A1', fontSize: '14px', fontWeight: '600' }}>
                    📊 {alunosTurma.length} aluno{alunosTurma.length !== 1 ? 's' : ''} matriculado{alunosTurma.length !== 1 ? 's' : ''}
                  </p>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                  gap: '15px'
                }}>
                  {alunosTurma.map(aluno => {
                    const perfilInfo = getPerfilSensorialInfo(aluno.perfil_sensorial);
                    return (
                      <div
                        key={aluno.id_aluno}
                        style={{
                          backgroundColor: 'white',
                          padding: '20px',
                          borderRadius: '8px',
                          border: `1px solid ${perfilInfo.cor}30`,
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '50%',
                          backgroundColor: `${perfilInfo.cor}20`,
                          margin: '0 auto 12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px',
                          color: perfilInfo.cor
                        }}>
                          {aluno.foto_perfil ? (
                            <img 
                              src={getFotoPerfilUrl(aluno.foto_perfil) || ''} 
                              alt={aluno.nome}
                              style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                objectFit: 'cover'
                              }}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement!.innerHTML = '👤';
                                e.currentTarget.parentElement!.style.backgroundColor = `${perfilInfo.cor}20`;
                              }}
                            />
                          ) : (
                            '👤'
                          )}
                        </div>

                        <h3 style={{
                          fontSize: '16px',
                          fontWeight: 'bold',
                          color: '#150B53',
                          marginBottom: '6px'
                        }}>
                          {aluno.nome}
                        </h3>

                        <p style={{
                          color: '#6B7280',
                          fontSize: '12px',
                          marginBottom: '10px'
                        }}>
                          {aluno.email}
                        </p>

                        <div style={{
                          backgroundColor: `${perfilInfo.cor}20`,
                          padding: '6px 12px',
                          borderRadius: '12px',
                          border: `1px solid ${perfilInfo.cor}40`
                        }}>
                          <span style={{
                            color: perfilInfo.cor,
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            {perfilInfo.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ 
        backgroundColor: '#150B53', 
        padding: '1rem 1rem'
      }}>
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
              color: '#ffffffff',
              marginBottom: '1rem'
            }}>
              Contato
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#b6b9ffff', lineHeight: '1.5' }}>
              <p><strong>Instagram:</strong><br />@projeto_neuma</p>
              <p><strong>E-mail:</strong><br />projetoneuma@gmail.com</p>
            </div>
          </div>

          <div style={{ flex: '1 1 250px', minWidth: '250px' }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: '#ffffffff',
              marginBottom: '1rem'
            }}>
              Desenvolvedoras
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#b6b9ffff', lineHeight: '1.5' }}>
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