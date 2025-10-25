import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser } from 'react-icons/fi';

const API_URL = 'http://localhost:3001';

export default function BotaoPerfil() {
  const navigate = useNavigate();

  const handleClick = () => {
    const loggedUser = localStorage.getItem('loggedUser');
    if (!loggedUser) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(loggedUser);
    if (user.tipo_usuario === 'Professor' || user.tipo === 'Professor') {
      navigate('/perfil-professor');
    } else {
      navigate('/perfil-aluno');
    }
  };

  const getFotoPerfil = () => {
    const loggedUser = localStorage.getItem('loggedUser');
    if (!loggedUser) return null;

    const user = JSON.parse(loggedUser);
    return user.foto_perfil ? `${API_URL}${user.foto_perfil}` : null;
  };

  const fotoPerfil = getFotoPerfil();

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
      }}
    >
      <button
        onClick={handleClick}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#150B53',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
        }}
        title="Ver Perfil"
      >
        {fotoPerfil ? (
          <img
            src={fotoPerfil}
            alt="Foto de perfil"
            style={{
              width: '100%',
              height: '60%',
              objectFit: 'cover',
              borderRadius: '30%',
            }}
          />
        ) : (
          <FiUser color="white" size={40} />
        )}
      </button>
    </div>
  );
}
