import React from 'react';

export default function Home() {
  // Recuperar dados do usuário do sessionStorage
  const userDataString = sessionStorage.getItem('loggedUser');
  const userData = userDataString ? JSON.parse(userDataString) : null;

  return (
    <div style={{
      backgroundColor: '#150B53',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#F9F9F9',
        width: '100%',
        maxWidth: '800px',
        borderRadius: '20px',
        padding: '40px',
        textAlign: 'center',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#150B53',
          marginBottom: '20px'
        }}>
          Bem-vindo à Plataforma Neuma!
        </h1>
        
        {userData && (
          <div style={{
            backgroundColor: '#CED0FF',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '20px'
          }}>
            <h2 style={{ color: '#150B53', marginBottom: '10px' }}>
              Olá, {userData.nome}!
            </h2>
            <p style={{ color: '#150B53' }}>
              Tipo de usuário: {userData.tipo_usuario}
            </p>
            <p style={{ color: '#150B53' }}>
              Email: {userData.email}
            </p>
          </div>
        )}
        
        <p style={{
          fontSize: '18px',
          color: '#666',
          marginBottom: '30px'
        }}>
          Você está logado com sucesso!
        </p>
        
        <button 
          onClick={() => {
            sessionStorage.removeItem('loggedUser');
            window.location.href = '/login';
          }}
          style={{
            backgroundColor: '#150B53',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}