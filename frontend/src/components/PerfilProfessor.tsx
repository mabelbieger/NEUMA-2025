import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BotaoPerfil from './BotaoPerfil';

const API_URL = 'http://localhost:3001/api';
const BASE_URL = 'http://localhost:3001';

interface Usuario {
  id_usuario: number;
  nome: string;
  email: string;
  foto_perfil: string | null;
  tipo_usuario: string;
}

interface Turma {
  id_turma: number;
  nome_turma: string;
  codigo_acesso: string;
}

interface AlertModalProps {
  message: string;
  onClose: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({ message, onClose }) => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999
  }}>
    <div style={{
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '1rem',
      maxWidth: '400px',
      width: '90%',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
    }}>
      <p style={{ marginBottom: '1.5rem', fontSize: '1rem', color: '#111827', textAlign: 'center' }}>
        {message}
      </p>
      <button
        onClick={onClose}
        style={{
          width: '100%',
          backgroundColor: '#150B53',
          color: 'white',
          padding: '0.75rem',
          borderRadius: '0.5rem',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: '600'
        }}
      >
        OK
      </button>
    </div>
  </div>
);

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ message, onConfirm, onCancel }) => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999
  }}>
    <div style={{
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '1rem',
      maxWidth: '400px',
      width: '90%',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
    }}>
      <p style={{ marginBottom: '1.5rem', fontSize: '1rem', color: '#111827', textAlign: 'center' }}>
        {message}
      </p>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          onClick={onCancel}
          style={{
            flex: 1,
            backgroundColor: '#6b7280',
            color: 'white',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600'
          }}
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          style={{
            flex: 1,
            backgroundColor: '#dc2626',
            color: 'white',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600'
          }}
        >
          Confirmar
        </button>
      </div>
    </div>
  </div>
);

export default function PerfilProfessor() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ nome: '', email: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ message: string; onConfirm: () => void } | null>(null);

  useEffect(() => {
    const loggedUser = localStorage.getItem('loggedUser');
    
    if (!loggedUser) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(loggedUser);
    
    if (user.tipo !== 'Professor' && user.tipo_usuario !== 'Professor') {
      setAlertMessage('Acesso restrito a professores');
      setTimeout(() => navigate('/home'), 2000);
      return;
    }

    carregarDados(user.id);
  }, [navigate]);

  const carregarDados = async (idUsuario: number) => {
    try {
      const perfilResponse = await axios.get(`${API_URL}/perfil/${idUsuario}`);
      
      if (perfilResponse.data.success) {
        const userData = perfilResponse.data.usuario;
        setUsuario(userData);
        setEditData({ nome: userData.nome, email: userData.email });

        const loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');
        loggedUser.foto_perfil = userData.foto_perfil;
        localStorage.setItem('loggedUser', JSON.stringify(loggedUser));

        if (userData.id_professor) {
          const turmasResponse = await axios.get(`${API_URL}/turmas/professor/${userData.id_professor}`);
          if (turmasResponse.data.success) {
            setTurmas(turmasResponse.data.turmas);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setAlertMessage('Erro ao carregar dados do perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!usuario) return;

    try {
      const response = await axios.put(`${API_URL}/perfil/${usuario.id_usuario}`, editData);

      if (response.data.success) {
        setAlertMessage('Perfil atualizado com sucesso!');
        setUsuario({ ...usuario, nome: editData.nome, email: editData.email });
        
        const loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');
        loggedUser.nome = editData.nome;
        loggedUser.email = editData.email;
        localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
        
        setIsEditing(false);
      } else {
        setAlertMessage(response.data.message || 'Erro ao atualizar perfil');
      }
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      setAlertMessage(error.response?.data?.message || 'Erro ao atualizar perfil');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setAlertMessage('A foto deve ter no máximo 5MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUploadFoto = async () => {
    if (!selectedFile || !usuario) return;

    try {
      const formData = new FormData();
      formData.append('foto', selectedFile);

      const response = await axios.post(
        `${API_URL}/perfil/${usuario.id_usuario}/foto`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data.success) {
        setAlertMessage('Foto atualizada com sucesso!');
        setUsuario({ ...usuario, foto_perfil: response.data.foto_url });
        
        const loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');
        loggedUser.foto_perfil = response.data.foto_url;
        localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
        
        setSelectedFile(null);
        window.location.reload();
      } else {
        setAlertMessage(response.data.message || 'Erro ao atualizar foto');
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      setAlertMessage('Erro ao fazer upload da foto');
    }
  };

  const handleRemoverFoto = async () => {
    if (!usuario || !usuario.foto_perfil) return;

    setConfirmModal({
      message: 'Tem certeza que deseja remover sua foto de perfil?',
      onConfirm: async () => {
        try {
          const response = await axios.delete(`${API_URL}/perfil/${usuario.id_usuario}/foto`);

          if (response.data.success) {
            setAlertMessage('Foto removida com sucesso!');
            setUsuario({ ...usuario, foto_perfil: null });
            
            const loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');
            loggedUser.foto_perfil = null;
            localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
            
            window.location.reload();
          }
        } catch (error) {
          console.error('Erro ao remover foto:', error);
          setAlertMessage('Erro ao remover foto');
        }
        setConfirmModal(null);
      }
    });
  };

  const handleLogout = () => {
    setConfirmModal({
      message: 'Tem certeza que deseja sair?',
      onConfirm: () => {
        localStorage.removeItem('loggedUser');
        localStorage.removeItem('isAuthenticated');
        navigate('/login');
      }
    });
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>Carregando...</p>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>Erro ao carregar perfil</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <BotaoPerfil />
      
      {alertMessage && (
        <AlertModal 
          message={alertMessage} 
          onClose={() => setAlertMessage(null)} 
        />
      )}
      
      {confirmModal && (
        <ConfirmModal
          message={confirmModal.message}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal(null)}
        />
      )}
      
      <header style={{ backgroundColor: '#150B53', padding: '2rem 0' }}>
        <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              onClick={() => navigate('/home-professor')}
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
            
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: '#dc2626',
                border: 'none',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              Sair
            </button>
          </div>
        </div>
      </header>
,mm
      <main style={{ padding: '3rem 0' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{
              fontSize: '2.25rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '1rem'
            }}>
              Meu Perfil
            </h1>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
              border: '1px solid #e5e7eb',
              textAlign: 'center'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '1.5rem'
              }}>
                Foto de Perfil
              </h2>

              <div style={{
                width: '180px',
                height: '180px',
                margin: '0 auto 1.5rem',
                borderRadius: '50%',
                backgroundColor: '#150B53',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '70px',
                border: '3px solid #CED0FF',
                backgroundImage: usuario.foto_perfil ? `url(${BASE_URL}${usuario.foto_perfil})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                overflow: 'hidden'
              }}>
                {!usuario.foto_perfil && <span style={{ filter: 'brightness(0) invert(1)' }}>👤</span>}
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="foto-input"
              />

              {selectedFile ? (
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.875rem', color: '#059669', marginBottom: '0.5rem' }}>
                    ✓ Arquivo: {selectedFile.name}
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    <button
                      onClick={handleUploadFoto}
                      style={{
                        backgroundColor: '#059669',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}
                    >
                      Confirmar Upload
                    </button>
                    <button
                      onClick={() => setSelectedFile(null)}
                      style={{
                        backgroundColor: '#6b7280',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button
                    onClick={() => document.getElementById('foto-input')?.click()}
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
                    {usuario.foto_perfil ? 'Alterar Foto' : 'Adicionar Foto'}
                  </button>

                  {usuario.foto_perfil && (
                    <button
                      onClick={handleRemoverFoto}
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
                      Remover Foto
                    </button>
                  )}
                </div>
              )}

              <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '1rem' }}>
                Formatos: JPG, PNG, GIF (máx. 5MB)
              </p>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#111827',
                  margin: 0
                }}>
                  Informações Pessoais
                </h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    style={{
                      backgroundColor: '#150B53',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}
                  >
                    Editar
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleEditSubmit}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '500',
                      color: '#374151',
                      fontSize: '0.875rem'
                    }}>
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      value={editData.nome}
                      onChange={(e) => setEditData({ ...editData, nome: e.target.value })}
                      required
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
                      color: '#374151',
                      fontSize: '0.875rem'
                    }}>
                      E-mail
                    </label>
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      required
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

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="submit"
                      style={{
                        flex: 1,
                        backgroundColor: '#059669',
                        color: 'white',
                        padding: '0.75rem 1rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}
                    >
                      Salvar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setEditData({ nome: usuario.nome, email: usuario.email });
                      }}
                      style={{
                        flex: 1,
                        backgroundColor: '#6b7280',
                        color: 'white',
                        padding: '0.75rem 1rem',
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#666',
                      marginBottom: '0.25rem'
                    }}>
                      Nome:
                    </p>
                    <p style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: '#111827'
                    }}>
                      {usuario.nome}
                    </p>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#666',
                      marginBottom: '0.25rem'
                    }}>
                      E-mail:
                    </p>
                    <p style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: '#111827'
                    }}>
                      {usuario.email}
                    </p>
                  </div>

                  <div>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#666',
                      marginBottom: '0.25rem'
                    }}>
                      Tipo de Conta:
                    </p>
                    <p style={{
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: '#150B53'
                    }}>
                      Professor
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
            border: '1px solid #e5e7eb'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '1.5rem'
            }}>
              Minhas Turmas ({turmas.length})
            </h2>

            {turmas.length === 0 ? (
              <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>
                Você ainda não criou nenhuma turma.
              </p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                {turmas.map(turma => (
                  <div
                    key={turma.id_turma}
                    style={{
                      padding: '1rem',
                      border: '2px solid #CED0FF',
                      borderRadius: '0.5rem',
                      backgroundColor: '#f9fafb'
                    }}
                  >
                    <h3 style={{
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      color: '#111827',
                      marginBottom: '0.5rem'
                    }}>
                      {turma.nome_turma}
                    </h3>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#666'
                    }}>
                      Código: <code style={{
                        backgroundColor: '#CED0FF',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontWeight: 'bold',
                        color: '#150B53'
                      }}>{turma.codigo_acesso}</code>
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <button
                onClick={() => navigate('/MinhasTurmas')}
                style={{
                  backgroundColor: '#150B53',
                  color: 'white',
                  padding: '0.75rem 2rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}
              >
                Gerenciar Turmas
              </button>
            </div>
          </div>
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